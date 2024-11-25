/* eslint-disable no-unused-vars */
import { Typography, Grid, Paper } from '@mui/material';
import PageContainer from '../components/PageContainer';
import ContractTemplates from '../components/ContractTemplates';

const ContractsPage = () => {
  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Contract Resources
      </Typography>
      <ContractTemplates />
    </PageContainer>
  );
};

export default ContractsPage;