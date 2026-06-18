import React, { Component } from 'react';
import { connect, type ConnectedProps } from 'react-redux';
import SliderRow from '../common/SliderRow';
import {
  applyTextOverlay,
  canvasClickToImageCoords,
} from '../../common/textComposite';
import type { RedrawProps } from '../../../types';
import type { RootState } from '../../../store';

interface TextToolState {
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  placing: boolean;
}

type TextToolProps = ConnectedProps<typeof connector> & RedrawProps;

const FONT_OPTIONS = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Courier New", monospace', label: 'Monospace' },
  { value: 'Impact, sans-serif', label: 'Impact' },
];

class TextTool extends Component<TextToolProps, TextToolState> {
  canvasListener: ((e: MouseEvent) => void) | null = null;

  constructor(props: TextToolProps) {
    super(props);
    this.state = {
      text: 'Pictoral',
      fontSize: 48,
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      placing: false,
    };
  }

  componentWillUnmount = () => {
    this.stopPlacement();
  };

  stopPlacement = () => {
    const canvas = document.getElementById('canvas');
    if (canvas && this.canvasListener) {
      canvas.removeEventListener('click', this.canvasListener);
      canvas.classList.remove('editor-canvas--placing');
    }
    this.canvasListener = null;
    if (this.state.placing) {
      this.setState({ placing: false });
    }
  };

  startPlacement = () => {
    if (!this.state.text.trim()) return;

    this.stopPlacement();
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const listener = (evt: MouseEvent) => {
      const { x, y } = canvasClickToImageCoords(evt, this.props.zoomRatio);
      applyTextOverlay(
        {
          text: this.state.text,
          x,
          y,
          fontSize: this.state.fontSize,
          color: this.state.color,
          fontFamily: this.state.fontFamily,
        },
        () => this.props.redraw?.()
      );
      this.stopPlacement();
    };

    this.canvasListener = listener;
    canvas.addEventListener('click', listener);
    canvas.classList.add('editor-canvas--placing');
    this.setState({ placing: true });
  };

  render() {
    const { placing } = this.state;

    return (
      <div className="editor-panel">
        <p className="editor-hint">
          Type your caption, tune the style, then place it on the image with one click.
        </p>

        <label className="editor-field">
          <span className="editor-label">Text</span>
          <textarea
            className="editor-textarea"
            rows={3}
            value={this.state.text}
            onChange={(e) => this.setState({ text: e.target.value })}
            placeholder="Enter text…"
          />
        </label>

        <label className="editor-field">
          <span className="editor-label">Font</span>
          <select
            className="editor-select"
            value={this.state.fontFamily}
            onChange={(e) => this.setState({ fontFamily: e.target.value })}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <SliderRow
          label="Size"
          value={this.state.fontSize}
          min={12}
          max={120}
          step={2}
          onChange={(fontSize) => this.setState({ fontSize })}
        />

        <label className="editor-field editor-field--inline">
          <span className="editor-label">Color</span>
          <input
            type="color"
            className="editor-color-input"
            value={this.state.color}
            onChange={(e) => this.setState({ color: e.target.value })}
          />
        </label>

        <div className="editor-actions">
          {placing ? (
            <button
              type="button"
              className="editor-btn editor-btn--secondary"
              onClick={this.stopPlacement}
            >
              Cancel placement
            </button>
          ) : (
            <button
              type="button"
              className="editor-btn editor-btn--primary"
              onClick={this.startPlacement}
              disabled={!this.state.text.trim()}
            >
              Click canvas to place
            </button>
          )}
        </div>

        {placing ? (
          <p className="editor-placement-hint">Click anywhere on the image to add text.</p>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  zoomRatio: state.imgStat.get('zoomRatio') as number,
});

const connector = connect(mapStateToProps);
export default connector(TextTool);
