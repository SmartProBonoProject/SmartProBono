import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FlightIcon from '@mui/icons-material/Flight';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../contexts/AuthContext';
const DocumentAnalyzer = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [documentText, setDocumentText] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const handleFileUpload = event => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = e => {
        setDocumentText(e.target.result);
      };
      reader.readAsText(uploadedFile);
    }
  };
  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError(t('documentAnalyzer.noTextError'));
      return;
    }
    setIsAnalyzing(true);
    setError('');
    try {
      const response = await fetch('/api/document-analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          document_text: documentText,
          document_type: documentType || undefined,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('documentAnalyzer.analysisError'));
      }
      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleClear = () => {
    setDocumentText('');
    setDocumentType('');
    setAnalysisResult(null);
    setError('');
    setFile(null);
  };
  const getDocumentTypeIcon = type => {
    switch (type) {
      case 'contract':
        return <DescriptionIcon />;
      case 'legal_brief':
        return <GavelIcon />;
      case 'immigration_form':
        return <FlightIcon />;
      default:
        return <AssignmentIcon />;
    }
  };
  const getSeverityIcon = severity => {
    switch (severity) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon color="info" />;
    }
  };
  const getReadabilityColor = score => {
    if (score >= 70) return 'success.main';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('documentAnalyzer.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('documentAnalyzer.description')}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="document-type-label">{t('documentAnalyzer.documentType')}</InputLabel>
              <Select
                labelId="document-type-label"
                value={documentType}
                label={t('documentAnalyzer.documentType')}
                onChange={e => setDocumentType(e.target.value)}
              >
                <MenuItem value="">{t('documentAnalyzer.autoDetect')}</MenuItem>
                <MenuItem value="contract">{t('documentAnalyzer.types.contract')}</MenuItem>
                <MenuItem value="legal_brief">{t('documentAnalyzer.types.legalBrief')}</MenuItem>
                <MenuItem value="immigration_form">
                  {t('documentAnalyzer.types.immigrationForm')}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ mr: 2 }}
              >
                {t('documentAnalyzer.uploadFile')}
                <input
                  type="file"
                  hidden
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                />
              </Button>
              {file && (
                <Typography variant="body2" color="text.secondary">
                  {file.name}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={10}
              label={t('documentAnalyzer.documentText')}
              placeholder={t('documentAnalyzer.documentTextPlaceholder')}
              value={documentText}
              onChange={e => setDocumentText(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={handleClear} disabled={isAnalyzing}>
                {t('common.clear')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isAnalyzing ? <CircularProgress size={24} color="inherit" /> : <AnalyticsIcon />
                }
                onClick={handleAnalyze}
                disabled={isAnalyzing || !documentText.trim()}
              >
                {isAnalyzing ? t('documentAnalyzer.analyzing') : t('documentAnalyzer.analyze')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      {analysisResult && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('documentAnalyzer.analysisResults')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader
                  title={t('documentAnalyzer.documentInfo')}
                  avatar={getDocumentTypeIcon(analysisResult.document_type)}
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('documentAnalyzer.detectedType')}:</strong>{' '}
                    {t(`documentAnalyzer.types.${analysisResult.document_type}`) ||
                      analysisResult.document_type}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('documentAnalyzer.documentLength')}:</strong>{' '}
                    {analysisResult.document_length} {t('documentAnalyzer.characters')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t('documentAnalyzer.analyzedOn')}:</strong>{' '}
                    {new Date(analysisResult.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader
                  title={t('documentAnalyzer.readabilityScore')}
                  subheader={analysisResult.readability.grade_level}
                />
                <Divider />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-flex',
                        mr: 2,
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={analysisResult.readability.score}
                        color={
                          analysisResult.readability.score >= 70
                            ? 'success'
                            : analysisResult.readability.score >= 50
                              ? 'warning'
                              : 'error'
                        }
                        size={60}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" component="div" color="text.secondary">
                          {Math.round(analysisResult.readability.score)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        <strong>{t('documentAnalyzer.avgWordsPerSentence')}:</strong>{' '}
                        {analysisResult.readability.avg_words_per_sentence.toFixed(1)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>{t('documentAnalyzer.complexWordPercentage')}:</strong>{' '}
                        {analysisResult.readability.complex_word_percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Risk Assessment */}
            <Grid item xs={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    {t('documentAnalyzer.riskAssessment')}
                    {analysisResult.risk_assessment.risk_score > 50 && (
                      <Chip
                        label={t('documentAnalyzer.highRisk')}
                        color="error"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" gutterBottom>
                    <strong>{t('documentAnalyzer.riskScore')}:</strong>{' '}
                    {analysisResult.risk_assessment.risk_score}/100
                  </Typography>
                  {analysisResult.risk_assessment.identified_risks.length > 0 ? (
                    <List>
                      {analysisResult.risk_assessment.identified_risks.map((risk, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>{getSeverityIcon(risk.severity)}</ListItemIcon>
                          <ListItemText
                            primary={risk.description}
                            secondary={t(`documentAnalyzer.riskTypes.${risk.type}`)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      {t('documentAnalyzer.noRisksFound')}
                    </Alert>
                  )}
                  {analysisResult.risk_assessment.recommendations.length > 0 && (
                    <>
                      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        {t('documentAnalyzer.recommendations')}
                      </Typography>
                      <List>
                        {analysisResult.risk_assessment.recommendations.map((rec, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <InfoIcon color="info" />
                            </ListItemIcon>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
            {/* Document Analysis */}
            <Grid item xs={12}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{t('documentAnalyzer.contentAnalysis')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {analysisResult.document_type === 'contract' && (
                      <>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.parties')}
                          </Typography>
                          {analysisResult.analysis.parties &&
                          analysisResult.analysis.parties.length > 0 ? (
                            <List>
                              {analysisResult.analysis.parties.map((party, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <AssignmentIcon />
                                  </ListItemIcon>
                                  <ListItemText primary={party} />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t('documentAnalyzer.noPartiesDetected')}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.keyClauses')}
                          </Typography>
                          {analysisResult.analysis.key_clauses &&
                          analysisResult.analysis.key_clauses.length > 0 ? (
                            <List>
                              {analysisResult.analysis.key_clauses.map((clause, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <GavelIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={t(`documentAnalyzer.clauseTypes.${clause.type}`)}
                                    secondary={clause.text}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t('documentAnalyzer.noClausesDetected')}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.dates')}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {analysisResult.analysis.effective_date && (
                              <Chip
                                label={`${t('documentAnalyzer.effectiveDate')}: ${analysisResult.analysis.effective_date}`}
                                color="primary"
                                variant="outlined"
                              />
                            )}
                            {analysisResult.analysis.termination_date && (
                              <Chip
                                label={`${t('documentAnalyzer.terminationDate')}: ${analysisResult.analysis.termination_date}`}
                                color="secondary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Grid>
                      </>
                    )}
                    {analysisResult.document_type === 'legal_brief' && (
                      <>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.caseInfo')}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>{t('documentAnalyzer.caseNumber')}:</strong>{' '}
                            {analysisResult.analysis.case_info.case_number}
                          </Typography>
                          <Typography variant="body2">
                            <strong>{t('documentAnalyzer.court')}:</strong>{' '}
                            {analysisResult.analysis.case_info.court}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.citedCases')}
                          </Typography>
                          {analysisResult.analysis.cited_cases &&
                          analysisResult.analysis.cited_cases.length > 0 ? (
                            <List dense>
                              {analysisResult.analysis.cited_cases.map((citation, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <GavelIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={citation} />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t('documentAnalyzer.noCitationsDetected')}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.legalArguments')}
                          </Typography>
                          {analysisResult.analysis.legal_arguments &&
                          analysisResult.analysis.legal_arguments.length > 0 ? (
                            <List>
                              {analysisResult.analysis.legal_arguments.map((argument, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <AssignmentIcon />
                                  </ListItemIcon>
                                  <ListItemText primary={argument} />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t('documentAnalyzer.noArgumentsDetected')}
                            </Typography>
                          )}
                        </Grid>
                      </>
                    )}
                    {analysisResult.document_type === 'immigration_form' && (
                      <>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.applicantInfo')}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>{t('documentAnalyzer.name')}:</strong>{' '}
                            {analysisResult.analysis.applicant_info.name}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>{t('documentAnalyzer.dateOfBirth')}:</strong>{' '}
                            {analysisResult.analysis.applicant_info.date_of_birth}
                          </Typography>
                          <Typography variant="body2">
                            <strong>{t('documentAnalyzer.nationality')}:</strong>{' '}
                            {analysisResult.analysis.applicant_info.nationality}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.visaInfo')}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>{t('documentAnalyzer.visaType')}:</strong>{' '}
                            {analysisResult.analysis.visa_type ||
                              t('documentAnalyzer.notSpecified')}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                            {t('documentAnalyzer.supportingDocuments')}
                          </Typography>
                          {analysisResult.analysis.supporting_documents &&
                          analysisResult.analysis.supporting_documents.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {analysisResult.analysis.supporting_documents.map((doc, index) => (
                                <Chip key={index} label={doc} size="small" />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t('documentAnalyzer.noDocumentsDetected')}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.travelHistory')}
                          </Typography>
                          {analysisResult.analysis.travel_history &&
                          analysisResult.analysis.travel_history.length > 0 ? (
                            <List dense>
                              {analysisResult.analysis.travel_history.map((entry, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <FlightIcon fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={entry.country} secondary={entry.date} />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t('documentAnalyzer.noTravelHistoryDetected')}
                            </Typography>
                          )}
                        </Grid>
                      </>
                    )}
                    {analysisResult.document_type === 'unknown' && (
                      <>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.summary')}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {analysisResult.analysis.summary}
                          </Typography>
                          <Typography variant="subtitle1" gutterBottom>
                            {t('documentAnalyzer.entities')}
                          </Typography>
                          <Grid container spacing={2}>
                            {Object.entries(analysisResult.analysis.key_entities).map(
                              ([entityType, entities]) =>
                                entities.length > 0 && (
                                  <Grid item xs={12} sm={6} md={3} key={entityType}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      {t(`documentAnalyzer.entityTypes.${entityType}`)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {entities.map((entity, index) => (
                                        <Chip key={index} label={entity} size="small" />
                                      ))}
                                    </Box>
                                  </Grid>
                                )
                            )}
                          </Grid>
                          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                            {t('documentAnalyzer.topics')}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {analysisResult.analysis.topics.map((topic, index) => (
                              <Chip key={index} label={topic} color="primary" variant="outlined" />
                            ))}
                          </Box>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};
export default DocumentAnalyzer;