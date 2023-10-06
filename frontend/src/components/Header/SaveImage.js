import React, { Component } from 'react';
import imgObj from '../common/imgObj';
import { memory } from 'image-editor-bk-rust/image_editor_bg.wasm';
let wasm_img = imgObj.get_wasm_img();

const BtnWrapperStyle = {
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
};
export default class Save extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSave = () => {
    let canvas = document.createElement('canvas');
    let w = wasm_img.width();
    let h = wasm_img.height();
    canvas.width = w;
    canvas.height = h;
    let pixelPtr = wasm_img.pixels();
    const pixels = new Uint8Array(memory.buffer, pixelPtr, w * h * 4);
    createImageBitmap(new ImageData(new Uint8ClampedArray(pixels), w, h)).then(
      (img) => {
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          let link = document.createElement('a');
          link.download = 'download.png';
          link.href = URL.createObjectURL(blob);
          link.click();
        }, 'image/png');
      }
    );
  };

  render() {
    return (
      <div style={BtnWrapperStyle}>
        <button className="img-file-handler-btn" onClick={this.onSave}>
          Save
        </button>
      </div>
    );
  }
}
