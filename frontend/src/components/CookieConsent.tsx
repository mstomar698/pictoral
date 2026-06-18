import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCookieConsent, setCookieConsent } from '../auth/session';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(() => getCookieConsent() === null);

  if (!visible) return null;

  const accept = (level: 'accepted' | 'essential') => {
    setCookieConsent(level);
    setVisible(false);
  };

  return (
    <div className="cookie-consent" role="dialog" aria-label="Cookie consent">
      <div className="cookie-consent__inner">
        <p>
          We use essential cookies for sign-in sessions and optional analytics when you consent. See our{' '}
          <Link to="/cookies">Cookie Policy</Link>, <Link to="/privacy">Privacy Policy</Link>, and{' '}
          <Link to="/terms">Terms</Link>.
        </p>
        <div className="cookie-consent__actions">
          <button type="button" className="editor-btn editor-btn--primary" onClick={() => accept('accepted')}>
            Accept all
          </button>
          <button type="button" className="editor-btn editor-btn--secondary" onClick={() => accept('essential')}>
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
