import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  CircularProgress 
} from '@mui/material';
import getLegalAdvice from '../services/legalAI';

const LegalAIChat = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getLegalAdvice(query);
      setResponse(result);
    } catch (error) {
      setResponse({
        response: "Sorry, there was an error processing your request.",
        disclaimer: "Please try again later."
      });
    }
    setLoading(false);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ask about contract law"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !query.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Get Information'}
          </Button>
        </form>
      </Paper>

      {response && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            {response.response}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {response.disclaimer}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LegalAIChat;