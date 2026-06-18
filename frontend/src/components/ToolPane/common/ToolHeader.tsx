import React from 'react';

export interface ToolHeaderProps {
  onSelect: (evt: React.MouseEvent<HTMLDivElement>) => void;
  toolID: string;
  selectedTool: string;
  label: string;
  children?: React.ReactNode;
}

const ToolHeader: React.FC<ToolHeaderProps> = ({
  onSelect,
  toolID,
  selectedTool,
  label,
  children,
}) => {
  const selected = selectedTool === toolID;

  return (
    <div className="editor-header-wrapper">
      <div
        id={toolID}
        className={`editor-subtool-header${selected ? ' editor-subtool-header--open' : ''}`}
        onClick={onSelect}
        role="button"
        tabIndex={0}
      >
        <span>{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="8"
          className={`svg-down-arrow${selected ? ' svg-down-arrow--open' : ''}`}
        >
          <path fill="currentColor" d="M7.19 7.54L0 .34.34 0l6.85 6.85L14.04 0l.34.34-7.19 7.2z" />
        </svg>
      </div>
      {selected ? children : null}
    </div>
  );
};

export default ToolHeader;
