import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { documentTemplates } from '../data/documentTemplateLibrary';

// Mock function to generate document content based on template and form data
const generateDocumentContent = (template, formData) => {
  // This is a simple mock implementation
  // In a real app, this would be a more complex template rendering

  const currentDate = new Date().toLocaleDateString();

  // Basic header with name and date
  let content = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #2c3e50;">${template.name}</h1>
        <p>Generated on ${currentDate}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p><strong>Prepared for:</strong> ${formData.fullName || 'N/A'}</p>
        <p><strong>Email:</strong> ${formData.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
        <p><strong>Effective Date:</strong> ${formData.effectiveDate || currentDate}</p>
        <p><strong>Purpose:</strong> ${
          formData.documentPurpose === 'personal'
            ? 'Personal Use'
            : formData.documentPurpose === 'business'
              ? 'Business Use'
              : formData.documentPurpose === 'legal'
                ? 'Legal Proceedings'
                : formData.documentPurpose || 'N/A'
        }</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #3498db; border-bottom: 1px solid #eee; padding-bottom: 10px;">Document Content</h2>
        <p>This is a generated document based on the ${template.name} template. The content would be customized based on the information provided in the form.</p>
        
        <p>Additional notes provided:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          ${formData.additionalNotes || 'No additional notes provided.'}
        </div>
      </div>
      
      <div style="margin-top: 40px;">
        <h2 style="color: #3498db; border-bottom: 1px solid #eee; padding-bottom: 10px;">Terms and Acknowledgements</h2>
        <p>By generating this document, the user acknowledges:</p>
        <ul>
          <li>This document may need review by a qualified legal professional.</li>
          <li>The information provided is accurate to the best of their knowledge.</li>
          <li>This document is generated as a starting point for legal documentation.</li>
        </ul>
      </div>
      
      <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="text-align: center;">
          This document was generated using SmartProBono's document template system.<br/>
          For legal advice, please consult with a qualified attorney.
        </p>
      </div>
    </div>
  `;

  return content;
};

const DocumentPreviewPage = () => {
  const { t } = useTranslation();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Check if this is demo mode
  const isDemo = new URLSearchParams(location.search).get('demo') === 'true';

  // Get form data from location state using useMemo
  const formData = React.useMemo(() => location.state?.formData || {}, [location.state]);

  // Find the template from the template library
  const template = documentTemplates.find(t => t.id === templateId);

  // State
  const [documentContent, setDocumentContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(isDemo);

  const menuOpen = Boolean(menuAnchorEl);

  // Load document content - moved outside of conditional rendering
  useEffect(() => {
    if (!template) return;

    try {
      setIsLoading(true);
      // This would be an API call in a real application
      const content = generateDocumentContent(template, formData);
      setDocumentContent(content);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [template, formData]);

  const handleDemoBannerClose = () => {
    setShowDemoBanner(false);
  };

  // Handle menu open
  const handleMenuOpen = event => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle print
  const handlePrint = () => {
    handleMenuClose();
    window.print();
  };

  // Handle download as PDF
  const handleDownloadPDF = () => {
    handleMenuClose();
    // This would be implemented with a PDF generation library in a real app
    alert(t('Download as PDF functionality would be implemented here.'));
  };

  // Handle download as Word
  const handleDownloadWord = () => {
    handleMenuClose();
    // This would be implemented with a docx generation library in a real app
    alert(t('Download as Word functionality would be implemented here.'));
  };

  // Handle email
  const handleEmail = () => {
    handleMenuClose();
    // This would open an email form in a real app
    alert(t('Email functionality would be implemented here.'));
  };

  // Handle share
  const handleShare = () => {
    handleMenuClose();
    setShareDialogOpen(true);
  };

  // Handle edit
  const handleEdit = () => {
    handleMenuClose();
    navigate(`/document-generator/form/${templateId}`, { state: { formData } });
  };

  // Handle save to account
  const handleSave = () => {
    handleMenuClose();
    // This would save the document to user's account in a real app
    alert(t('Save to account functionality would be implemented here.'));
  };

  // Handle share dialog close
  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          {t('Generating your document...')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('This may take a few moments.')}
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() =>
              navigate(`/document-generator/form/${templateId}`, { state: { formData } })
            }
          >
            {t('Go Back to Form')}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isDemo && showDemoBanner && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={handleDemoBannerClose}>
          <Typography variant="subtitle1" gutterBottom>
            {t('Your document is ready in demo mode')}
          </Typography>
          <Typography variant="body2">
            {t(
              'Create a free account to save this document, access it later, and get secure storage for all your legal paperwork.'
            )}
          </Typography>
          <Box mt={1}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() =>
                navigate(
                  '/register?redirect=' +
                    encodeURIComponent(`/document-templates/preview/${templateId}`)
                )
              }
              sx={{ mr: 1 }}
            >
              {t('Save & Create Account')}
            </Button>
            <Button variant="text" size="small" onClick={handleDemoBannerClose}>
              {t('Continue in Demo Mode')}
            </Button>
          </Box>
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: isMobile ? 2 : 0,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <IconButton
            onClick={() => navigate('/document-templates')}
            sx={{ mr: 1 }}
            aria-label={t('Back to templates')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" noWrap>
            {template.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          {!isMobile && (
            <>
              <Tooltip title={t('Print')}>
                <IconButton onClick={handlePrint} aria-label={t('Print')} sx={{ mx: 0.5 }}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={t('Download as PDF')}>
                <IconButton
                  onClick={handleDownloadPDF}
                  aria-label={t('Download as PDF')}
                  sx={{ mx: 0.5 }}
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={t('Edit')}>
                <IconButton onClick={handleEdit} aria-label={t('Edit')} sx={{ mx: 0.5 }}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title={t('More options')}>
            <IconButton
              onClick={handleMenuOpen}
              aria-label={t('More options')}
              aria-controls={menuOpen ? 'document-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
              sx={{ ml: 0.5 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Menu
            id="document-menu"
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'document-options-button',
            }}
          >
            {isMobile && (
              <>
                <MenuItem onClick={handlePrint}>
                  <ListItemIcon>
                    <PrintIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('Print')}</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleDownloadPDF}>
                  <ListItemIcon>
                    <PictureAsPdfIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('Download as PDF')}</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleEdit}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('Edit')}</ListItemText>
                </MenuItem>

                <Divider />
              </>
            )}

            <MenuItem onClick={handleDownloadWord}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('Download as Word')}</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleEmail}>
              <ListItemIcon>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('Email')}</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleShare}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('Share')}</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleSave}>
              <ListItemIcon>
                <SaveIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('Save to Account')}</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Paper
        sx={{
          p: 4,
          mb: 4,
          minHeight: '60vh',
          '@media print': {
            boxShadow: 'none',
            padding: 0,
          },
        }}
      >
        <div className="document-preview">
          <div dangerouslySetInnerHTML={{ __html: documentContent }} />
        </div>
      </Paper>

      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate(`/document-generator/form/${templateId}`, { state: { formData } })
          }
        >
          {t('Back to Edit')}
        </Button>

        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadPDF}>
          {t('Download')}
        </Button>
      </Box>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={handleShareDialogClose}
        aria-labelledby="share-dialog-title"
      >
        <DialogTitle id="share-dialog-title">{t('Share Document')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Choose how you would like to share this document:')}
          </DialogContentText>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  fullWidth
                  onClick={() => {
                    handleShareDialogClose();
                    handleEmail();
                  }}
                >
                  {t('Email')}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  fullWidth
                  onClick={() => {
                    handleShareDialogClose();
                    // This would generate a shareable link in a real app
                    alert(t('Copy Link functionality would be implemented here.'));
                  }}
                >
                  {t('Copy Link')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareDialogClose}>{t('Cancel')}</Button>
        </DialogActions>
      </Dialog>

      {/* Add print styles */}
      <style jsx global>{`
        @media print {
          .no-print,
          .no-print * {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </Container>
  );
};

export default DocumentPreviewPage;
