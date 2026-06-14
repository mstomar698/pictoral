import imgObj from '../../common/imgObj';
import React, { Component } from 'react';
import GaussianBlur from './GaussianBlur';
import BilateralFilter from './BilateralFilter';
import Miniaturize from './Miniaturize';
import Pixelate from './Pixelate';
import ToolHeader from '../common/ToolHeader';
import type { EditorCallbacks, RedrawProps, WasmImage } from '../../../types';

interface FilterToolState {
  selectedTool: string;
}

type FilterToolProps = RedrawProps & Pick<EditorCallbacks, 'loadImage'>;

class FilterTool extends Component<FilterToolProps, FilterToolState> {
  wasm_img: WasmImage;

  constructor(props: FilterToolProps) {
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
          toolID="filter-pixelate"
          selectedTool={this.state.selectedTool}
          label="PIXELATE"
        >
          <Pixelate onSelectTool={this.onSelectTool} redraw={this.props.redraw} />
        </ToolHeader>

        <ToolHeader
          onSelect={this.onSelectTool}
          toolID="filter-gaussianblur"
          selectedTool={this.state.selectedTool}
          label="BLUR"
        >
          <GaussianBlur onSelectTool={this.onSelectTool} redraw={this.props.redraw} />
        </ToolHeader>

        <ToolHeader
          onSelect={this.onSelectTool}
          toolID="filter-miniaturize"
          selectedTool={this.state.selectedTool}
          label="MINIATURIZE"
        >
          <Miniaturize
            onSelectTool={this.onSelectTool}
            redraw={this.props.redraw}
            loadImage={this.props.loadImage}
          />
        </ToolHeader>

        <ToolHeader
          onSelect={this.onSelectTool}
          toolID="filter-bilateral-filter"
          selectedTool={this.state.selectedTool}
          label="SMOOTHEN"
        >
          <BilateralFilter
            onSelectTool={this.onSelectTool}
            redraw={this.props.redraw}
            loadImage={this.props.loadImage}
          />
        </ToolHeader>
      </div>
    );
  }
}

export default FilterTool;
