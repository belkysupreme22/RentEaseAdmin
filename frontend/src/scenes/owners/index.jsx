import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Avatar } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Owners = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/admin/users/landlord");
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleViewDetails = (owner) => {
    setSelectedOwner(owner);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedOwner(null);
  };

  return (
    <Box m="20px">
      <Header title="OWNERS" subtitle="List of Owners" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={50} sx={{ color: '#3498db' }} />
        </Box>
      ) : owners.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          No owners available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {owners.map((owner) => (
            <Grid item xs={12} sm={6} md={4} key={owner._id}>
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
                      src={`http://10.139.167.95:8000/uploads/${owner.profile_picture}`}
                      alt={owner.user_name}
                      sx={{ width: 48, height: 48, marginRight: 2 }}
                    />
                    <Typography variant="h5" component="div">
                      {owner.user_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {owner.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Role:</strong> Owner
                  </Typography>
                  <Box display="flex" mt="10px">
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(owner)}>
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedOwner && (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Owner Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Full Name: {`${selectedOwner.first_name} ${selectedOwner.middle_name || ''}`}</Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Phone:</strong> {selectedOwner.phone_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Address:</strong> {selectedOwner.address}
            </Typography>
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

export default Owners;
