import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const Account: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Link to="/login" className="editor-account editor-account--login">
        Sign in
      </Link>
    );
  }

  return (
    <div className="editor-account">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="editor-account__avatar" width={28} height={28} />
      ) : (
        <span className="editor-account__avatar editor-account__avatar--placeholder" aria-hidden>
          {user.name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="editor-account__name">{user.name}</span>
      <button type="button" className="editor-btn editor-btn--ghost editor-account__signout" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
};

export default Account;
