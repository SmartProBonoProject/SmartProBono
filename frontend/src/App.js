import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { theme } from './components/theme';
import i18n from './i18n';
import config from './config';

// Existing Components
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import ContractsPage from './pages/ContractsPage';

// Core Features
import LegalAIChat from './components/LegalAIChat';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <Router>
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/legal-chat" element={<LegalAIChat />} />
              {/* Remove or comment out until component is ready */}
              {/* <Route path="/immigration" element={<ImmigrationPage />} /> */}
              {/* Other existing routes */}
            </Routes>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
