import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/AuthContext';
import Header from '../Header';

const GitHubCallback: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signInGitHub } = useAuth();
  const [status, setStatus] = useState('Completing GitHub sign-in…');

  useEffect(() => {
    const code = params.get('code');
    if (!code) {
      setStatus('Missing authorization code.');
      return;
    }

    const redirectUri = `${window.location.origin}${URL_PATH || ''}/auth/callback/github`;

    fetch(`${URL_PATH || ''}/api/auth/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: { profile: { id: number; login: string; name?: string; avatar_url?: string; email?: string } }) => {
        signInGitHub(data.profile);
        navigate('/');
      })
      .catch(() => {
        toast.error('GitHub sign-in failed. Check OAuth secrets on the server.');
        setStatus('Sign-in failed. You can try again from the login page.');
      });
  }, [params, navigate, signInGitHub]);

  return (
    <div className="editor-app">
      <Header />
      <main className="auth-page">
        <p className="auth-card__subtitle">{status}</p>
      </main>
    </div>
  );
};

export default GitHubCallback;
