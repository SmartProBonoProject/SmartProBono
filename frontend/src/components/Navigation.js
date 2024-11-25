import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Legal Assistant
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
        <Button color="inherit" onClick={() => navigate('/resources')}>Resources</Button>
        <Button color="inherit" onClick={() => navigate('/rights')}>Rights</Button>
        <Button color="inherit" onClick={() => navigate('/procedures')}>Procedures</Button>
        <Button color="inherit" onClick={() => navigate('/contracts')}>Contracts</Button>
        <Button color="inherit" onClick={() => navigate('/services')}>Services</Button>
        <Button color="inherit" onClick={() => navigate('/contact')}>Contact</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;