import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import ThemeProvider from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import i18n from './i18n/index';
import WebSocketTestComponent from './components/WebSocketTestComponent';
import { WebSocketProvider } from './contexts/WebSocketContext';
import WebSocketDocPage from './pages/WebSocketDocPage';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationTestPage from './pages/NotificationTestPage';

// Components
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import LegalAIChat from './components/LegalAIChat';
import PremiumRouteGuard from './components/PremiumRouteGuard';
import ProgressTracker from './components/ProgressTracker';
import SubscriptionPlans from './components/SubscriptionPlans';
import LegalAnalytics from './components/LegalAnalytics';
import IdentityVerification from './components/IdentityVerification';
import FeedbackAnalytics from './components/FeedbackAnalytics';
import DocumentGenerator from './components/DocumentGenerator';

// Pages
import HomePage from './pages/HomePage';
import ContractsPage from './pages/ContractsPage';
import Immigration from './pages/Immigration';
import Resources from './pages/Resources';
import RightsPage from './pages/RightsPage';
import Services from './pages/Services';
import Contact from './pages/Contact';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DocumentAnalyzerPage from './pages/DocumentAnalyzerPage';
import DocumentGeneratorPage from './pages/DocumentGeneratorPage';
import DocumentFormPage from './pages/DocumentFormPage';
import DocumentPreviewPage from './pages/DocumentPreviewPage';
import DocumentTemplatesPage from './pages/DocumentTemplatesPage';
import EmergencyLegalSupportPage from './pages/EmergencyLegalSupportPage';
import FindLawyerPage from './pages/FindLawyerPage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import NewCasePage from './pages/NewCasePage';
import SafetyMonitorPage from './pages/SafetyMonitorPage';
import AccessibilityPage from './pages/AccessibilityPage';
import ChatRoomPage from './pages/ChatRoomPage';

// Layout components for nested routes
const ServicesLayout = () => (
  <div>
    <Routes>
      <Route index element={<Services />} />
      <Route path="contracts/*" element={<ContractsPage />} />
      <Route path="immigration/*" element={<Immigration />} />
      <Route
        path="analytics"
        element={
          <PremiumRouteGuard isPremium={false}>
            <LegalAnalytics />
          </PremiumRouteGuard>
        }
      />
    </Routes>
  </div>
);

const ResourcesLayout = () => (
  <div>
    <Routes>
      <Route index element={<Resources />} />
      <Route path="rights" element={<RightsPage />} />
      <Route
        path="premium-guides"
        element={
          <PremiumRouteGuard isPremium={false}>
            <Resources type="premium" />
          </PremiumRouteGuard>
        }
      />
    </Routes>
  </div>
);

const LegalChatLayout = () => (
  <div>
    <Routes>
      <Route index element={<LegalAIChat />} />
      <Route
        path="premium"
        element={
          <PremiumRouteGuard isPremium={false}>
            <LegalAIChat premium={true} />
          </PremiumRouteGuard>
        }
      />
      <Route
        path="feedback"
        element={
          <PremiumRouteGuard isPremium={false}>
            <FeedbackAnalytics />
          </PremiumRouteGuard>
        }
      />
    </Routes>
  </div>
);

// Document Templates Layout
const DocumentTemplatesLayout = () => (
  <div>
    <Routes>
      <Route index element={<DocumentTemplatesPage />} />
      <Route path="form/:templateId" element={<DocumentFormPage />} />
      <Route path="preview/:templateId" element={<DocumentPreviewPage />} />
    </Routes>
  </div>
);

// Case Management Layout (Requires login)
const CasesLayout = () => (
  <div>
    <Routes>
      <Route index element={<CasesPage />} />
      <Route path=":caseId" element={<CaseDetailPage />} />
      <Route path="new" element={<NewCasePage />} />
      <Route path=":caseId/edit" element={<div>Edit Case Form</div>} />
      <Route path=":caseId/safety" element={<SafetyMonitorPage />} />
    </Routes>
  </div>
);

// Chat Room Layout
const ChatRoomLayout = () => (
  <div>
    <Routes>
      <Route index element={<ChatRoomPage />} />
      <Route path=":roomId" element={<ChatRoomPage />} />
    </Routes>
  </div>
);

// WebSocket Test component layout
const WebSocketTestLayout = () => (
  <div>
    <WebSocketTestComponent />
  </div>
);

const App = () => {
  const isPremium = false;

  // Initialize i18n language and direction
  useEffect(() => {
    if (i18n && typeof i18n.language === 'string') {
      document.documentElement.lang = i18n.language;
      document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('authToken') !== null;
    return isAuthenticated ? (
      children
    ) : (
      <Navigate to="/login" replace state={{ from: window.location.pathname }} />
    );
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  // Layout with Navigation - used for all pages
  const AppLayout = () => (
    <div className="App">
      <Navigation />
      <Outlet />
    </div>
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <WebSocketProvider>
          <NotificationProvider>
            <Routes>
              <Route element={<AppLayout />}>
                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Public routes - accessible without login */}
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
                <Route path="/subscription" element={<SubscriptionPlans />} />
                <Route path="/emergency-support" element={<EmergencyLegalSupportPage />} />
                <Route path="/find-lawyer" element={<FindLawyerPage />} />
                <Route path="/resources/rights" element={<RightsPage />} />
                <Route path="/services/immigration" element={<Immigration />} />
                <Route path="/legal-chat/*" element={<LegalChatLayout />} />
                <Route path="/documents" element={<DocumentGenerator />} />
                <Route path="/ws-test" element={<WebSocketTestLayout />} />
                <Route path="/chat-room/*" element={<ChatRoomLayout />} />
                <Route path="/ws-docs" element={<WebSocketDocPage />} />
                <Route path="/notification-test" element={<NotificationTestPage />} />

                {/* Protected routes - require authentication */}
                <Route
                  path="/services"
                  element={
                    <ProtectedRoute>
                      <Services />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/services/*"
                  element={
                    <ProtectedRoute>
                      <ServicesLayout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <ProtectedRoute>
                      <Resources />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources/*"
                  element={
                    <ProtectedRoute>
                      <ResourcesLayout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cases/*"
                  element={
                    <ProtectedRoute>
                      <CasesLayout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/verify"
                  element={
                    <ProtectedRoute>
                      <PremiumRouteGuard isPremium={isPremium}>
                        <IdentityVerification />
                      </PremiumRouteGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <PremiumRouteGuard isPremium={isPremium}>
                        <ProgressTracker />
                      </PremiumRouteGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/document-analyzer"
                  element={
                    <ProtectedRoute>
                      <DocumentAnalyzerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/document-generator"
                  element={
                    <ProtectedRoute>
                      <DocumentGeneratorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/document-generator/form/:documentId"
                  element={
                    <ProtectedRoute>
                      <DocumentFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/document-generator/category/:categoryId"
                  element={
                    <ProtectedRoute>
                      <DocumentGeneratorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/document-templates/*"
                  element={
                    <ProtectedRoute>
                      <DocumentTemplatesLayout />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
