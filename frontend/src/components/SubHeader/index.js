import React, { Component } from 'react';
import ImgFileHandler from './ImgFileHandler';

class SubHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="w-full h-max flex z-50 relative top-0 justify-center items-center bg-gray-700 shadow-md">
        <ImgFileHandler
          resizeCanvas={this.props.resizeCanvas}
          loadImage={this.props.loadImage}
        />
      </div>
    );
  }
}

export default SubHeader;
