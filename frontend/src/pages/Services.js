import { Typography, Grid, Paper } from '@mui/material';
import PageContainer from '../components/PageContainer';

const Services = () => {
  return (
    <PageContainer>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ mb: 4 }}  // More space below title
      >
        Our Services
      </Typography>
      
      <Grid container spacing={4}>  {/* Increased grid spacing */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 4,    // More padding inside cards
              height: '100%',  // Equal height cards
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Legal Consultation
            </Typography>
            <Typography variant="body1">
              Professional legal advice and consultation services.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Document Review
            </Typography>
            <Typography variant="body1">
              Expert review of legal documents and contracts.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Legal Representation
            </Typography>
            <Typography variant="body1">
              Professional representation for your legal matters.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Services;