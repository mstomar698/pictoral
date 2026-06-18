import React from 'react';
import Account from './Account';
import { Link } from 'react-router-dom';
import PictoralLogo from '../common/PictoralLogo';

const Header: React.FC = () => (
  <header className="editor-top-header">
    <Link to="/" className="editor-brand" aria-label="Pictoral home">
      <PictoralLogo />
    </Link>
    <Account />
  </header>
);

export default Header;
