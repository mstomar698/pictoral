import React, { Component } from 'react';
import { connect } from 'react-redux';
import toolIcons from './toolIcons';
import AccordionMenu from './AccordionMenu';
import type { RootState } from '../../store';
import type { EditorCallbacks } from '../../types';

interface ToolPaneProps {
  onSelectTool: (id: string | null) => void;
  selectedTool: string | null;
  loadImage: EditorCallbacks['loadImage'];
  zoomRatio: number;
}

class ToolPane extends Component<ToolPaneProps> {
  accordion: HTMLDivElement | null = null;

  componentDidUpdate = () => {
    if (!this.props.selectedTool && this.accordion) {
      this.accordion.style.transform = 'translate(0px, 0px)';
    }
  };

  onSelectTool = (evt: React.MouseEvent) => {
    const parent = (evt.target as HTMLElement).closest('.tool-icon') as HTMLElement | null;
    if (parent && this.accordion) {
      this.props.onSelectTool(parent.id);
      this.accordion.style.transform = 'translate(256px, 0px)';
    } else {
      this.props.onSelectTool(null);
      if (this.accordion) {
        this.accordion.style.transform = 'translate(0px, 0px)';
      }
    }
  };

  render() {
    return (
      <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
        <div
          ref={(div) => { this.accordion = div; }}
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
            id="tool-basic"
            iconID="basic"
            onClick={this.onSelectTool}
            selected={this.props.selectedTool === 'tool-basic'}
          />
          <ToolIcon
            id="tool-transform"
            iconID="transform"
            onClick={this.onSelectTool}
            selected={this.props.selectedTool === 'tool-transform'}
          />
          <ToolIcon
            id="tool-color"
            iconID="color"
            onClick={this.onSelectTool}
            selected={this.props.selectedTool === 'tool-color'}
          />
          <ToolIcon
            id="tool-filter"
            iconID="filter"
            onClick={this.onSelectTool}
            selected={this.props.selectedTool === 'tool-filter'}
          />
          <ToolIcon
            id="tool-text"
            iconID="text"
            onClick={this.onSelectTool}
            selected={this.props.selectedTool === 'tool-text'}
          />
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  zoomRatio: state.imgStat.get('zoomRatio') as number,
});

export default connect(mapStateToProps)(ToolPane);

const iconStyle: React.CSSProperties = {
  width: '56px',
  height: '44px',
  padding: 0,
  cursor: 'pointer',
};

interface ToolIconProps {
  id: string;
  iconID: string;
  onClick: (evt: React.MouseEvent) => void;
  selected: boolean;
}

const ToolIcon: React.FC<ToolIconProps> = (props) => (
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
