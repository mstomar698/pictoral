import imgObj from '../../common/imgObj';
import React, { Component } from 'react';
import ApplyButton from '../common/ApplyButton';
import ToggleRow from '../common/ToggleRow';
import SliderRow from '../common/SliderRow';
import type { RedrawProps, WasmImage } from '../../../types';

interface BasicState {
  grayscaled: boolean;
  inverted: boolean;
  brightness: number;
  contrast: number;
}

const BRIGHTNESS_RANGE = { min: -50, max: 50 };
const CONTRAST_RANGE = { min: 1, max: 20 };

export default class BasicTool extends Component<RedrawProps, BasicState> {
  wasm_img: WasmImage;
  changeApplied = true;

  constructor(props: RedrawProps) {
    super(props);
    this.wasm_img = imgObj.get_wasm_img();
    this.state = {
      grayscaled: false,
      inverted: false,
      brightness: 0,
      contrast: 10,
    };
  }

  componentDidMount = () => this.wasm_img.rgb_to_hsi();

  componentWillUnmount = () => {
    this.wasm_img.clear_hsi();
    if (!this.changeApplied) {
      this.wasm_img.discard_change();
      this.props.redraw?.();
    }
  };

  preview = () => {
    this.changeApplied = false;
    const h = 0;
    const s = 0;
    const t = 0;
    this.wasm_img.adjust_hsi(
      h,
      s,
      t,
      this.state.grayscaled,
      this.state.inverted
    );
    const c = this.state.contrast / 10;
    const b = (this.state.brightness * 5) / 255;
    this.wasm_img.manual_adjust_intensity(c, b);
    this.props.redraw?.();
  };

  onToggleGrayscale = (grayscaled: boolean) => {
    this.setState({ grayscaled }, this.preview);
  };

  onToggleInvert = (inverted: boolean) => {
    this.setState({ inverted }, this.preview);
  };

  onBrightness = (brightness: number) => {
    this.setState({ brightness }, this.preview);
  };

  onContrast = (contrast: number) => {
    this.setState({ contrast }, this.preview);
  };

  onAutoEnhance = () => {
    this.changeApplied = false;
    this.wasm_img.auto_adjust_intensity();
    this.props.redraw?.();
  };

  onReset = () => {
    this.wasm_img.discard_change();
    this.setState({
      grayscaled: false,
      inverted: false,
      brightness: 0,
      contrast: 10,
    });
    this.changeApplied = true;
    this.props.redraw?.();
  };

  onApply = () => {
    this.changeApplied = true;
    this.wasm_img.apply_change();
    this.props.redraw?.();
  };

  render() {
    return (
      <div className="editor-panel">
        <p className="editor-hint">
          Quick adjustments for everyday edits. Use Color for fine tone control.
        </p>

        <ToggleRow
          id="basic-grayscale"
          label="Black & White"
          checked={this.state.grayscaled}
          onChange={this.onToggleGrayscale}
        />
        <ToggleRow
          id="basic-invert"
          label="Invert"
          checked={this.state.inverted}
          onChange={this.onToggleInvert}
        />

        <div className="editor-section">
          <SliderRow
            label="Brightness"
            value={this.state.brightness}
            min={BRIGHTNESS_RANGE.min}
            max={BRIGHTNESS_RANGE.max}
            onChange={this.onBrightness}
          />
          <SliderRow
            label="Contrast"
            value={this.state.contrast}
            min={CONTRAST_RANGE.min}
            max={CONTRAST_RANGE.max}
            onChange={this.onContrast}
          />
        </div>

        <div className="editor-actions">
          <button type="button" className="editor-btn editor-btn--secondary" onClick={this.onAutoEnhance}>
            Auto enhance
          </button>
          <button type="button" className="editor-btn editor-btn--ghost" onClick={this.onReset}>
            Reset preview
          </button>
        </div>

        <ApplyButton onApply={this.onApply} />
      </div>
    );
  }
}
