import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import PageContainer from '../components/PageContainer';
import ContractGuide from '../components/ContractGuide';
import ContractTemplates from '../components/ContractTemplates';
import { legalQuestions } from '../data/legalFAQ';
import getLegalAdvice from '../services/legalAI';
import LegalAIChat from '../components/LegalAIChat';

const ContractsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Contract Resources
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Contract Guides" />
          <Tab label="Templates" />
          <Tab label="Legal FAQ" />
          <Tab label="AI Assistant" />
        </Tabs>
      </Box>

      {tabValue === 0 && <ContractGuide />}
      {tabValue === 1 && <ContractTemplates />}
      {tabValue === 2 && (
        <Box>
          {Object.entries(legalQuestions).map(([key, { question, answer }]) => (
            <Box key={key} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {question}
              </Typography>
              <Typography variant="body1">
                {answer}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {tabValue === 3 && <LegalAIChat />}
    </PageContainer>
  );
};

export default ContractsPage;