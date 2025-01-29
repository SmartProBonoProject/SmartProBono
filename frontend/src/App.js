import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { theme } from './components/theme';
import i18n from './i18n';

// Components
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import LegalAIChat from './components/LegalAIChat';

// Pages
import HomePage from './pages/HomePage';
import ContractsPage from './pages/ContractsPage';
import Immigration from './pages/Immigration';
import Resources from './pages/Resources';
import RightsPage from './pages/RightsPage';
import Services from './pages/Services';
import Contact from './pages/Contact';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <Router>
            <div className="App">
              <Navigation />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route path="/immigration" element={<Immigration />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/rights" element={<RightsPage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/legal-chat" element={<LegalAIChat />} />
              </Routes>
            </div>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
