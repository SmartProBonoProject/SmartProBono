import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './components/theme';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import ContractsPage from './pages/ContractsPage';
import RightsPage from './pages/RightsPage';
import ProceduresPage from './pages/ProceduresPage';
import Immigration from './pages/Immigration';
import Services from './pages/Services';
import Resources from './pages/Resources';
import Contact from './pages/Contact';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route path="/rights" element={<RightsPage />} />
                <Route path="/procedures" element={<ProceduresPage />} />
                <Route path="/immigration" element={<Immigration />} />
                <Route path="/services" element={<Services />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
