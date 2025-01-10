import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import PageLayout from '../components/PageLayout';
import { generateContract } from '../services/api';

const templates = {
  'Last Will and Testament': {
    icon: <DescriptionIcon fontSize="large" />,
    description: 'Template for creating a last will and testament',
    languages: ['English'],
    category: 'PERSONAL',
    color: '#1976d2',
    fields: ['fullName', 'address', 'beneficiaries', 'executor']
  },
  'Power of Attorney': {
    icon: <GavelIcon fontSize="large" />,
    description: 'Legal document granting authority to act on behalf of another',
    languages: ['English'],
    category: 'LEGAL',
    color: '#2e7d32',
    fields: ['grantor', 'attorney', 'powers', 'effectiveDate']
  },
  'Rental Agreement': {
    icon: <HomeIcon fontSize="large" />,
    description: 'Property rental contract',
    languages: ['English', 'Spanish', 'French'],
    category: 'REAL_ESTATE',
    color: '#ed6c02',
    fields: ['landlord', 'tenant', 'property', 'rent', 'term']
  },
  'Employment Contract': {
    icon: <WorkIcon fontSize="large" />,
    description: 'Standard employment agreement template',
    languages: ['English', 'Spanish'],
    category: 'EMPLOYMENT',
    color: '#9c27b0',
    fields: ['employer', 'employee', 'position', 'salary', 'startDate']
  },
  'Non-Disclosure Agreement': {
    icon: <BusinessIcon fontSize="large" />,
    description: 'Confidentiality agreement for business purposes',
    languages: ['English'],
    category: 'BUSINESS',
    color: '#0288d1',
    fields: ['disclosingParty', 'receivingParty', 'purpose', 'duration']
  },
  'Service Agreement': {
    icon: <DescriptionIcon fontSize="large" />,
    description: 'Professional service contract template',
    languages: ['English', 'Spanish', 'French'],
    category: 'BUSINESS',
    color: '#7b1fa2',
    fields: ['serviceProvider', 'client', 'services', 'compensation']
  }
};

const categories = [
  { value: 'ALL', label: 'ALL TEMPLATES', icon: <DescriptionIcon /> },
  { value: 'BUSINESS', label: 'BUSINESS', icon: <BusinessIcon /> },
  { value: 'EMPLOYMENT', label: 'EMPLOYMENT', icon: <WorkIcon /> },
  { value: 'REAL_ESTATE', label: 'REAL ESTATE', icon: <HomeIcon /> },
  { value: 'PERSONAL', label: 'PERSONAL', icon: <PersonIcon /> },
  { value: 'LEGAL', label: 'LEGAL', icon: <GavelIcon /> },
  { value: 'HEALTHCARE', label: 'HEALTHCARE', icon: <LocalHospitalIcon /> }
];

function Contracts() {
  const [category, setCategory] = useState('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  const handleTemplateSelect = (templateName) => {
    setSelectedTemplate(templateName);
    setFormData({});
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    setFormData({});
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleGenerate = async () => {
    try {
      await generateContract(selectedTemplate, formData, selectedLanguage);
      setShowSuccess(true);
      handleClose();
    } catch (error) {
      console.error('Error generating document:', error);
      // Show error message to user
      alert('Failed to generate document. Please try again.');
    }
  };

  const filteredTemplates = Object.entries(templates).filter(([_, template]) => 
    category === 'ALL' || template.category === category
  );

  return (
    <PageLayout
      title="Legal Contract Templates"
      description="Generate professional legal documents in multiple languages"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={category}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontSize: '0.9rem'
              }
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat.value}
                value={cat.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {cat.icon}
                    <span>{cat.label}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {filteredTemplates.map(([name, template]) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      color: template.color,
                      mr: 2 
                    }}>
                      {template.icon}
                    </Box>
                    <Typography variant="h6" component="h2">
                      {name}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {template.languages.map((lang) => (
                      <Chip
                        key={lang}
                        label={lang}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleTemplateSelect(name)}
                    startIcon={<DownloadIcon />}
                    sx={{
                      bgcolor: template.color,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: template.color,
                        filter: 'brightness(0.9)'
                      }
                    }}
                  >
                    Generate
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={!!selectedTemplate} 
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          {selectedTemplate && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Generate {selectedTemplate}</Typography>
                  <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {templates[selectedTemplate].fields.map((field) => (
                    <Grid item xs={12} key={field}>
                      <TextField
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        value={formData[field] || ''}
                        onChange={handleInputChange(field)}
                        variant="outlined"
                      />
                    </Grid>
                  ))}
                  {templates[selectedTemplate].languages.length > 1 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Select Language
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {templates[selectedTemplate].languages.map((lang) => (
                          <Chip
                            key={lang}
                            label={lang}
                            onClick={() => setSelectedLanguage(lang)}
                            color={selectedLanguage === lang ? 'primary' : 'default'}
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  startIcon={<DownloadIcon />}
                  sx={{ 
                    textTransform: 'none',
                    bgcolor: templates[selectedTemplate].color,
                    '&:hover': {
                      bgcolor: templates[selectedTemplate].color,
                      filter: 'brightness(0.9)'
                    }
                  }}
                >
                  Generate Document
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogContent>
            <Alert 
              severity="success"
              onClose={() => setShowSuccess(false)}
            >
              Document generated successfully! Check your downloads folder.
            </Alert>
          </DialogContent>
        </Dialog>
      </Container>
    </PageLayout>
  );
}

export default Contracts; 