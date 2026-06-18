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
  panelOpen: boolean;
}

const TOOLS = [
  { id: 'tool-basic', iconID: 'basic' },
  { id: 'tool-transform', iconID: 'transform' },
  { id: 'tool-color', iconID: 'color' },
  { id: 'tool-filter', iconID: 'filter' },
  { id: 'tool-text', iconID: 'text' },
] as const;

class ToolPane extends Component<ToolPaneProps> {
  onSelectTool = (evt: React.MouseEvent) => {
    const parent = (evt.target as HTMLElement).closest('.tool-icon') as HTMLElement | null;
    if (parent) {
      const next = this.props.selectedTool === parent.id ? null : parent.id;
      this.props.onSelectTool(next);
    } else {
      this.props.onSelectTool(null);
    }
  };

  render() {
    const { panelOpen, selectedTool } = this.props;

    return (
      <aside
        className={`editor-sidebar${panelOpen ? ' editor-sidebar--open' : ''}`}
      >
        <nav className="editor-tool-rail" aria-label="Tools">
          <ul>
            {TOOLS.map((tool) => (
              <li key={tool.id}>
                <button
                  type="button"
                  className={`editor-tool-btn tool-icon${selectedTool === tool.id ? ' editor-tool-btn--active' : ''}`}
                  id={tool.id}
                  onClick={this.onSelectTool}
                  aria-pressed={selectedTool === tool.id}
                  title={tool.id.replace('tool-', '')}
                >
                  {toolIcons(tool.iconID, selectedTool === tool.id)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div
          id="tool-prop-list"
          className={`editor-tool-panel${panelOpen ? ' editor-tool-panel--open' : ''}`}
        >
          {panelOpen ? (
            <AccordionMenu
              selectedTool={selectedTool}
              close={this.onSelectTool}
              zoomRatio={this.props.zoomRatio}
              loadImage={this.props.loadImage}
            />
          ) : null}
        </div>
      </aside>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  zoomRatio: state.imgStat.get('zoomRatio') as number,
});

export default connect(mapStateToProps)(ToolPane);
