import React, { Component } from 'react';
import Header from './Header';

class Auth extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-[#1e2025] flex justify-center items-center">
          LOGIN PAGE
        </div>
      </div>
    );
  }
}

export default Auth;
