import imgObj from '../../common/imgObj';
import React, { Component } from 'react';
import Basic from './Basic';
import Exposure from './Exposure';
import ToolHeader from '../common/ToolHeader';
import type { RedrawProps } from '../../../types';
import type { WasmImage } from '../../../types';

interface ColorToolState {
  selectedTool: string;
}

class ColorTool extends Component<RedrawProps, ColorToolState> {
  wasm_img: WasmImage;

  constructor(props: RedrawProps) {
    super(props);
    this.state = { selectedTool: '' };
    this.wasm_img = imgObj.get_wasm_img();
  }

  onSelectTool = (evt?: React.MouseEvent<Element> | '') => {
    if (!evt || typeof evt === 'string') {
      this.setState({ selectedTool: '' });
      return;
    }
    const toolID = (evt.target as HTMLElement).id;
    if (toolID === this.state.selectedTool) {
      return;
    }
    this.setState({ selectedTool: toolID });
  };

  componentDidMount = () => this.wasm_img.rgb_to_hsi();
  componentWillUnmount = () => this.wasm_img.clear_hsi();

  render() {
    return (
      <div>
        <ToolHeader
          onSelect={this.onSelectTool}
          toolID="color-basic"
          selectedTool={this.state.selectedTool}
          label="TONE"
        >
          <Basic onSelectTool={this.onSelectTool} redraw={this.props.redraw} />
        </ToolHeader>
        <ToolHeader
          onSelect={this.onSelectTool}
          toolID="color-exposure"
          selectedTool={this.state.selectedTool}
          label="EXPOSURE"
        >
          <Exposure onSelectTool={this.onSelectTool} redraw={this.props.redraw} />
        </ToolHeader>
      </div>
    );
  }
}

export default ColorTool;
