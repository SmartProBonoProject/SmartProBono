import { useState } from 'react';
import { 
  Grid, Card, CardContent, Typography, Button, 
  Dialog, TextField, Tab, Tabs, Box, IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';

const ContractTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});

  const categories = [
    "All",
    "Business",
    "Employment",
    "Real Estate",
    "Personal",
    "Legal",
    "Technology",
    "Healthcare"
  ];

  const templates = [
    {
      title: "Last Will and Testament",
      category: "Personal",
      description: "Template for creating a last will and testament",
      fields: ['Testator Name', 'Executor Name', 'Beneficiaries', 'Assets'],
      languages: ['English']
    },
    {
      title: "Power of Attorney",
      category: "Legal",
      description: "Legal document granting authority to act on behalf of another",
      fields: ['Principal Name', 'Agent Name', 'Powers Granted', 'Effective Date'],
      languages: ['English']
    },
    {
      title: "Affidavit",
      category: "Legal",
      description: "Sworn statement of fact",
      fields: ['Affiant Name', 'Statement of Facts', 'Date'],
      languages: ['English']
    },
    {
      title: "Rental Agreement",
      category: "Real Estate",
      description: "Property rental contract",
      fields: ['Landlord', 'Tenant', 'Property Address', 'Rent Amount', 'Term'],
      languages: ['English', 'Spanish', 'French']
    },
    {
      title: "Deed of Sale",
      category: "Real Estate",
      description: "Legal document for the sale of property",
      fields: ['Seller Name', 'Buyer Name', 'Property Description', 'Sale Price'],
      languages: ['English']
    },
    {
      title: "Service Agreement",
      category: "Business",
      description: "Professional service contract template",
      fields: ['Provider Name', 'Client Name', 'Service Details', 'Payment Terms'],
      languages: ['English', 'Spanish', 'French']
    },
    {
      title: "Employment Contract",
      category: "Employment",
      description: "Standard employment agreement",
      fields: ['Employer', 'Employee', 'Position', 'Salary', 'Start Date'],
      languages: ['English', 'Spanish', 'French']
    },
    {
      title: "Software License Agreement",
      category: "Technology",
      description: "License agreement for software use",
      fields: ['Licensor', 'Licensee', 'Software Description', 'License Fee'],
      languages: ['English', 'Spanish']
    },
    {
      title: "Healthcare Service Agreement",
      category: "Healthcare",
      description: "Agreement for healthcare services",
      fields: ['Provider', 'Patient', 'Service Description', 'Payment Terms'],
      languages: ['English']
    }
    // Add more templates as needed...
  ];

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 0 || template.category === categories[category];
    return matchesSearch && matchesCategory;
  });

  const handleGenerateDoc = (template) => {
    setSelectedTemplate(template);
    setOpen(true);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Contract Document', 10, 10);
    doc.text(`Provider: ${formData['Provider Name']}`, 10, 20);
    // Add more fields as needed
    doc.save('contract.pdf');
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box>
      {/* Search and Categories */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Tabs 
          value={category} 
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((cat, index) => (
            <Tab key={index} label={cat} />
          ))}
        </Tabs>
      </Box>

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {template.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {template.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available in: {template.languages.join(', ')}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button 
                    variant="contained" 
                    onClick={() => handleGenerateDoc(template)}
                    startIcon={<FileDownloadIcon />}
                  >
                    Generate
                  </Button>
                  <IconButton 
                    color="primary"
                    onClick={handleExportPDF}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Generation Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Fill in the details for {selectedTemplate?.title}
          </Typography>
          <form>
            {selectedTemplate?.fields.map((field, index) => (
              <TextField
                key={index}
                label={field}
                name={field}
                fullWidth
                required
                margin="normal"
                onChange={handleFormChange}
              />
            ))}
            <Button 
              variant="contained" 
              onClick={handleExportPDF}
              sx={{ mt: 2 }}
            >
              Export as PDF
            </Button>
          </form>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ContractTemplates;
