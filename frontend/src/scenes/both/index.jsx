import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Both = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user's details
  const [open, setOpen] = useState(false); // State to control the dialog visibility

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://renteaseadmin.onrender.com/admin/users/both");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    // Check if the user profile is complete
    const isProfileComplete = user.first_name && user.phone_number && user.address;

    if (isProfileComplete) {
      setSelectedUser(user);
      setOpen(true);
    } else {
      alert("This profile is not complete yet.");
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box m="20px">
      <Header title="USERS WITH BOTH ROLES" subtitle="" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={50} sx={{ color: '#3498db' }} />
        </Box>
      ) : users.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          No users with both roles available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {user.user_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Role:</strong> Both
                  </Typography>
                  <Box display="flex" mt="10px">
                    <Button variant="contained" color="primary" onClick={() => handleViewDetails(user)}>
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedUser && (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">{`${selectedUser.first_name} ${selectedUser.middle_name || ''} ${selectedUser.last_name}`}</Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Phone:</strong> {selectedUser.phone_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Address:</strong> {selectedUser.address}
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

export default Both;
