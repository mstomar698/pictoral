import React, { Component } from 'react';
import ZoomRatio from './ZoomRatio';
import type { EditorCallbacks } from '../../types';

interface FooterProps {
  resizeCanvas: EditorCallbacks['resizeCanvas'];
}

class Footer extends Component<FooterProps> {
  render() {
    return (
      <footer className="editor-footer">
        <ZoomRatio resizeCanvas={this.props.resizeCanvas} />
      </footer>
    );
  }
}

export default Footer;
