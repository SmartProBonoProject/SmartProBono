import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageContainer from '../components/PageContainer';

const Resources = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  // Legal Documents Section
  const documentTypes = [
    {
      title: "Court Forms",
      description: "Access and generate common court forms",
      examples: [
        "Small Claims Forms",
        "Family Court Documents",
        "Civil Case Forms"
      ]
    },
    {
      title: "Legal Letters",
      description: "Generate legal correspondence",
      examples: [
        "Demand Letters",
        "Cease and Desist",
        "Legal Notices"
      ]
    },
    {
      title: "Legal Research",
      description: "Access legal research tools",
      examples: [
        "Case Law Search",
        "Statute Database",
        "Legal Precedents"
      ]
    }
  ];

  // Legal Guidelines Section
  const guidelines = [
    {
      title: "Court Procedures",
      content: "Step-by-step guides for court proceedings",
      details: [
        "Filing Documents",
        "Court Appearances",
        "Legal Deadlines"
      ]
    },
    {
      title: "Legal Rights",
      content: "Understanding your legal rights",
      details: [
        "Constitutional Rights",
        "Civil Rights",
        "Consumer Rights"
      ]
    },
    {
      title: "Legal Process",
      content: "Understanding legal procedures",
      details: [
        "Legal Timeline",
        "Required Documents",
        "Next Steps"
      ]
    }
  ];

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Here we would connect to your backend LLM
    try {
      // Simulate LLM response
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Legal Resources
      </Typography>

      {/* Legal Assistant Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Legal Research Assistant
        </Typography>
        <form onSubmit={handleQuerySubmit}>
          <TextField
            fullWidth
            label="Ask a legal research question"
            multiline
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !query.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Answer'}
          </Button>
        </form>
      </Paper>

      {/* Legal Documents Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Legal Documents
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {documentTypes.map((type, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {type.title}
              </Typography>
              <Typography variant="body2" paragraph>
                {type.description}
              </Typography>
              <ul>
                {type.examples.map((example, i) => (
                  <li key={i}>
                    <Typography variant="body2">{example}</Typography>
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Legal Guidelines Section */}
      <Typography variant="h5" gutterBottom>
        Legal Guidelines
      </Typography>
      {guidelines.map((guideline, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{guideline.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{guideline.content}</Typography>
            <ul>
              {guideline.details.map((detail, i) => (
                <li key={i}>
                  <Typography variant="body2">{detail}</Typography>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      ))}
    </PageContainer>
  );
};

export default Resources;