import imgObj from './common/imgObj';
import React, { Component } from 'react';
import Header from './Header';
import ToolPane from './ToolPane';
import Footer from './Footer';
import Canvas from './Canvas/index';
import { connect, type ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setZoomRatio, setWidthHeight } from '../actions';
import { CIRCLE_RADIUS } from '../constants/handler';
import SubHeader from './SubHeader';
import type { RootState, AppDispatch } from '../store';

interface MainState {
  selectedTool: string | null;
}

type MainProps = ConnectedProps<typeof connector>;

class Main extends Component<MainProps, MainState> {
  imgSrc: string | Blob;

  constructor(props: MainProps) {
    super(props);
    this.state = { selectedTool: null };
    this.imgSrc = `${URL_PATH}/img/main.jpg`;
  }

  onSelectTool = (id: string | null) => this.setState({ selectedTool: id });

  resizeCanvas = (autoFit: boolean) => {
    const wasm_img = imgObj.get_wasm_img();
    const imgWidth = wasm_img.width();
    const imgHeight = wasm_img.height();

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const container = document.getElementById('canvas-container') as HTMLElement;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    let zoomRatio = 1.0;
    if (!autoFit) {
      zoomRatio = this.props.zoomRatio;
    }

    const paddedHeight = containerHeight * 0.9;
    const paddedWidth = containerWidth * 0.9;

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

    const newWidth = Math.round(imgWidth * zoomRatio);
    const newHeight = Math.round(imgHeight * zoomRatio);
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(zoomRatio, zoomRatio);
    }

    const left = Math.round(Math.max(0, containerWidth - newWidth) / 2);
    const top = Math.round(Math.max(0, containerHeight - newHeight) / 2);
    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;

    if (
      this.props.cropHandlersVisible ||
      this.props.pixelateHandlersVisible ||
      this.props.miniHandlersVisible
    ) {
      const handlers = document.getElementById('canvas-handler') as HTMLElement;
      handlers.style.left = `${left - CIRCLE_RADIUS + 20}px`;
      handlers.style.top = `${top - CIRCLE_RADIUS + 20}px`;
      handlers.style.width = `${newWidth + 2 * CIRCLE_RADIUS}px`;
      handlers.style.height = `${newHeight + 2 * CIRCLE_RADIUS}px`;
    }
  };

  loadImage = (src?: string | Blob) => {
    if (!src) {
      src = this.imgSrc as string;
    }
    let srcType: 'url' | 'file' = 'url';

    if (src instanceof Blob) {
      if (!src.type.match('image.*')) {
        return;
      }
      srcType = 'file';
    }

    const img = new Image();
    if (srcType === 'url') {
      img.src = src as string;
      img.onload = () => {
        this.props.setWidthHeight({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        this.drawImage(img);
        this.imgSrc = src as string;
        this.setState({ selectedTool: null });
      };
    } else if (srcType === 'file' && src instanceof Blob) {
      const blob = src;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (evt) => {
        if (evt.target?.result) {
          img.src = evt.target.result as string;
        }
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
    }
  };

  drawImage = (img: HTMLImageElement) => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    imgObj.imgBuff = img;
    const wasm_img = imgObj.get_wasm_img();

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    setTimeout(() => canvas.getContext('2d')?.drawImage(img, 0, 0), 0);

    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = w;
    tmpCanvas.height = h;
    tmpCtx?.drawImage(img, 0, 0);
    const imgData = tmpCtx!.getImageData(0, 0, w, h);
    wasm_img.reuse(w, h, Uint8Array.from(imgData.data));

    imgObj.initHistory();
    this.resizeCanvas(true);
  };

  render() {
    const canvasParentStyle: React.CSSProperties = {
      width: '100%',
      backgroundColor: '#1e2025',
      paddingBottom: '30px',
      transform:
        this.state.selectedTool == null
          ? 'translate(0px, 0px)'
          : 'translate(250px, 0px)',
    };
    const containerWidth =
      this.state.selectedTool == null
        ? 'calc(100vw - 76px)'
        : 'calc(100vw - 332px)';

    return (
      <div className="h-full relative">
        <Header />
        <SubHeader resizeCanvas={this.resizeCanvas} loadImage={this.loadImage} />
        <div
          style={{
            display: 'flex',
            position: 'relative',
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

const mapStateToProps = (state: RootState) => ({
  zoomRatio: state.imgStat.get('zoomRatio') as number,
  cropHandlersVisible: state.cropHandlersVisible,
  pixelateHandlersVisible: Boolean(state.pixelateHandlers.get('visible')),
  miniHandlersVisible: Boolean(state.miniHandlers.get('visible')),
});

const mapDispatchToProps = (dispatch: AppDispatch) =>
  bindActionCreators({ setZoomRatio, setWidthHeight }, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Main);
