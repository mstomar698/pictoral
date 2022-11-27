import imgObj from './common/imgObj';
import React, { Component } from 'react';
import Header from './Header';
import ToolPane from './ToolPane';
import Footer from './Footer';
import Canvas from './Canvas/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setZoomRatio, setWidthHeight } from '../actions';
import { CIRCLE_RADIUS } from '../constants/handler.js';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTool: null,
    };
    this.imgSrc = `${URL_PATH}/img/pic-1.jpg`;
  }

  onSelectTool = (id) => this.setState({ selectedTool: id });

  resizeCanvas = (autoFit) => {
    let wasm_img = imgObj.get_wasm_img();
    let imgWidth = wasm_img.width();
    let imgHeight = wasm_img.height();

    let canvas = document.getElementById('canvas');
    let container = document.getElementById('canvas-container');

    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight;
    let zoomRatio = 1.0;
    if (!autoFit) {
      zoomRatio = this.props.zoomRatio;
    }

    let paddedHeight = containerHeight * 0.9;
    let paddedWidth = containerWidth * 0.9;

    if (autoFit) {
      if (paddedWidth >= imgWidth && paddedHeight >= imgHeight) {
        zoomRatio = 1.0;
      } else {
        zoomRatio = Math.min(paddedWidth / imgWidth, paddedHeight / imgHeight);
      }
    }

    if (autoFit) {
      this.props.setZoomRatio(zoomRatio);
    }

    let newWidth = Math.round(imgWidth * zoomRatio);
    let newHeight = Math.round(imgHeight * zoomRatio);
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      let ctx = canvas.getContext('2d');
      ctx.scale(zoomRatio, zoomRatio);
    }

    let left = Math.round(Math.max(0, containerWidth - newWidth) / 2);
    let top = Math.round(Math.max(0, containerHeight - newHeight) / 2);
    canvas.style.left = left + 'px';
    canvas.style.top = top + 'px';

    if (
      this.props.cropHandlersVisible ||
      this.props.pixelateHandlersVisible ||
      this.props.miniHandlersVisible
    ) {
      let handlers = document.getElementById('canvas-handler');
      handlers.style.left = left - CIRCLE_RADIUS + 20 + 'px';
      handlers.style.top = top - CIRCLE_RADIUS + 20 + 'px';
      handlers.style.width = newWidth + 2 * CIRCLE_RADIUS + 'px';
      handlers.style.height = newHeight + 2 * CIRCLE_RADIUS + 'px';
    }
  };

  loadImage = (src) => {
    if (!src) {
      src = this.imgSrc;
    }
    let srcType = 'url';

    if (src instanceof Blob) {
      if (!src.type.match('image.*')) {
        return;
      }
      srcType = 'file';
    }

    let img = new Image();
    if (srcType === 'url') {
      img.src = src;
      img.onload = () => {
        this.props.setWidthHeight({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        this.drawImage(img);
        this.imgSrc = src;
        this.setState({ selectedTool: null });
      };
    } else if (srcType === 'file') {
      let reader = new FileReader();
      reader.readAsDataURL(src);
      reader.onload = (evt) => {
        img.src = evt.target.result;
      };
      img.onload = () => {
        this.props.setWidthHeight({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        this.drawImage(img);
        this.imgSrc = src;

        this.setState({ selectedTool: null });
      };
    } else {
    }
  };

  drawImage = (img) => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    imgObj.imgBuff = img;
    let wasm_img = imgObj.get_wasm_img();

    let canvas = document.getElementById('canvas');
    setTimeout(() => canvas.getContext('2d').drawImage(img, 0, 0), 0);

    let tmpCanvas = document.createElement('canvas');
    let tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = w;
    tmpCanvas.height = h;
    tmpCtx.drawImage(img, 0, 0);
    let imgData = tmpCtx.getImageData(0, 0, w, h);
    wasm_img.reuse(w, h, imgData.data);

    this.resizeCanvas(true);
  };

  render() {
    let canvasParentStyle = { width: '100%', backgroundColor: '#1e2025' };
    canvasParentStyle.transform =
      this.state.selectedTool == null
        ? 'translate(0px, 0px)'
        : 'translate(250px, 0px)';
    let containerWidth =
      this.state.selectedTool == null
        ? 'calc(100vw - 76px)'
        : 'calc(100vw - 332px)';
    return (
      <div>
        <Header resizeCanvas={this.resizeCanvas} loadImage={this.loadImage} />
        <div
          style={{
            display: 'flex',
            position: 'relative',
            zIndex: '50',
            bottom: '0px',
            width: '100%',
          }}
        >
          <ToolPane
            onSelectTool={this.onSelectTool}
            selectedTool={this.state.selectedTool}
            loadImage={this.loadImage}
          />
          <div style={canvasParentStyle} id="canvas-parent">
            <Canvas
              resizeCanvas={this.resizeCanvas}
              loadImage={this.loadImage}
              containerWidth={containerWidth}
            />
            <Footer resizeCanvas={this.resizeCanvas} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  zoomRatio: state.imgStat.get('zoomRatio'),
  cropHandlersVisible: state.cropHandlersVisible,
  pixelateHandlersVisible: state.pixelateHandlers.get('visible'),
  miniHandlersVisible: state.miniHandlers.get('visible'),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setZoomRatio, setWidthHeight }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Main);
