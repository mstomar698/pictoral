import React, { Component } from 'react';
import imgObj from '../common/imgObj';

const wasm_img = imgObj.get_wasm_img();

class SaveImage extends Component {
  onSave = () => {
    const canvas = document.createElement('canvas');
    const w = wasm_img.width();
    const h = wasm_img.height();
    canvas.width = w;
    canvas.height = h;
    const pixels = wasm_img.pixels_data();
    createImageBitmap(new ImageData(new Uint8ClampedArray(pixels), w, h)).then(
      (img) => {
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const link = document.createElement('a');
          link.download = 'download.png';
          link.href = URL.createObjectURL(blob);
          link.click();
        }, 'image/png');
      }
    );
  };

  render() {
    return (
      <div className="flex items-center relative">
        <button
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:border-gray-100 rounded-md shadow-sm bg-transparent text-sm font-medium text-gray-300 hover:text-gray-50 focus:outline-none"
          onClick={this.onSave}
        >
          Save
        </button>
      </div>
    );
  }
}

export default SaveImage;
