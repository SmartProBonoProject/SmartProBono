import React from 'react';
import { Box, Typography } from '@mui/material';
import BalanceIcon from '@mui/icons-material/Balance';
import { styled } from '@mui/material/styles';

const LogoText = styled(Typography)(({ theme, variant, size }) => ({
  background: variant === 'light' 
    ? 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)'
    : 'linear-gradient(45deg, #FFFFFF 30%, #E3F2FD 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  display: 'inline',
  marginLeft: theme.spacing(1),
  fontSize: size === 'small' ? '1.25rem' : size === 'large' ? '2.5rem' : '1.5rem'
}));

const Logo = ({ variant = 'light', size = 'medium' }) => {
  const iconSizes = {
    small: '1.5rem',
    medium: '1.75rem',
    large: '2.5rem'
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <BalanceIcon sx={{ 
        fontSize: iconSizes[size],
        color: variant === 'light' ? 'primary.main' : 'white'
      }} />
      <LogoText variant={variant} size={size}>
        SmartProBono
      </LogoText>
    </Box>
  );
};

export default Logo; 