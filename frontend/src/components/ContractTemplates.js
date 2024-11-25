import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

const ContractTemplates = () => {
  const templates = [
    {
      title: "Basic Service Agreement",
      description: "A simple template for service-based contracts",
      downloadLink: "/templates/service-agreement.pdf"
    },
    {
      title: "Non-Disclosure Agreement",
      description: "Standard NDA template for confidentiality",
      downloadLink: "/templates/nda.pdf"
    }
  ];

  return (
    <Grid container spacing={3}>
      {templates.map((template, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {template.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {template.description}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                href={template.downloadLink}
              >
                Download Template
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ContractTemplates;
