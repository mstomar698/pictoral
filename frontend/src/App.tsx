import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import './style.css';
import store from './store';
import Main from './components/Main';
import Auth from './components/Auth';
import GitHubCallback from './components/auth/GitHubCallback';
import CookieConsent from './components/CookieConsent';
import { AuthProvider } from './auth/AuthContext';
import { PrivacyPolicy, TermsOfService, CookiePolicy } from './components/legal/LegalPages';

const App: React.FC = () => (
  <BrowserRouter basename={URL_PATH || undefined}>
    <Provider store={store}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/auth/callback/github" element={<GitHubCallback />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
        </Routes>
        <CookieConsent />
        <ToastContainer position="bottom-center" limit={1} />
      </AuthProvider>
    </Provider>
  </BrowserRouter>
);

const container = document.getElementById('main');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
