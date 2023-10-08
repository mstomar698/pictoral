import React, { Component } from 'react';

export default class Restore extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  restore = () => this.props.loadImage();

  render() {
    return (
      <div className="flex items-center relative">
        <button
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:border-gray-100 rounded-md shadow-sm bg-transparent text-sm font-medium text-gray-300 hover:text-gray-50 focus:outline-none"
          onClick={this.onSave}
        >
          Restore
        </button>
      </div>
    );
  }
}
