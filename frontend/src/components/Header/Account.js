import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.span = null;
  }

  render() {
    return (
      <>
        <Link to="/login" className="text-white text-2xl font-bold p-4">
          Login
        </Link>
      </>
    );
  }
}

export default Account;
