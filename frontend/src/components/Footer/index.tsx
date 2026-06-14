import React, { Component } from 'react';
import ZoomRatio from './ZoomRatio';
import type { EditorCallbacks } from '../../types';

interface FooterProps {
  resizeCanvas: EditorCallbacks['resizeCanvas'];
}

class Footer extends Component<FooterProps> {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '0px',
          height: '44px',
          width: '100%',
          paddingLeft: '10px',
          backgroundColor: '#373842',
        }}
      >
        <ZoomRatio resizeCanvas={this.props.resizeCanvas} />
      </div>
    );
  }
}

export default Footer;
