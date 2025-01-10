import React from 'react';
import { Box, Typography } from '@mui/material';
import BalanceIcon from '@mui/icons-material/Balance';

const Logo = ({ variant = 'default', showText = true }) => {
  const isSmall = variant === 'small';
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 1
    }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isSmall ? 32 : 40,
          height: isSmall ? 32 : 40,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 55%, transparent 55%)',
            backgroundSize: '20px 20px'
          }
        }}
      >
        <BalanceIcon sx={{ 
          fontSize: isSmall ? 20 : 24,
          position: 'relative',
          zIndex: 1
        }} />
      </Box>
      {showText && (
        <Typography
          variant={isSmall ? "subtitle1" : "h6"}
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            letterSpacing: '-0.5px'
          }}
        >
          SmartProBono
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 