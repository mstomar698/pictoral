import React, { Component } from 'react';
// import ModeSwitcher from './ModeSwitcher';
// import ImgFileHandler from './ImgFileHandler';
import Account from './Account';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="w-full h-16 flex top-0 z-50 justify-between bg-gray-600 shadow-md">
       <Link to="/" className="text-white text-2xl font-bold p-4">Pictoral</Link>
       {/**
       <ModeSwitcher />
       <ImgFileHandler
       resizeCanvas={this.props.resizeCanvas}
       loadImage={this.props.loadImage}
       />
      */} 
        <Account />
      </div>
    );
  }
}

export default Header;
