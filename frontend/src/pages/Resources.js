import { Typography, Grid, Paper } from '@mui/material';
import PageContainer from '../components/PageContainer';

const Resources = () => {
  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Legal Resources
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Legal Documents
            </Typography>
            <Typography variant="body1">
              Access to common legal documents and forms.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Legal Guidelines
            </Typography>
            <Typography variant="body1">
              Understanding legal procedures and requirements.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Resources;