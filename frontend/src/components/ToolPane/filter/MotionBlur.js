import imgObj from '../../common/imgObj';
import React, { Component } from 'react';
import ApplyButton from '../common/ApplyButton';

export default class MotionBlur extends Component {
  constructor(props) {
    super(props);
    this.wasm_img = imgObj.get_wasm_img();
    this.state = {};

    this.sliderRange = {
      contrast: [1, 20, 1],
      brightness: [10, 10, 1],
    };
    this.changeApplied = true;
  }

  componentWillUnmount = () => {
    if (!this.changeApplied) {
      this.wasm_img.discard_change();
      this.props.redraw();
    }
  };

  onApply = () => {
    this.changeApplied = true;
    this.wasm_img.apply_change();
    this.props.onSelectTool('');
  };

  render() {
    return (
      <div style={{ marginBottom: '180x', color: '#CCC' }}>
        Motion blur
        <ApplyButton onApply={this.onApply} />
      </div>
    );
  }
}
