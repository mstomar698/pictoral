import imgObj from '../../common/imgObj';
import React, { Component } from 'react';
import ApplyButton from '../common/ApplyButton';
import SliderRow from '../common/SliderRow';
import type { ToolSubtoolProps, WasmImage } from '../../../types';

interface MotionBlurState {
  length: number;
  running: boolean;
}

export default class MotionBlur extends Component<ToolSubtoolProps, MotionBlurState> {
  wasm_img: WasmImage;
  changeApplied: boolean;

  constructor(props: ToolSubtoolProps) {
    super(props);
    this.wasm_img = imgObj.get_wasm_img();
    this.state = { length: 12, running: true };
    this.changeApplied = false;
  }

  componentDidMount = () => setTimeout(this.applyBlur, 0);

  componentWillUnmount = () => {
    if (!this.changeApplied) {
      this.wasm_img.discard_change();
      this.props.redraw?.();
    }
  };

  applyBlur = () => {
    this.wasm_img.motion_blur(this.state.length);
    this.props.redraw?.();
    this.setState({ running: false });
    this.changeApplied = false;
  };

  onLength = (length: number) => {
    this.setState({ length, running: true }, this.applyBlur);
  };

  onApply = () => {
    this.changeApplied = true;
    this.wasm_img.apply_change();
    this.props.onSelectTool('');
  };

  render() {
    return (
      <div className="editor-panel">
        <p className="editor-hint" style={{ visibility: this.state.running ? 'visible' : 'hidden' }}>
          Running…
        </p>
        <SliderRow label="Length" value={this.state.length} min={4} max={40} step={2} onChange={this.onLength} />
        <ApplyButton onApply={this.onApply} />
        <p className="editor-hint">Horizontal motion streak effect.</p>
      </div>
    );
  }
}
