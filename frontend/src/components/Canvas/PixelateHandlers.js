import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPixelateHandlersPosition } from '../../actions';
import {
  CIRCLE_RADIUS,
  HANDLER_COMMON_PROPS,
  DEF_HANDLER_RECT_WIDTH,
  DEF_HANDLER_RECT_HEIGHT,
  MIN_HANDLER_RECT_WIDTH,
  MIN_HANDLER_RECT_HEIGHT,
} from '../../constants/handler';

class PixelateHandlers extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedHandler: '' };
    this.canvas = document.getElementById('canvas');
    this.canvasWidth = Math.round(props.imgWidth * props.zoomRatio);
    this.canvasHeight = Math.round(props.imgHeight * props.zoomRatio);
    this.svg = null;

    this.handlerWidth = Math.min(this.canvasWidth, DEF_HANDLER_RECT_WIDTH);
    this.handlerHeight = Math.min(this.canvasHeight, DEF_HANDLER_RECT_HEIGHT);

    this.handlerX =
      CIRCLE_RADIUS + (this.canvasWidth - DEF_HANDLER_RECT_WIDTH) / 2;
    this.handlerY =
      CIRCLE_RADIUS + (this.canvasHeight - DEF_HANDLER_RECT_HEIGHT) / 2;

    this.handlerMovingX = 0;
    this.handlerMovingY = 0;
  }

  setPixelateRegion = () => {
    let ratio = this.props.zoomRatio;
    let x = Math.round((this.handlerX - CIRCLE_RADIUS) / ratio);
    let y = Math.round((this.handlerY - CIRCLE_RADIUS) / ratio);
    let width = Math.round(this.handlerWidth / ratio);
    let height = Math.round(this.handlerHeight / ratio);
    this.props.setPixelateHandlersPosition({ x, y, width, height });
  };

  noGhosting = (evt) => evt.preventDefault();
  componentDidMount = () => {
    this.setPixelateRegion();

    let imgHandlers = this.svg.getElementsByTagName('image');
    for (let i = 0; i < imgHandlers.length; i++) {
      imgHandlers[i].addEventListener('mousedown', this.noGhosting);
    }
  };
  componentWillUnmount = () => {
    let imgHandlers = this.svg.getElementsByTagName('image');
    for (let i = 0; i < imgHandlers.length; i++) {
      imgHandlers[i].removeEventListener('mousedown', this.noGhosting);
    }
  };

  componentDidUpdate = (prevProps) => {
    let resizeRatio = this.props.zoomRatio / prevProps.zoomRatio;
    this.handlerX = Math.round(
      (this.handlerX - CIRCLE_RADIUS) * resizeRatio + CIRCLE_RADIUS
    );
    this.handlerY = Math.round(
      (this.handlerY - CIRCLE_RADIUS) * resizeRatio + CIRCLE_RADIUS
    );
    this.handlerWidth = Math.round(this.handlerWidth * resizeRatio);
    this.handlerHeight = Math.round(this.handlerHeight * resizeRatio);
    this.canvasWidth = Math.round(this.canvasWidth * resizeRatio);
    this.canvasHeight = Math.round(this.canvasHeight * resizeRatio);
    this.setPosition();
    this.setPixelateRegion();
  };

  setPosition = () => {
    let xOffset = this.handlerX - CIRCLE_RADIUS;
    let yOffset = this.handlerY - CIRCLE_RADIUS;
    let w = this.handlerWidth;
    let h = this.handlerHeight;

    let imgHandlersXY = [
      [xOffset, yOffset],
      [xOffset + w, yOffset],
      [xOffset + w, yOffset + h],
      [xOffset, yOffset + h],

      [xOffset + w * 0.5, yOffset],
      [xOffset + w, yOffset + h * 0.5],
      [xOffset + w * 0.5, yOffset + h],
      [xOffset, yOffset + h * 0.5],
    ];

    let imgHandlers = this.svg.getElementsByTagName('image');
    for (let i = 0; i < imgHandlers.length; i++) {
      imgHandlers[i].setAttribute('x', imgHandlersXY[i][0]);
      imgHandlers[i].setAttribute('y', imgHandlersXY[i][1]);
    }

    let pathEle = this.svg.getElementsByTagName('path')[0];
    let path = composePath(
      {
        x: CIRCLE_RADIUS,
        y: CIRCLE_RADIUS,
        width: this.canvasWidth,
        height: this.canvasHeight,
      },
      {
        x: this.handlerX,
        y: this.handlerY,
        width: this.handlerWidth,
        height: this.handlerHeight,
      }
    );
    pathEle.setAttribute('d', path);

    let grabbingEle = this.svg.getElementsByTagName('rect')[0];
    grabbingEle.setAttribute('x', this.handlerX + CIRCLE_RADIUS);
    grabbingEle.setAttribute('y', this.handlerY + CIRCLE_RADIUS);
    grabbingEle.setAttribute('width', this.handlerWidth - CIRCLE_RADIUS * 2);
    grabbingEle.setAttribute('height', this.handlerHeight - CIRCLE_RADIUS * 2);
  };

  onMouseDown = (evt) => {
    if (!evt.target.classList.contains('canvas-handler')) {
      return;
    }

    if (evt.target.id === 'handler-8') {
      evt.target.style.cursor = 'grabbing';
    }

    this.handlerMovingX = evt.clientX;
    this.handlerMovingY = evt.clientY;
    this.setState({
      selectedHandler: evt.target.id,
    });
  };

  onMouseUp = (evt) => {
    if (this.state.selectedHandler) {
      if (this.state.selectedHandler === 'handler-8') {
        evt.target.style.cursor = 'grab';
      }

      this.setState({ selectedHandler: '' });
      this.setPixelateRegion();
    }
  };

  onMouseLeave = (evt) => {
    let rect = this.svg.getElementsByTagName('rect')[0];
    rect.style.cursor = 'grab';

    if (this.state.selectedHandler === '') {
      return;
    }
    this.setState({ selectedHandler: '' });
  };

  onMouseMove = (evt) => {
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
      this.handlerX - CIRCLE_RADIUS + this.handlerWidth > this.canvasWidth ||
      this.handlerX - CIRCLE_RADIUS < 0 ||
      this.handlerY - CIRCLE_RADIUS + this.handlerHeight > this.canvasHeight ||
      this.handlerY - CIRCLE_RADIUS < 0 ||
      this.handlerWidth < MIN_HANDLER_RECT_WIDTH ||
      this.handlerHeight < MIN_HANDLER_RECT_HEIGHT
    ) {
      this.handlerX = x2;
      this.handlerY = y2;
      this.handlerWidth = w;
      this.handlerHeight = h;
      return;
    }

    this.handlerMovingX = x;
    this.handlerMovingY = y;
    this.setPosition();
  };

  render() {
    let canvasLeft = this.canvas.style.left;
    let canvasTop = this.canvas.style.top;
    let svgStyle = {
      position: 'absolute',
      left: parseInt(canvasLeft) - CIRCLE_RADIUS + 20 + 'px',
      top: parseInt(canvasTop) - CIRCLE_RADIUS + 20 + 'px',
      width: this.canvasWidth + CIRCLE_RADIUS * 2,
      height: this.canvasHeight + CIRCLE_RADIUS * 2,
    };

    let pathAttribute = composePath(
      {
        x: CIRCLE_RADIUS,
        y: CIRCLE_RADIUS,
        width: this.canvasWidth,
        height: this.canvasHeight,
      },
      {
        x: this.handlerX,
        y: this.handlerY,
        width: this.handlerWidth,
        height: this.handlerHeight,
      }
    );

    let path = (
      <path d={pathAttribute} fill="#000" fillOpacity={0.5} strokeWidth={1} />
    );

    let xOffset = this.handlerX - CIRCLE_RADIUS;
    let yOffset = this.handlerY - CIRCLE_RADIUS;
    return (
      <svg
        id="canvas-handler"
        ref={(s) => (this.svg = s)}
        style={svgStyle}
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
          x={xOffset}
          y={yOffset}
          {...HANDLER_COMMON_PROPS}
        />
        <image
          style={{ cursor: 'nesw-resize' }}
          className="canvas-handler"
          id="handler-1"
          x={xOffset + this.handlerWidth}
          y={yOffset}
          {...HANDLER_COMMON_PROPS}
        />
        <image
          style={{ cursor: 'nwse-resize' }}
          className="canvas-handler"
          id="handler-2"
          x={xOffset + this.handlerWidth}
          y={yOffset + this.handlerHeight}
          {...HANDLER_COMMON_PROPS}
        />
        <image
          style={{ cursor: 'nesw-resize' }}
          className="canvas-handler"
          id="handler-3"
          x={xOffset}
          y={yOffset + this.handlerHeight}
          {...HANDLER_COMMON_PROPS}
        />

        <rect
          x={xOffset + CIRCLE_RADIUS * 2}
          y={yOffset + CIRCLE_RADIUS * 2}
          width={this.handlerWidth - CIRCLE_RADIUS * 2}
          height={this.handlerHeight - CIRCLE_RADIUS * 2}
          className="canvas-handler"
          id="handler-8"
          fillOpacity={0}
          cursor="grab"
        />

        <image
          style={{ cursor: 'ns-resize' }}
          className="canvas-handler"
          id="handler-4"
          x={xOffset + this.handlerWidth * 0.5}
          y={yOffset}
          {...HANDLER_COMMON_PROPS}
        />
        <image
          style={{ cursor: 'ew-resize' }}
          className="canvas-handler"
          id="handler-5"
          x={xOffset + this.handlerWidth}
          y={yOffset + this.handlerHeight * 0.5}
          {...HANDLER_COMMON_PROPS}
        />
        <image
          style={{ cursor: 'ns-resize' }}
          className="canvas-handler"
          id="handler-6"
          x={xOffset + this.handlerWidth * 0.5}
          y={yOffset + this.handlerHeight}
          {...HANDLER_COMMON_PROPS}
        />
        <image
          style={{ cursor: 'ew-resize' }}
          className="canvas-handler"
          id="handler-7"
          x={xOffset}
          y={yOffset + this.handlerHeight * 0.5}
          {...HANDLER_COMMON_PROPS}
        />
      </svg>
    );
  }
}

const mapStateToProps = (state) => ({
  imgWidth: state.imgStat.get('width'),
  imgHeight: state.imgStat.get('height'),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setPixelateHandlersPosition }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(PixelateHandlers);

const composePath = (outer, inner) => {
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
