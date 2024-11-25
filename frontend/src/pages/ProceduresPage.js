import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function ProceduresPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/legal/procedures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });
      
      const data = await response.json();
      
      // Parse steps if the response contains numbered steps
      const stepsMatch = data.response.match(/\d+\.\s[^\n]+/g);
      if (stepsMatch) {
        setSteps(stepsMatch.map(step => step.replace(/^\d+\.\s/, '')));
      }
      
      setMessages(prev => [...prev, 
        { type: 'user', text: prompt },
        { type: 'assistant', text: data.response, timing: data.timing }
      ]);
      setPrompt('');
      setActiveStep(0); // Reset stepper when new response received
    } catch (error) {
      setError('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const downloadProcedure = () => {
    const content = messages.map(msg => 
      `${msg.type === 'user' ? 'Question' : 'Answer'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legal-procedure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Legal Procedures Guide
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Get step-by-step guidance for legal procedures:
            </Typography>
            <ul>
              <li>Filing court documents</li>
              <li>Small claims procedures</li>
              <li>Administrative appeals</li>
              <li>Legal document preparation</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>

      {steps.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Procedure Steps
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel onClick={() => setActiveStep(index)} style={{cursor: 'pointer'}}>
                  {step}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      <Box sx={{ mb: 3, maxHeight: '60vh', overflow: 'auto' }}>
        {messages.map((msg, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography color={msg.type === 'user' ? 'primary' : 'textPrimary'}>
                {msg.text}
              </Typography>
              {msg.timing && (
                <Typography variant="caption" color="text.secondary">
                  Response time: {msg.timing.model_time}
                </Typography>
              )}
            </CardContent>
          </Card>
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
          placeholder="Ask about a legal procedure..."
          sx={{ mb: 2 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Ask Question"}
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={downloadProcedure}
              disabled={messages.length === 0}
              startIcon={<DownloadIcon />}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default ProceduresPage;
