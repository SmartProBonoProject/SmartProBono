import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Welcome to SmartProBono
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Free Legal Information and Resources
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => navigate('/contracts')}
          >
            <Typography variant="h5" gutterBottom>
              Contracts
            </Typography>
            <Typography color="text.secondary">
              Learn about contracts, agreements, and legal documents
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => navigate('/rights')}
          >
            <Typography variant="h5" gutterBottom>
              Legal Rights
            </Typography>
            <Typography color="text.secondary">
              Understand your rights and legal protections
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => navigate('/procedures')}
          >
            <Typography variant="h5" gutterBottom>
              Legal Procedures
            </Typography>
            <Typography color="text.secondary">
              Step-by-step guides for legal processes
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;