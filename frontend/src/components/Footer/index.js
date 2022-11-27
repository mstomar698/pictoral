import React, { Component } from 'react';
import ZoomRatio from './ZoomRatio';
import Layers from './Layers'

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          flexDirection: 'row',
          
          bottom: '0px',
          height: '44px',
          width: '100%',
          backgroundColor: '#373842',
        }}
      >
        <ZoomRatio resizeCanvas={this.props.resizeCanvas} />
        <Layers />
      </div>
    );
  }
}

export default Footer;
