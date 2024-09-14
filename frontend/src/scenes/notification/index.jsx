import React, { useState, useEffect } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup, Badge, Button, Card, CardContent, CardActions, Divider, useTheme } from '@mui/material';
import { fetchVerifiedProfiles, fetchVerifiedProperties } from '../../api/notifications';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const [selectedToggle, setSelectedToggle] = useState('accounts');
  const [accounts, setAccounts] = useState([]);
  const [properties, setProperties] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleToggleChange = (event, newToggle) => {
    if (newToggle !== null) {
      setSelectedToggle(newToggle);
    }
  };

  // Fetch data for notifications
  const fetchData = async () => {
    try {
      if (selectedToggle === 'accounts') {
        const profilesData = await fetchVerifiedProfiles();
        setAccounts(profilesData);
      } else if (selectedToggle === 'properties') {
        const propertiesData = await fetchVerifiedProperties();
        setProperties(propertiesData);
      }
    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(() => {
      fetchData(); // Fetch data every 10 seconds
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [selectedToggle]);

  useEffect(() => {
    fetchData(); // Fetch data on initial load
  }, []);

  const handleViewDetails = (id) => {
    if (selectedToggle === 'accounts') {
      navigate('/account');
    } else if (selectedToggle === 'properties') {
      navigate('/property');
    } 
  };

  return (
    <Box p={2} sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      <Box display="flex" justifyContent="center" mb={2}>
        <ToggleButtonGroup
          color="primary"
          value={selectedToggle}
          exclusive
          onChange={handleToggleChange}
          aria-label="notification toggle"
          sx={{ display: 'flex' }}
        >
          <ToggleButton
            value="accounts"
            sx={{
              py: 2,
              px: 4,
              fontWeight: 'bold',
              fontSize: '1rem',
              color: theme.palette.text.primary,
              border: `2px solid ${theme.palette.mode === 'light' ? 'black' : 'white'}`,
              '&.Mui-selected': {
                color: theme.palette.text.primary,
                backgroundColor: 'transparent',
                borderColor: theme.palette.mode === 'light' ? 'black' : 'white',
              },
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Badge badgeContent={accounts.length} color="error">
              Accounts Verification
            </Badge>
          </ToggleButton>
          
          <ToggleButton
            value="properties"
            sx={{
              py: 2,
              px: 4,
              fontWeight: 'bold',
              fontSize: '1rem',
              color: theme.palette.text.primary,
              border: `2px solid ${theme.palette.mode === 'light' ? 'black' : 'white'}`,
              '&.Mui-selected': {
                color: theme.palette.text.primary,
                backgroundColor: 'transparent',
                borderColor: theme.palette.mode === 'light' ? 'black' : 'white',
              },
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Badge badgeContent={properties.length} color="error">
              Properties Verification
            </Badge>
          </ToggleButton>
          
          
        </ToggleButtonGroup>
      </Box>

      <Box mt={4} display="flex" flexDirection="column" gap={2}>
        {selectedToggle === 'accounts' && accounts.map((account, index) => (
          <Card key={account._id} variant="outlined" sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333', color: theme.palette.text.primary }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">{index + 1}. {account.first_name} {account.middle_name} {account.last_name}</Typography>
              <Typography variant="body2">Verification Status: {account.verification}</Typography>
              <Typography variant="body2">Created Date: {new Date(account.createdAt).toLocaleDateString()}</Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                size="small"
                color="primary"
                sx={{
                  backgroundColor: theme.palette.mode === 'light' ? '#007bff' : '#0056b3',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? '#0056b3' : '#003d7a',
                  },
                }}
                onClick={() => handleViewDetails(account._id)}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}

        {selectedToggle === 'properties' && properties.map((property, index) => (
          <Card key={property._id} variant="outlined" sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333', color: theme.palette.text.primary }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">{index + 1}. {property.property_name}</Typography>
              <Typography variant="body2">Category: {property.category}</Typography>
              <Typography variant="body2">Price: ${property.price}</Typography>
              <Typography variant="body2">Status: {property.status ? 'Active' : 'Inactive'}</Typography>
              <Typography variant="body2">Created Date: {new Date(property.createdAt).toLocaleDateString()}</Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                size="small"
                color="primary"
                sx={{
                  backgroundColor: theme.palette.mode === 'light' ? '#007bff' : '#0056b3',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? '#0056b3' : '#003d7a',
                  },
                }}
                onClick={() => handleViewDetails(property._id)}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}

       
      </Box>
    </Box>
  );
};

export default NotificationsPage;
