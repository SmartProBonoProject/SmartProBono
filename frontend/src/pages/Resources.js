import { useState } from 'react';
import { 
  Typography, Grid, Paper, Card, CardContent, 
  Accordion, AccordionSummary, AccordionDetails,
  Button, TextField, InputAdornment, Box, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import SchoolIcon from '@mui/icons-material/School';
import PageContainer from '../components/PageContainer';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const legalResources = {
    documents: [
      {
        title: "Legal Forms Library",
        description: "Access common legal forms and documents",
        categories: ["Forms", "Templates"],
        link: "#"
      },
      {
        title: "Court Documents",
        description: "Standard court filing templates and examples",
        categories: ["Court", "Forms"],
        link: "#"
      },
      {
        title: "Legal Guides",
        description: "Step-by-step guides for legal procedures",
        categories: ["Guides", "Education"],
        link: "#"
      }
    ],
    education: [
      {
        title: "Know Your Rights",
        description: "Essential information about legal rights and protections",
        topics: ["Civil Rights", "Consumer Rights", "Employment Rights"]
      },
      {
        title: "Legal Procedures",
        description: "Understanding court procedures and legal processes",
        topics: ["Court Process", "Filing Documents", "Legal Timeline"]
      },
      {
        title: "Legal Terms",
        description: "Dictionary of common legal terms and definitions",
        topics: ["Terminology", "Definitions", "Legal Language"]
      }
    ],
    faqs: [
      {
        question: "How do I file a small claims case?",
        answer: "Small claims cases involve the following steps: 1) Gather documentation 2) File proper forms 3) Pay filing fees 4) Serve the defendant 5) Attend the hearing"
      },
      {
        question: "What are my tenant rights?",
        answer: "Tenants have rights including: 1) Habitable living conditions 2) Privacy 3) Security deposit protection 4) Proper notice for landlord entry 5) Protection against discrimination"
      },
      {
        question: "How do I respond to a legal notice?",
        answer: "When receiving a legal notice: 1) Read carefully 2) Note deadlines 3) Gather relevant documents 4) Consider legal consultation 5) Respond within timeframe"
      }
    ]
  };

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Legal Resources
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search resources..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Document Resources */}
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DescriptionIcon /> Document Resources
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {legalResources.documents.map((doc, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {doc.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {doc.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {doc.categories.map((category, i) => (
                    <Chip 
                      key={i} 
                      label={category} 
                      size="small" 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                  ))}
                </Box>
                <Button variant="contained" href={doc.link}>
                  Access Documents
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Educational Resources */}
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SchoolIcon /> Educational Resources
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {legalResources.education.map((edu, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {edu.title}
              </Typography>
              <Typography variant="body2" paragraph>
                {edu.description}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Key Topics:
              </Typography>
              <Box>
                {edu.topics.map((topic, i) => (
                  <Chip 
                    key={i} 
                    label={topic} 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* FAQs */}
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GavelIcon /> Frequently Asked Questions
      </Typography>
      {legalResources.faqs.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </PageContainer>
  );
};

export default Resources;