import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ZoomRatio from './ZoomRatio';
import type { EditorCallbacks } from '../../types';

interface FooterProps {
  resizeCanvas: EditorCallbacks['resizeCanvas'];
}

class Footer extends Component<FooterProps> {
  render() {
    return (
      <footer className="editor-footer">
        <nav className="editor-footer-legal" aria-label="Legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
        </nav>
        <ZoomRatio resizeCanvas={this.props.resizeCanvas} />
      </footer>
    );
  }
}

export default Footer;
