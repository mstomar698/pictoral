import imgObj from '../../common/imgObj';
import React, { Component } from 'react';
import ApplyButton from '../common/ApplyButton';
import SliderRow from '../common/SliderRow';
import type { ToolSubtoolProps, WasmImage } from '../../../types';

interface SharpenState {
  amount: number;
  running: boolean;
}

export default class Sharpen extends Component<ToolSubtoolProps, SharpenState> {
  wasm_img: WasmImage;
  changeApplied: boolean;

  constructor(props: ToolSubtoolProps) {
    super(props);
    this.wasm_img = imgObj.get_wasm_img();
    this.state = { amount: 10, running: true };
    this.changeApplied = false;
  }

  componentDidMount = () => setTimeout(this.applySharpen, 0);

  componentWillUnmount = () => {
    if (!this.changeApplied) {
      this.wasm_img.discard_change();
      this.props.redraw?.();
    }
  };

  applySharpen = () => {
    this.wasm_img.sharpen(this.state.amount / 10);
    this.props.redraw?.();
    this.setState({ running: false });
    this.changeApplied = false;
  };

  onAmount = (amount: number) => {
    this.setState({ amount, running: true }, this.applySharpen);
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
        <SliderRow label="Strength" value={this.state.amount} min={1} max={30} onChange={this.onAmount} />
        <ApplyButton onApply={this.onApply} />
        <p className="editor-hint">Unsharp mask — enhances edges and fine detail.</p>
      </div>
    );
  }
}
