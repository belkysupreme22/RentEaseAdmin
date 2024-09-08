import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Avatar } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Tenants = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/admin/users/tenant");
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedTenant(null);
  };

  const isProfileComplete = (tenant) => {
    return tenant.first_name && tenant.phone_number && tenant.address;
  };

  return (
    <Box m="20px">
      <Header title="TENANTS" subtitle="List of Tenants" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={50} sx={{ color: '#3498db' }} />
        </Box>
      ) : tenants.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          No tenants available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tenants.map((tenant) => (
            <Grid item xs={12} sm={6} md={4} key={tenant._id}>
              <Card
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                      src={`https://rentease-1-n9w2.onrender.com/uploads/${tenant.profile_picture}`}
                      alt={tenant.user_name}
                      sx={{ width: 48, height: 48, marginRight: 2 }}
                    />
                    <Typography variant="h5" component="div">
                      {tenant.user_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {tenant.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Role:</strong> Tenant
                  </Typography>
                  <Box display="flex" mt="10px">
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(tenant)}>
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTenant && (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Tenant Details</DialogTitle>
          <DialogContent>
            {isProfileComplete(selectedTenant) ? (
              <>
                <Typography variant="h6">{`${selectedTenant.first_name} ${selectedTenant.middle_name || ''} ${selectedTenant.last_name || ''}`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {selectedTenant.phone_number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Address:</strong> {selectedTenant.address}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Profile not completed yet.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Tenants;
