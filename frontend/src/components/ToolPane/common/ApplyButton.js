import React from 'react';
import imgObj from '../../common/imgObj';

const ApplyButton = (props) => {
  const handleClick = () => {
    // Save current state to history before applying
    imgObj.saveState();
    // Call the original onApply handler
    if (props.onApply) {
      props.onApply();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <button className="primary-btn apply-btn" onClick={handleClick}>
        <svg
          viewBox="0 0 20 20"
          width="20"
          height="20"
          transform="scale(0.8, 0.8)"
          pointerEvents="none"
        >
          <path
            fillRule="evenodd"
            fill="#FFF"
            d="M18.388 2L20 3.557 6.576 17.458 0 11.108 1.804 9.24l4.964 4.793L18.388 2z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ApplyButton;
