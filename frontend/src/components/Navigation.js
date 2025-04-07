import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Container,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Fade,
  SwipeableDrawer,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import ChatIcon from '@mui/icons-material/Chat';
import FlightIcon from '@mui/icons-material/Flight';
import BuildIcon from '@mui/icons-material/Build';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CallIcon from '@mui/icons-material/Call';
import FolderIcon from '@mui/icons-material/Folder';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Logo from '../components/Logo';
import LanguageSelector from './LanguageSelector';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accessibilityMenu, setAccessibilityMenu] = useState(null);
  const [userMenu, setUserMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  // Use the Auth context instead of local state
  const { isAuthenticated, user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect for AppBar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always visible navigation items
  const publicNavItems = [
    { name: 'Home', path: '/', icon: <HomeIcon />, ariaLabel: 'Go to home page' },
    {
      name: 'Find Lawyer',
      path: '/find-lawyer',
      icon: <GavelIcon />,
      ariaLabel: 'Find a pro bono lawyer',
    },
    {
      name: 'Rights',
      path: '/resources/rights',
      icon: <GavelIcon />,
      ariaLabel: 'Know your rights',
    },
    {
      name: 'Immigration',
      path: '/services/immigration',
      icon: <FlightIcon />,
      ariaLabel: 'Immigration help',
    },
    {
      name: 'Services',
      path: '/services',
      icon: <BuildIcon />,
      ariaLabel: 'Go to services page',
      requiresAuth: true,
    },
    {
      name: 'Resources',
      path: '/resources',
      icon: <LibraryBooksIcon />,
      ariaLabel: 'Go to resources page',
      requiresAuth: true,
    },
    {
      name: 'Accessibility',
      path: '/accessibility',
      icon: <AccessibilityNewIcon />,
      ariaLabel: 'Accessibility features',
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <ContactSupportIcon />,
      ariaLabel: 'Go to contact page',
    },
    {
      name: 'Emergency Support',
      path: '/emergency-support',
      icon: <CallIcon color="error" />,
      ariaLabel: 'Get emergency legal support',
      highlight: true,
    },
  ];

  // Only visible when authenticated
  const authOnlyNavItems = [
    {
      name: 'Document Templates',
      path: '/document-templates',
      icon: <DescriptionIcon />,
      ariaLabel: 'Go to document templates page',
    },
    {
      name: 'Case Management',
      path: '/cases',
      icon: <FolderIcon />,
      ariaLabel: 'Go to case management',
      isNew: true,
    },
    {
      name: 'Document Analyzer',
      path: '/document-analyzer',
      icon: <AnalyticsIcon />,
      ariaLabel: 'Go to document analyzer page',
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
      ariaLabel: 'Go to settings page',
    },
  ];

  // Filtering nav items for display
  const allNavItems = [...publicNavItems, ...authOnlyNavItems];

  // Get items for the drawer (mobile menu)
  const drawerNavItems = allNavItems.filter(
    item => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  // Get items for the desktop menu (top bar)
  const desktopNavItems = publicNavItems.filter(
    item => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  // Languages are now handled by the LanguageSelector component
  const accessibilityOptions = [
    { name: 'High Contrast Mode', action: () => setHighContrast(!highContrast) },
    { name: 'Increase Font Size', action: () => (document.body.style.fontSize = '1.2em') },
    { name: 'Reset Font Size', action: () => (document.body.style.fontSize = '1em') },
    {
      name: 'Accessibility Settings',
      action: () => {
        navigate('/accessibility');
        handleAccessibilityClose();
      },
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Language selection is now handled by the LanguageSelector component

  const handleAccessibilityClick = event => {
    setAccessibilityMenu(event.currentTarget);
  };

  const handleAccessibilityClose = () => {
    setAccessibilityMenu(null);
  };

  const handleUserMenuClick = event => {
    setUserMenu(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenu(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Use AuthContext logout method instead of local state
    // setIsAuthenticated(false);
    handleUserMenuClose();
    navigate('/');
  };

  const drawer = (
    <Box
      sx={{
        bgcolor: highContrast ? '#000' : '#fff',
        height: '100%',
        color: highContrast ? '#fff' : 'inherit',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo size="small" variant={highContrast ? 'highContrast' : 'light'} />
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          aria-label="Close navigation menu"
          sx={{ color: highContrast ? '#fff' : 'primary.main' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ p: 2 }}>
        {drawerNavItems.map(item => (
          <ListItemButton
            key={item.name}
            component={Link}
            to={item.requiresAuth && !isAuthenticated ? '/login' : item.path}
            state={item.requiresAuth && !isAuthenticated ? { from: item.path } : undefined}
            selected={location.pathname === item.path}
            onClick={handleDrawerToggle}
            aria-label={item.ariaLabel}
            sx={{
              borderRadius: 2,
              mb: 1,
              color: highContrast ? '#fff' : item.highlight ? 'error.main' : 'inherit',
              bgcolor: item.highlight ? 'rgba(244, 67, 54, 0.08)' : 'transparent',
              '&.Mui-selected': {
                bgcolor: highContrast ? '#fff' : item.highlight ? 'error.main' : 'primary.main',
                color: highContrast ? '#000' : 'white',
                '&:hover': {
                  bgcolor: highContrast ? '#ccc' : item.highlight ? 'error.dark' : 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: highContrast ? '#000' : 'white',
                },
              },
              '&:hover': {
                bgcolor: highContrast
                  ? 'rgba(255,255,255,0.1)'
                  : item.highlight
                    ? 'rgba(244, 67, 54, 0.15)'
                    : 'rgba(25, 118, 210, 0.08)',
              },
              animation:
                item.highlight && !location.pathname.includes(item.path)
                  ? 'pulse 2s infinite'
                  : 'none',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.4)',
                },
                '70%': {
                  boxShadow: '0 0 0 6px rgba(244, 67, 54, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color:
                  location.pathname === item.path
                    ? highContrast
                      ? '#000'
                      : 'white'
                    : highContrast
                      ? '#fff'
                      : item.highlight
                        ? 'error.main'
                        : 'primary.main',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.name}
                  {item.isNew && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        bgcolor: 'success.main',
                        color: 'white',
                        px: 0.5,
                        py: 0.1,
                        borderRadius: 1,
                        display: 'inline-block',
                      }}
                    >
                      NEW
                    </Box>
                  )}
                </Box>
              }
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: location.pathname === item.path ? 600 : item.highlight ? 600 : 400,
              }}
            />
          </ListItemButton>
        ))}

        {/* Show auth-specific menu items for drawer */}
        {isAuthenticated ? (
          <>
            <Divider sx={{ my: 2 }} />
            {authOnlyNavItems.map(item => (
              <ListItemButton
                key={item.name}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={handleDrawerToggle}
                aria-label={item.ariaLabel}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: highContrast ? '#fff' : 'inherit',
                  '&.Mui-selected': {
                    bgcolor: highContrast ? '#fff' : 'primary.main',
                    color: highContrast ? '#000' : 'white',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      location.pathname === item.path
                        ? highContrast
                          ? '#000'
                          : 'white'
                        : highContrast
                          ? '#fff'
                          : 'primary.main',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.name}
                      {item.isNew && (
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            fontSize: '0.6rem',
                            fontWeight: 'bold',
                            bgcolor: 'success.main',
                            color: 'white',
                            px: 0.5,
                            py: 0.1,
                            borderRadius: 1,
                            display: 'inline-block',
                          }}
                        >
                          NEW
                        </Box>
                      )}
                    </Box>
                  }
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            ))}
          </>
        ) : (
          <>
            <Divider sx={{ my: 2 }} />
            <ListItemButton
              component={Link}
              to="/login"
              onClick={handleDrawerToggle}
              aria-label="Login to your account"
              sx={{
                borderRadius: 2,
                mb: 1,
                color: highContrast ? '#fff' : 'primary.main',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: highContrast ? '#fff' : 'primary.main',
                }}
              >
                <LoginIcon />
              </ListItemIcon>
              <ListItemText
                primary="Login"
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/register"
              onClick={handleDrawerToggle}
              aria-label="Register a new account"
              sx={{
                borderRadius: 2,
                mb: 1,
                color: highContrast ? '#fff' : 'primary.main',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: highContrast ? '#fff' : 'primary.main',
                }}
              >
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText
                primary="Register"
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </>
        )}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, color: highContrast ? '#fff' : 'text.secondary' }}
        >
          Language & Accessibility
        </Typography>

        <Box sx={{ mb: 1 }}>
          <LanguageSelector
            variant="text"
            size="medium"
            color={highContrast ? 'inherit' : 'primary'}
          />
        </Box>

        <Button
          fullWidth
          startIcon={<AccessibilityNewIcon />}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: highContrast ? '#fff' : 'text.primary',
            '&:hover': {
              bgcolor: highContrast ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
            },
          }}
          onClick={handleAccessibilityClick}
        >
          Accessibility Options
        </Button>
      </Box>

      {isAuthenticated && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: highContrast ? '#fff' : 'error.main',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: '100%',
          left: 0,
          backgroundColor: theme.palette.background.paper,
          boxShadow: scrolled ? 1 : 0,
          borderBottom: !scrolled ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
        }}
      >
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Logo size="small" variant={highContrast ? 'highContrast' : 'light'} />
                </Box>
              </Link>
            </Box>

            {/* Main Navigation (Desktop) */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
              {desktopNavItems.map(item => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.requiresAuth && !isAuthenticated ? '/login' : item.path}
                  state={item.requiresAuth && !isAuthenticated ? { from: item.path } : undefined}
                  aria-label={item.ariaLabel}
                  startIcon={item.icon}
                  color={item.highlight ? 'error' : 'inherit'}
                  sx={{
                    mx: 0.5,
                    color: item.highlight ? 'error.main' : 'text.primary',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      bgcolor: item.highlight ? 'error.main' : 'primary.main',
                      opacity: location.pathname === item.path ? 1 : 0,
                      transition: 'opacity 0.3s',
                    },
                    '&:hover::after': {
                      opacity: 0.5,
                    },
                  }}
                >
                  {item.name}
                  {item.isNew && (
                    <Box
                      component="span"
                      sx={{
                        ml: 0.5,
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        bgcolor: 'success.main',
                        color: 'white',
                        px: 0.5,
                        py: 0.1,
                        borderRadius: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        position: 'absolute',
                        top: 0,
                        right: -5,
                      }}
                    >
                      NEW
                    </Box>
                  )}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Top bar user actions */}
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                {/* Language selector */}
                <LanguageSelector />

                {/* Accessibility button */}
                <Tooltip title={t('Accessibility options')}>
                  <IconButton
                    color="inherit"
                    aria-label={t('Accessibility options')}
                    onClick={handleAccessibilityClick}
                  >
                    <AccessibilityNewIcon />
                  </IconButton>
                </Tooltip>

                {/* Notification Center (only show when authenticated) */}
                {isAuthenticated && <NotificationCenter />}

                {/* Login/Register or user profile buttons */}
                {isAuthenticated ? (
                  <Tooltip title={t('User menu')}>
                    <IconButton
                      edge="end"
                      color="inherit"
                      aria-label={t('User menu')}
                      onClick={handleUserMenuClick}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        <AccountCircleIcon />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <Button
                      component={Link}
                      to="/login"
                      color="inherit"
                      sx={{ ml: 1 }}
                      startIcon={<LoginIcon />}
                    >
                      {t('Login')}
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      color="inherit"
                      sx={{ ml: 1 }}
                      startIcon={<PersonAddIcon />}
                    >
                      {t('Register')}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Legal Chat Button - Always accessible */}
              <Button
                component={Link}
                to="/legal-chat"
                color="inherit"
                startIcon={<ChatIcon />}
                sx={{
                  ml: { xs: 1, sm: 2 },
                  display: 'flex',
                  minWidth: { xs: 'auto', sm: 'auto' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                {isMobile ? <ChatIcon /> : t('Legal Chat')}
              </Button>

              {/* Document Generator Button - Always accessible */}
              <Button
                component={Link}
                to="/documents"
                color="inherit"
                startIcon={<DescriptionIcon />}
                sx={{
                  ml: { xs: 1, sm: 2 },
                  display: 'flex',
                  minWidth: { xs: 'auto', sm: 'auto' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                {isMobile ? <DescriptionIcon /> : t('Document Generator')}
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <SwipeableDrawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        onOpen={() => setMobileOpen(true)}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { xs: '85%', sm: 320 } },
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </SwipeableDrawer>
    </>
  );
}

export default Navigation;
