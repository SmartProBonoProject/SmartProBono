import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import ListAltIcon from '@mui/icons-material/ListAlt';

function Navigation() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Contracts', path: '/contracts', icon: <DescriptionIcon /> },
    { name: 'Rights', path: '/rights', icon: <GavelIcon /> },
    { name: 'Procedures', path: '/procedures', icon: <ListAltIcon /> },
    { name: 'Immigration', path: '/immigration', icon: <DescriptionIcon /> },
    { name: 'Services', path: '/services', icon: <DescriptionIcon /> },
    { name: 'Resources', path: '/resources', icon: <DescriptionIcon /> },
    { name: 'Contact', path: '/contact', icon: <DescriptionIcon /> }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {navItems.map((item) => (
        <ListItem 
          button 
          key={item.name} 
          component={Link} 
          to={item.path}
          selected={location.pathname === item.path}
          onClick={handleDrawerToggle}
        >
          {item.icon}
          <ListItemText primary={item.name} sx={{ ml: 2 }} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SmartProBono
            </Typography>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Navigation;