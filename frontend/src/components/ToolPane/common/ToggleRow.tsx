import React from 'react';

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, checked, onChange, id }) => (
  <div className="editor-toggle-row">
    <span className="editor-label">{label}</span>
    <label className="editor-switch" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="editor-switch-track" />
    </label>
  </div>
);

export default ToggleRow;
