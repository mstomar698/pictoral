import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'react-toastify';
import Header from './Header';
import { useAuth } from '../auth/AuthContext';
import { authConfig } from '../auth/config';

const AuthInner: React.FC = () => {
  const { signInGuest, signInGoogle, startGitHubOAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <div className="editor-app">
      <Header />
      <main className="auth-page">
        <div className="auth-card">
          <h1 className="auth-card__title">Sign in to Pictoral</h1>
          <p className="auth-card__subtitle">
            Edit images in your browser. Sign in to sync preferences, or continue as a guest.
          </p>

          {authConfig.isGoogleEnabled() ? (
            <div className="auth-card__oauth">
              <GoogleLogin
                onSuccess={(res) => {
                  if (!res.credential) return;
                  try {
                    const payload = JSON.parse(atob(res.credential.split('.')[1] ?? ''));
                    signInGoogle({
                      sub: payload.sub,
                      name: payload.name,
                      email: payload.email,
                      picture: payload.picture,
                    });
                    navigate('/');
                  } catch {
                    toast.error('Google sign-in failed');
                  }
                }}
                onError={() => toast.error('Google sign-in failed')}
                theme="filled_black"
                size="large"
                width="100%"
                text="signin_with"
              />
            </div>
          ) : (
            <p className="auth-card__hint">Set GOOGLE_CLIENT_ID to enable Google sign-in.</p>
          )}

          <button
            type="button"
            className="editor-btn editor-btn--secondary auth-card__github"
            disabled={!authConfig.isGitHubEnabled()}
            onClick={() => {
              if (!authConfig.isGitHubEnabled()) {
                toast.info('Set GITHUB_CLIENT_ID and deploy API routes for GitHub sign-in.');
                return;
              }
              startGitHubOAuth();
            }}
          >
            Sign in with GitHub
          </button>

          <button type="button" className="editor-btn editor-btn--ghost auth-card__guest" onClick={() => {
            signInGuest();
            navigate('/');
          }}>
            Continue as guest
          </button>

          <p className="auth-card__legal">
            By signing in you agree to our{' '}
            <Link to="/terms">Terms</Link>, <Link to="/privacy">Privacy Policy</Link>, and{' '}
            <Link to="/cookies">Cookie Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
};

const Auth: React.FC = () => {
  if (!authConfig.isGoogleEnabled()) {
    return <AuthInner />;
  }
  return (
    <GoogleOAuthProvider clientId={authConfig.googleClientId}>
      <AuthInner />
    </GoogleOAuthProvider>
  );
};

export default Auth;
