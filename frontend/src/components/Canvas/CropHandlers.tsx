import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { RootState } from '../../store';
import type { ZoomRatioProps } from '../../types';

const circleImg =
  'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzAwN2RmYyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+';
const handlerCommonProps = {
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
  xlinkHref: circleImg,
  preserveAspectRatio: 'none',
  width: '18',
  height: '18',
};

class CropHandlers extends Component<ZoomRatioProps & { imgWidth: number; imgHeight: number }, { selectedHandler: string }> {
  cropRegionInfo: HTMLElement | null;
  canvas: HTMLCanvasElement;
  canvasWidth: number;
  canvasHeight: number;
  canvasBbox: DOMRect;
  svg: SVGSVGElement | null;
  handlerX: number;
  handlerY: number;
  handlerWidth: number;
  handlerHeight: number;
  handlerMovingX: number;
  handlerMovingY: number;

  constructor(props: ZoomRatioProps & { imgWidth: number; imgHeight: number }) {
    super(props);
    this.state = {
      selectedHandler: '',
    };

    this.cropRegionInfo = null;

    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvasWidth = Math.round(props.imgWidth * props.zoomRatio);
    this.canvasHeight = Math.round(props.imgHeight * props.zoomRatio);
    this.canvasBbox = this.canvas.getBoundingClientRect();
    this.svg = null;

    this.handlerX = 9;
    this.handlerY = 9;
    this.handlerWidth = this.canvasWidth;
    this.handlerHeight = this.canvasHeight;
    this.handlerMovingX = 0;
    this.handlerMovingY = 0;
  }

  setCropRegionInfo = () => {
    if (!this.cropRegionInfo) return;
    let regionInfoEle = this.cropRegionInfo.getElementsByClassName(
      'canvas-handler-region-info'
    );
    let w = regionInfoEle[0] as HTMLElement;
    let h = regionInfoEle[1] as HTMLElement;
    let x = regionInfoEle[2] as HTMLElement;
    let y = regionInfoEle[3] as HTMLElement;

    let ratio = this.props.zoomRatio;
    w.innerText = Math.round(this.handlerWidth / ratio) + ' px';
    h.innerText = Math.round(this.handlerHeight / ratio) + ' px';
    x.innerText = String(Math.round((this.handlerX - 9) / ratio));
    y.innerText = String(Math.round((this.handlerY - 9) / ratio));
  };

  noGhosting = (evt: Event) => evt.preventDefault();

  componentDidMount = () => {
    this.cropRegionInfo = document.getElementById('crop-region-info');

    let imgHandlers = this.svg!.getElementsByTagName('image');
    for (let i = 0; i < imgHandlers.length; i++) {
      imgHandlers[i].addEventListener('mousedown', this.noGhosting);
    }
  };

  componentWillUnmount = () => {
    let imgHandlers = this.svg!.getElementsByTagName('image');
    for (let i = 0; i < imgHandlers.length; i++) {
      imgHandlers[i].removeEventListener('mousedown', this.noGhosting);
    }
  };

  componentDidUpdate = (prevProps: ZoomRatioProps & { imgWidth: number; imgHeight: number }) => {
    let resizeRatio = this.props.zoomRatio / prevProps.zoomRatio;
    this.handlerX = Math.round((this.handlerX - 9) * resizeRatio + 9);
    this.handlerY = Math.round((this.handlerY - 9) * resizeRatio + 9);
    this.handlerWidth = Math.round(this.handlerWidth * resizeRatio);
    this.handlerHeight = Math.round(this.handlerHeight * resizeRatio);
    this.canvasWidth = Math.round(this.canvasWidth * resizeRatio);
    this.canvasHeight = Math.round(this.canvasHeight * resizeRatio);
    this.setPosition();
  };

  setPosition = () => {
    let imgHandlersXY = [
      [this.handlerX - 9, this.handlerY - 9],
      [this.handlerX - 9 + this.handlerWidth, this.handlerY - 9],
      [
        this.handlerX - 9 + this.handlerWidth,
        this.handlerY - 9 + this.handlerHeight,
      ],
      [this.handlerX - 9, this.handlerY - 9 + this.handlerHeight],

      [this.handlerX - 9 + this.handlerWidth * 0.5, this.handlerY - 9],
      [
        this.handlerX - 9 + this.handlerWidth,
        this.handlerY - 9 + this.handlerHeight * 0.5,
      ],
      [
        this.handlerX - 9 + this.handlerWidth * 0.5,
        this.handlerY - 9 + this.handlerHeight,
      ],
      [this.handlerX - 9, this.handlerY - 9 + this.handlerHeight * 0.5],
    ];

    let imgHandlers = this.svg!.getElementsByTagName('image');
    for (let i = 0; i < imgHandlers.length; i++) {
      imgHandlers[i].setAttribute('x', String(imgHandlersXY[i][0]));
      imgHandlers[i].setAttribute('y', String(imgHandlersXY[i][1]));
    }

    let pathEle = this.svg!.getElementsByTagName('path')[0];
    let path = composePath(
      { x: 9, y: 9, width: this.canvasWidth, height: this.canvasHeight },
      {
        x: this.handlerX,
        y: this.handlerY,
        width: this.handlerWidth,
        height: this.handlerHeight,
      }
    );
    pathEle.setAttribute('d', path);

    let grabbingEle = this.svg!.getElementsByTagName('rect')[0];
    grabbingEle.setAttribute('x', String(this.handlerX + 9));
    grabbingEle.setAttribute('y', String(this.handlerY + 9));
    grabbingEle.setAttribute('width', String(this.handlerWidth - 18));
    grabbingEle.setAttribute('height', String(this.handlerHeight - 18));
  };

  onMouseDown = (evt: React.MouseEvent<SVGSVGElement>) => {
    const target = evt.target as SVGElement;
    if (!target.classList.contains('canvas-handler')) {
      return;
    }

    if (target.id === 'handler-8') {
      (target as unknown as HTMLElement).style.cursor = 'grabbing';
    }

    this.handlerMovingX = evt.clientX;
    this.handlerMovingY = evt.clientY;
    this.setState({
      selectedHandler: target.id,
    });
  };

  onMouseUp = (evt: React.MouseEvent<SVGSVGElement>) => {
    if (this.state.selectedHandler) {
      if (this.state.selectedHandler === 'handler-8') {
        (evt.target as unknown as HTMLElement).style.cursor = 'grab';
      }

      this.setState({ selectedHandler: '' });
    }
  };

  onMouseLeave = (_evt: React.MouseEvent<SVGSVGElement>) => {
    let rect = this.svg!.getElementsByTagName('rect')[0];
    rect.style.cursor = 'grab';

    if (this.state.selectedHandler === '') {
      return;
    }

    this.setState({ selectedHandler: '' });
  };

  onMouseMove = (evt: React.MouseEvent<SVGSVGElement>) => {
    if (!this.state.selectedHandler) {
      return;
    }

    let x = evt.clientX,
      y = evt.clientY;
    let deltaX = x - this.handlerMovingX;
    let deltaY = y - this.handlerMovingY;

    let x2 = this.handlerX;
    let y2 = this.handlerY;
    let w = this.handlerWidth;
    let h = this.handlerHeight;

    let handlerID = parseInt(this.state.selectedHandler.split('-')[1]);
    switch (handlerID) {
      case 0: {
        this.handlerX += deltaX;
        this.handlerY += deltaY;
        this.handlerWidth -= deltaX;
        this.handlerHeight -= deltaY;
        break;
      }
      case 1: {
        this.handlerY += deltaY;
        this.handlerWidth += deltaX;
        this.handlerHeight -= deltaY;
        break;
      }
      case 2: {
        this.handlerWidth += deltaX;
        this.handlerHeight += deltaY;
        break;
      }
      case 3: {
        this.handlerX += deltaX;
        this.handlerWidth -= deltaX;
        this.handlerHeight += deltaY;
        break;
      }

      case 4: {
        this.handlerY += deltaY;
        this.handlerHeight -= deltaY;
        break;
      }
      case 5: {
        this.handlerWidth += deltaX;
        break;
      }
      case 6: {
        this.handlerHeight += deltaY;
        break;
      }
      case 7: {
        this.handlerX += deltaX;
        this.handlerWidth -= deltaX;
        break;
      }

      case 8: {
        this.handlerX += deltaX;
        this.handlerY += deltaY;
        break;
      }
    }

    if (
      this.handlerX - 9 + this.handlerWidth > this.canvasWidth ||
      this.handlerX - 9 < 0 ||
      this.handlerY - 9 + this.handlerHeight > this.canvasHeight ||
      this.handlerY - 9 < 0 ||
      this.handlerWidth < 20 ||
      this.handlerHeight < 20
    ) {
      this.handlerX = x2;
      this.handlerY = y2;
      this.handlerWidth = w;
      this.handlerHeight = h;
      return;
    }

    this.handlerMovingX = x;
    this.handlerMovingY = y;
    this.setCropRegionInfo();
    this.setPosition();
  };

  render() {
    let width = this.handlerWidth;
    let height = this.handlerHeight;

    let canvasLeft = this.canvas.style.left;
    let canvasTop = this.canvas.style.top;
    let svgStyle = {
      position: 'absolute',
      left: parseInt(canvasLeft) - 9 + 20 + 'px',
      top: parseInt(canvasTop) - 9 + 20 + 'px',
      width: this.canvasWidth + 18,
      height: this.canvasHeight + 18,
    };

    let pathAttribute = composePath(
      { x: 9, y: 9, width, height },
      { x: 9, y: 9, width: this.canvasWidth, height: this.canvasHeight }
    );

    let path = (
      <path d={pathAttribute} fill="#000" fillOpacity={0.6} strokeWidth={1} />
    );
    return (
      <svg
        id="canvas-handler"
        ref={(s) => { this.svg = s; }}
        style={svgStyle as React.CSSProperties}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
      >
        {path}
        <image
          style={{ cursor: 'nwse-resize' }}
          className="canvas-handler"
          id="handler-0"
          x={0}
          y={0}
          {...handlerCommonProps}
        />
        <image
          style={{ cursor: 'nesw-resize' }}
          className="canvas-handler"
          id="handler-1"
          x={width}
          y={0}
          {...handlerCommonProps}
        />
        <image
          style={{ cursor: 'nwse-resize' }}
          className="canvas-handler"
          id="handler-2"
          x={width}
          y={height}
          {...handlerCommonProps}
        />
        <image
          style={{ cursor: 'nesw-resize' }}
          className="canvas-handler"
          id="handler-3"
          x={0}
          y={height}
          {...handlerCommonProps}
        />

        {/*
          rect's starting X/Y are bigger, width/height are smaller than the underlying innerRect for easy grab,
          otherwise, the grab cursor overlap the resize cursor when the mouse is over one of resize handlers.
          set the rect's fill to 'yellow', fillOpacity = 0.4, and you'd see what I mean.
          */}
        <rect
          x={9 + 9}
          y={9 + 9}
          width={width - 18}
          height={height - 18}
          className="canvas-handler"
          id="handler-8"
          fillOpacity={0}
          cursor="grab"
        />

        <image
          style={{ cursor: 'ns-resize' }}
          className="canvas-handler"
          id="handler-4"
          x={width * 0.5}
          y={0}
          {...handlerCommonProps}
        />
        <image
          style={{ cursor: 'ew-resize' }}
          className="canvas-handler"
          id="handler-5"
          x={width}
          y={height * 0.5}
          {...handlerCommonProps}
        />
        <image
          style={{ cursor: 'ns-resize' }}
          className="canvas-handler"
          id="handler-6"
          x={width * 0.5}
          y={height}
          {...handlerCommonProps}
        />
        <image
          style={{ cursor: 'ew-resize' }}
          className="canvas-handler"
          id="handler-7"
          x={0}
          y={height * 0.5}
          {...handlerCommonProps}
        />
      </svg>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  imgWidth: state.imgStat.get('width') as number,
  imgHeight: state.imgStat.get('height') as number,
});

export default connect(mapStateToProps, null)(CropHandlers);

const composePath = (outer: { x: number; y: number; width: number; height: number }, inner: { x: number; y: number; width: number; height: number }) => {
  let outerRect =
    'M' +
    outer.x +
    ',' +
    outer.y +
    ' h' +
    outer.width +
    ' v' +
    outer.height +
    ' h-' +
    outer.width +
    ' z';
  let innerRect =
    'M' +
    inner.x +
    ',' +
    inner.y +
    ' v' +
    inner.height +
    ' h' +
    inner.width +
    ' v-' +
    inner.height +
    ' z';
  return outerRect + innerRect;
};
