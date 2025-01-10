import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Container,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GavelIcon from '@mui/icons-material/Gavel';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PageLayout from './PageLayout';

const LegalAIChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { name: 'Civil Rights', icon: <GavelIcon />, color: '#1976d2' },
    { name: 'Business Law', icon: <BusinessIcon />, color: '#2e7d32' },
    { name: 'Housing', icon: <HomeIcon />, color: '#ed6c02' },
    { name: 'Employment', icon: <WorkIcon />, color: '#9c27b0' },
    { name: 'Family Law', icon: <FamilyRestroomIcon />, color: '#d32f2f' },
    { name: 'Immigration', icon: <AccountBalanceIcon />, color: '#0288d1' }
  ];

  const suggestedQuestions = {
    'Civil Rights': [
      "What are my basic civil rights?",
      "How can I file a discrimination complaint?",
      "What should I do if my rights are violated?"
    ],
    'Business Law': [
      "How do I register a new business?",
      "What contracts do I need for my startup?",
      "How do I protect my intellectual property?"
    ],
    'Housing': [
      "What are my rights as a tenant?",
      "How do I handle a landlord dispute?",
      "What's the eviction process in my state?"
    ],
    'Employment': [
      "What are my workplace rights?",
      "How do I file a workplace complaint?",
      "What's included in employment contracts?"
    ],
    'Family Law': [
      "How does divorce process work?",
      "What are child custody rights?",
      "How do I file for child support?"
    ],
    'Immigration': [
      "How do I apply for a visa?",
      "What's the citizenship process?",
      "What are my rights as an immigrant?"
    ]
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5001/api/legal/rights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: query.trim(),
          category: selectedCategory
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [
        ...prev,
        { type: 'user', text: query },
        { type: 'assistant', text: data.response }
      ]);
      setQuery('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSuggestedQuestion = (question) => {
    setQuery(question);
  };

  return (
    <PageLayout
      title="Legal Assistant"
      description="Get instant answers to your legal questions from our AI-powered assistant"
    >
      {/* Categories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select a Category
        </Typography>
        <Grid container spacing={2}>
          {categories.map((cat) => (
            <Grid item key={cat.name}>
              <Chip
                icon={cat.icon}
                label={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                sx={{
                  bgcolor: selectedCategory === cat.name ? cat.color : 'transparent',
                  color: selectedCategory === cat.name ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: selectedCategory === cat.name ? cat.color : 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Chat Interface */}
      <Grid container spacing={3}>
        {/* Suggested Questions */}
        <Grid item xs={12} md={3}>
          {selectedCategory && (
            <Paper 
              elevation={2}
              sx={{ 
                p: 2, 
                height: '60vh', 
                overflow: 'auto',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Suggested Questions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {suggestedQuestions[selectedCategory].map((question, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    onClick={() => handleSuggestedQuestion(question)}
                    sx={{ 
                      justifyContent: 'flex-start', 
                      textAlign: 'left',
                      textTransform: 'none'
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={9}>
          <Paper 
            elevation={2}
            sx={{ 
              height: '60vh', 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {/* Messages */}
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: 'auto',
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              px: 2
            }}>
              {messages.map((msg, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.type === 'user' ? '#e3f2fd' : '#fff',
                    borderRadius: 2
                  }}
                >
                  <Typography>
                    {msg.text}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Input Area */}
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, px: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedCategory 
                  ? `Ask about ${selectedCategory.toLowerCase()}...` 
                  : "Select a category and ask your question..."}
                disabled={loading || !selectedCategory}
                sx={{ 
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white'
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleQuery}
                disabled={loading || !query.trim() || !selectedCategory}
                sx={{ alignSelf: 'stretch', px: 4 }}
                endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              >
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 4 }}>
        Disclaimer: This AI assistant provides general legal information only. 
        For specific legal advice, please consult with a qualified legal professional.
      </Alert>
    </PageLayout>
  );
};

export default LegalAIChat;