import imgObj from '../common/imgObj';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { setZoomRatio } from '../../actions';
import { connect, type ConnectedProps } from 'react-redux';
import CropHandlers from './CropHandlers';
import PixelateHandlers from './PixelateHandlers';
import MiniHandlers from './MiniaturizeHandlers';
import type { RootState, AppDispatch } from '../../store';
import type { EditorCallbacks } from '../../types';

type CanvasProps = ConnectedProps<typeof connector> & EditorCallbacks;

class Canvas extends Component<CanvasProps> {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;

  componentDidUpdate = (prevProps: CanvasProps) => {
    if (this.props.zoomRatio === 0) {
      return;
    }

    if (this.props.zoomRatio !== prevProps.zoomRatio && this.ctx && imgObj.imgBuff) {
      this.props.resizeCanvas(false);
      this.ctx.drawImage(imgObj.imgBuff, 0, 0);
    }
  };

  componentDidMount = () => {
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
    this.props.loadImage();
  };

  render() {
    return (
      <div className="editor-canvas-container scrollbar" id="canvas-container">
        <canvas id="canvas" ref={(canvas) => { this.canvas = canvas; }} />

        {this.props.cropHandlersVisible ? (
          <CropHandlers zoomRatio={this.props.zoomRatio} />
        ) : null}
        {this.props.pixelateHandlersVisible ? (
          <PixelateHandlers zoomRatio={this.props.zoomRatio} />
        ) : null}
        {this.props.miniHandlersVisible ? (
          <MiniHandlers zoomRatio={this.props.zoomRatio} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  zoomRatio: state.imgStat.get('zoomRatio') as number,
  cropHandlersVisible: state.cropHandlersVisible,
  pixelateHandlersVisible: Boolean(state.pixelateHandlers.get('visible')),
  miniHandlersVisible: Boolean(state.miniHandlers.get('visible')),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators({ setZoomRatio }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Canvas);
