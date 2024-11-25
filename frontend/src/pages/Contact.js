import { Typography, TextField, Button, Grid, Paper } from '@mui/material';
import PageContainer from '../components/PageContainer';

const Contact = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <PageContainer>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ mb: 4 }}
      >
        Contact Us
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 5 },  // Responsive padding
          mt: 4,
          maxWidth: 800,        // Limit form width
          mx: 'auto'            // Center the form
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>  {/* Increased form field spacing */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ 
                  mt: 2,
                  px: 4,    // Wider button
                  py: 1.5   // Taller button
                }}
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageContainer>
  );
};

export default Contact;