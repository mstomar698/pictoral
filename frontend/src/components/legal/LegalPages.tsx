import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="editor-app">
    <Header />
    <main className="legal-page">
      <article className="legal-card">
        <h1>{title}</h1>
        <p className="legal-meta">Last updated: June 14, 2026</p>
        {children}
        <p className="legal-back">
          <Link to="/">← Back to editor</Link>
        </p>
      </article>
    </main>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <LegalLayout title="Privacy Policy">
    <p>
      Pictoral is a browser-based image editor. Your images are processed locally in your browser using WebAssembly;
      we do not upload your photos to our servers for editing.
    </p>
    <h2>Information we collect</h2>
    <ul>
      <li>Account info from Google or GitHub sign-in (name, email, avatar) when you choose to authenticate.</li>
      <li>Session cookies to keep you signed in.</li>
      <li>Local storage for editor preferences and undo history on your device.</li>
    </ul>
    <h2>How we use information</h2>
    <p>To provide sign-in, remember preferences, and improve the product. We do not sell personal data.</p>
    <h2>Your rights</h2>
    <p>You may sign out at any time and clear site data in your browser. Contact the maintainer via GitHub issues for data requests.</p>
  </LegalLayout>
);

export const TermsOfService: React.FC = () => (
  <LegalLayout title="Terms of Service">
    <p>By using Pictoral you agree to these terms.</p>
    <h2>Service</h2>
    <p>Pictoral is provided as-is for personal image editing. No warranty is expressed or implied.</p>
    <h2>Your content</h2>
    <p>You retain all rights to images you edit. You are responsible for having permission to edit any content you load.</p>
    <h2>Acceptable use</h2>
    <p>Do not use the service for unlawful content or to attempt to disrupt the application.</p>
    <h2>Changes</h2>
    <p>We may update these terms; continued use constitutes acceptance.</p>
  </LegalLayout>
);

export const CookiePolicy: React.FC = () => (
  <LegalLayout title="Cookie Policy">
    <p>This policy explains how Pictoral uses cookies and similar technologies.</p>
    <h2>Essential cookies</h2>
    <ul>
      <li><strong>pictoral_session</strong> — indicates an active sign-in session (30 days).</li>
      <li><strong>Local storage</strong> — auth session JSON and cookie consent preference.</li>
    </ul>
    <h2>Optional cookies</h2>
    <p>If you accept all cookies, we may enable third-party sign-in helpers (Google). No advertising cookies are used.</p>
    <h2>Managing cookies</h2>
    <p>Use the consent banner or clear site data in your browser settings.</p>
  </LegalLayout>
);
