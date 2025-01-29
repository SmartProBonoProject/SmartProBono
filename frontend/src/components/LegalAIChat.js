import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { legalChatApi } from '../services/api';
import useApi from '../hooks/useApi';

const LegalAIChat = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  const { loading, error, execute: sendMessage } = useApi(legalChatApi.sendMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', text: userMessage }]);

    try {
      const response = await sendMessage(userMessage);
      // Add AI response to chat
      setChatHistory(prev => [...prev, { type: 'ai', text: response.message }]);
    } catch (err) {
      // Error is handled by useApi hook
      console.error('Chat error:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('legalChat.title')}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('legalChat.disclaimer')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 400, overflow: 'auto', mb: 2, p: 2 }}>
        <List>
          {chatHistory.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: msg.type === 'user' ? 'primary.main' : 'grey.100',
                  color: msg.type === 'user' ? 'white' : 'text.primary',
                }}
              >
                <ListItemText primary={msg.text} />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('legalChat.placeholder')}
          disabled={loading}
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !message.trim()}
          endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {t('common.submit')}
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('legalChat.suggestions')}:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {t('legalChat.suggestions', { returnObjects: true }).map((suggestion, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => setMessage(suggestion)}
              disabled={loading}
            >
              {suggestion}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LegalAIChat;