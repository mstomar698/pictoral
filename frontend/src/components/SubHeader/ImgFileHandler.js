import React, { Component } from 'react';
import OpenImage from './OpenImage';
import SaveImage from './SaveImage';
import RestoreImage from './RestoreImage';

export default class ImgFileHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="flex justify-around w-72 items-center">
        <OpenImage
          resizeCanvas={this.props.resizeCanvas}
          loadImage={this.props.loadImage}
        />
        <SaveImage />
        <RestoreImage loadImage={this.props.loadImage} />
      </div>
    );
  }
}
