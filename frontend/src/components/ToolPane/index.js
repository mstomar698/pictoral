import React, { Component } from 'react';
import { connect } from 'react-redux';
import toolIcons from './toolIcons';
import AccordionMenu from './AccordionMenu';

class ToolPane extends Component {
  constructor(props) {
    super(props);
    this.accordion = null;
    this.state = {};
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!this.props.selectedTool) {
      this.accordion.style.transform = 'translate(0px, 0px)';
    }
  };

  onSelectTool = (evt) => {
    let parent = evt.target.closest('.tool-icon');
    if (parent) {
      this.props.onSelectTool(parent.id);
      this.accordion.style.transform = 'translate(256px, 0px)';
    } else {
      this.props.onSelectTool(null);
      this.accordion.style.transform = 'translate(0px, 0px)';
    }
  };

  render() {
    return (
      <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
        <div
          ref={(div) => (this.accordion = div)}
          id="tool-prop-list"
          style={{
            width: '256px',
            height: '100%',
            position: 'absolute',
            backgroundColor: '#2d2e37',
            left: '-200px',
            zIndex: 5,
          }}
        >
          <AccordionMenu
            selectedTool={this.props.selectedTool}
            close={this.onSelectTool}
            zoomRatio={this.props.zoomRatio}
            loadImage={this.props.loadImage}
          />
        </div>
        <ul
          style={{
            width: '56px',
            height: '100%',
            listStyleType: 'none',
            padding: '0',
            backgroundColor: '#3f414c',
            marginTop: 0,
            zIndex: 10,
          }}
        >
          <ToolIcon
            id="tool-transform"
            iconID="transform"
            onClick={this.onSelectTool}
            selected={this.props.selectedTool === 'tool-transform'}
          />
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  zoomRatio: state.imgStat.get('zoomRatio'),
});
export default connect(mapStateToProps, null)(ToolPane);

const iconStyle = {
  width: '56px',
  height: '44px',
  padding: 0,
  cursor: 'pointer',
};
const ToolIcon = (props) => (
  <li
    style={iconStyle}
    onClick={props.onClick}
    className="tool-icon"
    id={props.id}
  >
    <button className="tool-icon" style={{ pointerEvents: 'none' }}>
      {toolIcons(props.iconID, props.selected)}
    </button>
  </li>
);
