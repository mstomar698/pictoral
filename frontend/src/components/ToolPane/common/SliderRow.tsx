import React from 'react';

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SliderRow: React.FC<SliderRowProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
}) => (
  <div className={`editor-slider-row${disabled ? ' editor-slider-row--disabled' : ''}`}>
    <div className="editor-slider-header">
      <span className="editor-label">{label}</span>
      <span className="editor-value">{value}</span>
    </div>
    <input
      type="range"
      className="editor-range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export default SliderRow;
