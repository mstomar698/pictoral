import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showCropHandlers } from '../../../actions';
import React, { Component } from 'react';
import Crop from './Crop';
import Scale from './Scale';
import Rotate from './Rotate';
import ToolHeader from '../common/ToolHeader';
import type { AppDispatch } from '../../../store';
import imgObj from '../../common/imgObj';
import type { EditorCallbacks, RedrawProps } from '../../../types';

interface TransformToolState {
  selectedTool: string;
}

type TransformToolProps = RedrawProps &
  Pick<EditorCallbacks, 'loadImage'> & {
    showCropHandlers: (show: boolean) => void;
  };

class TransformTool extends Component<TransformToolProps, TransformToolState> {
  constructor(props: TransformToolProps) {
    super(props);
    this.state = { selectedTool: '' };
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

  render() {
    return (
      <div>
        <ToolHeader
          onSelect={this.onSelectTool}
          toolID="transform-crop"
          selectedTool={this.state.selectedTool}
          label="CROP"
        >
          <Crop
            onSelectTool={this.onSelectTool}
            redraw={this.props.redraw}
            showCropHandlers={this.props.showCropHandlers}
          />
        </ToolHeader>
        <ToolHeader
          onSelect={this.onSelectTool}
          toolID="transform-rotate"
          selectedTool={this.state.selectedTool}
          label="ROTATE"
        >
          <Rotate onSelectTool={this.onSelectTool} redraw={this.props.redraw} />
        </ToolHeader>
        <ToolHeader
          onSelect={this.onSelectTool}
          toolID="transform-scale"
          selectedTool={this.state.selectedTool}
          label="SCALE"
        >
          <Scale
            onSelectTool={this.onSelectTool}
            redraw={this.props.redraw}
            loadImage={this.props.loadImage}
          />
        </ToolHeader>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators({ showCropHandlers }, dispatch);

export default connect(null, mapDispatchToProps)(TransformTool);
