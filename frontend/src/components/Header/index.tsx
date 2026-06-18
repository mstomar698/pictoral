import React from 'react';
import Account from './Account';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header className="editor-top-header">
    <Link to="/" className="editor-brand">Pictoral</Link>
    <Account />
  </header>
);

export default Header;
