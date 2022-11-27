import React, { Component } from 'react';
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.span = null;
    this.state = {
      date: new Date().toLocaleString(),
    };
  }

  render() {
    return (
      // todo: we will add authorization later
      <div className="date">
        <p>{this.state.date}</p>
      </div>
    );
  }
}

export default Account;
