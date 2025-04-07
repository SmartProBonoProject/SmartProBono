import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Button,
  Alert,
} from '@mui/material';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
const DocumentGeneratorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const documentCategories = [
    {
      id: 'housing',
      title: t('documentGenerator.categories.housing', 'Housing Documents'),
      description: t(
        'documentGenerator.categories.housingDesc',
        'Eviction appeals, lease agreements, and tenant rights documents.'
      ),
      icon: <HomeWorkIcon fontSize="large" />,
      color: '#4caf50',
      documents: [
        {
          id: 'eviction_appeal',
          name: t('documentGenerator.documents.evictionAppeal', 'Eviction Appeal'),
        },
        {
          id: 'lease_termination',
          name: t('documentGenerator.documents.leaseTermination', 'Lease Termination Notice'),
        },
        {
          id: 'repair_request',
          name: t('documentGenerator.documents.repairRequest', 'Repair Request'),
        },
      ],
    },
    {
      id: 'legal',
      title: t('documentGenerator.categories.legal', 'Legal Forms'),
      description: t(
        'documentGenerator.categories.legalDesc',
        'Small claims, expungement requests, and power of attorney forms.'
      ),
      icon: <GavelIcon fontSize="large" />,
      color: '#2196f3',
      documents: [
        {
          id: 'small_claims',
          name: t('documentGenerator.documents.smallClaims', 'Small Claims Complaint'),
        },
        {
          id: 'expungement',
          name: t('documentGenerator.documents.expungement', 'Record Expungement'),
        },
        {
          id: 'power_of_attorney',
          name: t('documentGenerator.documents.powerOfAttorney', 'Power of Attorney'),
        },
      ],
    },
    {
      id: 'family',
      title: t('documentGenerator.categories.family', 'Family Documents'),
      description: t(
        'documentGenerator.categories.familyDesc',
        'Child custody, divorce, and family support documents.'
      ),
      icon: <FamilyRestroomIcon fontSize="large" />,
      color: '#ff9800',
      documents: [
        {
          id: 'child_custody',
          name: t('documentGenerator.documents.childCustody', 'Child Custody Agreement'),
        },
        {
          id: 'child_support',
          name: t('documentGenerator.documents.childSupport', 'Child Support Calculation'),
        },
        {
          id: 'divorce_petition',
          name: t('documentGenerator.documents.divorcePetition', 'Divorce Petition'),
        },
      ],
    },
    {
      id: 'business',
      title: t('documentGenerator.categories.business', 'Business Documents'),
      description: t(
        'documentGenerator.categories.businessDesc',
        'Business formation, contracts, and employment agreements.'
      ),
      icon: <BusinessCenterIcon fontSize="large" />,
      color: '#9c27b0',
      documents: [
        {
          id: 'llc_formation',
          name: t('documentGenerator.documents.llcFormation', 'LLC Formation'),
        },
        {
          id: 'employment_contract',
          name: t('documentGenerator.documents.employmentContract', 'Employment Contract'),
        },
        {
          id: 'non_disclosure',
          name: t('documentGenerator.documents.nonDisclosure', 'Non-Disclosure Agreement'),
        },
      ],
    },
    {
      id: 'accessibility',
      title: t('documentGenerator.categories.accessibility', 'Accessibility & Rights'),
      description: t(
        'documentGenerator.categories.accessibilityDesc',
        'ADA accommodation requests, discrimination complaints, and rights assertions.'
      ),
      icon: <AccessibilityNewIcon fontSize="large" />,
      color: '#f44336',
      documents: [
        {
          id: 'ada_request',
          name: t('documentGenerator.documents.adaRequest', 'ADA Accommodation Request'),
        },
        {
          id: 'discrimination_complaint',
          name: t(
            'documentGenerator.documents.discriminationComplaint',
            'Discrimination Complaint'
          ),
        },
        {
          id: 'civil_rights',
          name: t('documentGenerator.documents.civilRights', 'Civil Rights Assertion'),
        },
      ],
    },
    {
      id: 'general',
      title: t('documentGenerator.categories.general', 'General Documents'),
      description: t(
        'documentGenerator.categories.generalDesc',
        'Wills, living wills, and other general legal documents.'
      ),
      icon: <DescriptionIcon fontSize="large" />,
      color: '#607d8b',
      documents: [
        { id: 'simple_will', name: t('documentGenerator.documents.simpleWill', 'Simple Will') },
        { id: 'living_will', name: t('documentGenerator.documents.livingWill', 'Living Will') },
        {
          id: 'debt_collection',
          name: t('documentGenerator.documents.debtCollection', 'Debt Collection Dispute'),
        },
      ],
    },
  ];
  const handleCategorySelect = categoryId => {
    // For now, just navigate to the document generator with the category as a parameter
    navigate(`/document-generator/category/${categoryId}`);
  };
  const handleDocumentSelect = (categoryId, documentId) => {
    // Navigate to the document form with the specific document type
    navigate(`/document-generator/form/${documentId}`);
  };
  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('documentGenerator.pageTitle', 'Legal Document Generator')}
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            {t(
              'documentGenerator.pageDescription',
              'Create professional legal documents in minutes. Select a category below to get started.'
            )}
          </Typography>
        </Box>
        <Alert
          severity="info"
          sx={{ mb: 4 }}
          action={
            <Button
              color="primary"
              size="small"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/document-templates')}
            >
              {t('Try New System')}
            </Button>
          }
        >
          <Typography variant="subtitle1">
            {t('New Document Templates System Available!')}
          </Typography>
          <Typography variant="body2">
            {t(
              "We've upgraded our document generation system with new templates, improved user experience, and tiered access levels. Try our new system for the best experience."
            )}
          </Typography>
        </Alert>
        <Grid container spacing={4}>
          {documentCategories.map(category => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCategorySelect(category.id)}
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: category.color,
                      color: 'white',
                    }}
                  >
                    {category.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {category.description}
                    </Typography>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {t('documentGenerator.availableDocuments', 'Available Documents:')}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {category.documents.map(doc => (
                        <Typography component="li" variant="body2" key={doc.id} sx={{ mb: 0.5 }}>
                          {doc.name}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/document-templates')}
            endIcon={<ArrowForwardIcon />}
          >
            {t('View All Document Templates')}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {t(
              'Our new document template system offers improved templates with tiered access for different user needs.'
            )}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
export default DocumentGeneratorPage;