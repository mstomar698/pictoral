import React, { Component } from 'react';
import type { EditorCallbacks } from '../../types';

interface RestoreImageProps {
  loadImage: EditorCallbacks['loadImage'];
}

class RestoreImage extends Component<RestoreImageProps> {
  restore = () => this.props.loadImage();

  render() {
    return (
      <div className="flex items-center relative">
        <button
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:border-gray-100 rounded-md shadow-sm bg-transparent text-sm font-medium text-gray-300 hover:text-gray-50 focus:outline-none"
          onClick={this.restore}
        >
          Restore
        </button>
      </div>
    );
  }
}

export default RestoreImage;
