import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setMiniHeights } from '../../actions';
import {
  CIRCLE_RADIUS,
  HANDLER_COMMON_PROPS,
  MIN_HANDLER_RECT_WIDTH,
  MIN_HANDLER_RECT_HEIGHT,
} from '../../constants/handler';

class MiniHandlers extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedHandler: '' };
    this.canvas = document.getElementById('canvas');
    this.canvasWidth = Math.round(props.imgWidth * props.zoomRatio);
    this.canvasHeight = Math.round(props.imgHeight * props.zoomRatio);
    this.svg = null;

    this.handlerWidth = this.canvasWidth;
    this.handlerHeight = this.canvasHeight / 3;

    this.handlerX = CIRCLE_RADIUS;

    this.handlerY = CIRCLE_RADIUS + this.canvasHeight / 3;

    this.handlerMovingX = 0;
    this.handlerMovingY = 0;
  }

  setMiniRegion = () => {
    let ratio = this.props.zoomRatio;
    let y = Math.round((this.handlerY - CIRCLE_RADIUS) / ratio);
    let height = Math.round(this.handlerHeight / ratio);
    this.props.setMiniHeights({
      top: y,
      bottom: this.props.imgHeight - (y + height),
    });
  };

  noGhosting = (evt) => evt.preventDefault();
  componentDidMount = () => {
    this.setMiniRegion();

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
    this.setMiniRegion();
  };

  setPosition = () => {
    let xOffset = this.handlerX - CIRCLE_RADIUS;
    let yOffset = this.handlerY - CIRCLE_RADIUS;
    let w = this.handlerWidth;
    let h = this.handlerHeight;

    let imgHandlersXY = [
      [xOffset + w * 0.5, yOffset],
      [xOffset + w * 0.5, yOffset + h],
    ];

    let imgHandlers = this.svg.getElementsByTagName('image');
    for (let i = 0; i < imgHandlers.length; i++) {
      imgHandlers[i].setAttribute('x', imgHandlersXY[i][0]);
      imgHandlers[i].setAttribute('y', imgHandlersXY[i][1]);
    }

    let pathEle = this.svg.getElementsByTagName('path')[0];
    let path = composePath({
      x: this.handlerX,
      y: this.handlerY,
      width: this.handlerWidth,
      height: this.handlerHeight,
    });
    pathEle.setAttribute('d', path);
  };

  onMouseDown = (evt) => {
    if (!evt.target.classList.contains('canvas-handler')) {
      return;
    }

    this.handlerMovingX = evt.clientX;
    this.handlerMovingY = evt.clientY;
    this.setState({
      selectedHandler: evt.target.id,
    });
  };

  onMouseUp = (evt) => {
    if (this.state.selectedHandler) {
      this.setState({ selectedHandler: '' });
      this.setMiniRegion();
    }
  };

  onMouseLeave = (evt) => {
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

    let deltaY = y - this.handlerMovingY;

    let x2 = this.handlerX;
    let y2 = this.handlerY;
    let w = this.handlerWidth;
    let h = this.handlerHeight;

    let handlerID = parseInt(this.state.selectedHandler.split('-')[1]);
    switch (handlerID) {
      case 4: {
        this.handlerY += deltaY;
        this.handlerHeight -= deltaY;
        break;
      }
      case 6: {
        this.handlerHeight += deltaY;
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

  onHandlerDown = (evt) => evt.preventDefault();

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

    let pathAttribute = composePath({
      x: this.handlerX,
      y: this.handlerY,
      width: this.handlerWidth,
      height: this.handlerHeight,
    });
    let path = (
      <path
        d={pathAttribute}
        fill="none"
        stroke="#ccc"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
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
          style={{ cursor: 'ns-resize' }}
          className="canvas-handler"
          id="handler-4"
          x={xOffset + this.handlerWidth * 0.5}
          y={yOffset}
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
      </svg>
    );
  }
}

const mapStateToProps = (state) => ({
  imgWidth: state.imgStat.get('width'),
  imgHeight: state.imgStat.get('height'),
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setMiniHeights }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(MiniHandlers);

const composePath = (inner) => {
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
  return innerRect;
};
