import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Grid 
} from '@mui/material';

function RightsPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/legal/rights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, 
        { type: 'user', text: prompt },
        { type: 'assistant', text: data.response, timing: data.timing }
      ]);
      setPrompt('');
    } catch (error) {
      setError('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Legal Rights Information
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Ask questions about your legal rights in various situations:
            </Typography>
            <ul>
              <li>Tenant rights</li>
              <li>Employment rights</li>
              <li>Consumer rights</li>
              <li>Civil rights</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, maxHeight: '60vh', overflow: 'auto' }}>
        {messages.map((msg, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: msg.type === 'user' ? '#e3f2fd' : '#fff' }}>
            <Typography>{msg.text}</Typography>
            {msg.timing && (
              <Typography variant="caption" color="text.secondary">
                Response time: {msg.timing.model_time}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about your legal rights..."
          sx={{ mb: 2 }}
        />
        <Button 
          fullWidth 
          variant="contained" 
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Ask Question"}
        </Button>
      </form>
    </Box>
  );
}

export default RightsPage;