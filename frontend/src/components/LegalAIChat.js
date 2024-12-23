import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { ImmigrationService } from '../services/Immigration';
import getLegalAdvice from '../services/legalAI';

const LegalAIChat = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);

  const handleQuery = async () => {
    // Existing logic
    const result = await getLegalAdvice(query);
    
    // New features
    if (result.type === 'immigration') {
      const immigrationSteps = await ImmigrationService.visaGuides.getApplicationSteps(result.visaType);
      setResponse({ ...result, steps: immigrationSteps });
    }
  };

  return (
    <Box>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a legal question..."
      />
      <Button onClick={handleQuery}>Get Help</Button>
      {response && (
        <Box mt={2}>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default LegalAIChat;