import imgObj from '../../common/imgObj';
import React, { Component } from 'react';
import ApplyButton from '../common/ApplyButton';
import type { ToolSubtoolProps, WasmImage } from '../../../types';

interface CartoonifyState {
  running: boolean;
}

export default class Cartoonify extends Component<ToolSubtoolProps, CartoonifyState> {
  wasm_img: WasmImage;
  changeApplied: boolean;

  constructor(props: ToolSubtoolProps) {
    super(props);
    this.wasm_img = imgObj.get_wasm_img();
    this.state = { running: true };
    this.changeApplied = false;
  }

  componentDidMount = () => setTimeout(this.onCartoonify, 0);

  componentWillUnmount = () => {
    if (!this.changeApplied) {
      this.wasm_img.discard_change();
      this.props.redraw?.();
    }
  };

  onCartoonify = () => {
    this.wasm_img.cartoonify(4, 5.0, 3, false);
    this.props.redraw?.();
    this.setState({ running: false });
    this.changeApplied = false;
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
        <button type="button" className="editor-btn editor-btn--secondary" onClick={this.onCartoonify}>
          Re-run cartoonify
        </button>
        <ApplyButton onApply={this.onApply} />
        <p className="editor-hint">
          Median denoise plus edge-preserving smooth. Larger images benefit from stronger settings.
        </p>
      </div>
    );
  }
}
