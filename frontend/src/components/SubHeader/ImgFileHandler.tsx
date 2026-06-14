import React, { useState, useEffect, useCallback } from 'react';
import OpenImage from './OpenImage';
import SaveImage from './SaveImage';
import RestoreImage from './RestoreImage';
import imgObj from '../common/imgObj';
import type { EditorCallbacks } from '../../types';

const ImgFileHandler: React.FC<EditorCallbacks> = ({ resizeCanvas, loadImage }) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateButtons = useCallback(() => {
    setCanUndo(imgObj.canUndo());
    setCanRedo(imgObj.canRedo());
  }, []);

  useEffect(() => {
    updateButtons();
    const interval = setInterval(updateButtons, 500);
    return () => clearInterval(interval);
  }, [updateButtons]);

  const handleUndo = useCallback(() => {
    if (imgObj.undo()) {
      loadImage();
      updateButtons();
    }
  }, [loadImage, updateButtons]);

  const handleRedo = useCallback(() => {
    if (imgObj.redo()) {
      loadImage();
      updateButtons();
    }
  }, [loadImage, updateButtons]);

  return (
    <div className="flex justify-around w-96 items-center">
      <button
        className={`inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-transparent text-sm font-medium ${
          canUndo
            ? 'text-gray-300 hover:text-gray-50 hover:border-gray-100'
            : 'text-gray-600 cursor-not-allowed'
        } focus:outline-none`}
        onClick={handleUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </button>
      <button
        className={`inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-transparent text-sm font-medium ${
          canRedo
            ? 'text-gray-300 hover:text-gray-50 hover:border-gray-100'
            : 'text-gray-600 cursor-not-allowed'
        } focus:outline-none`}
        onClick={handleRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
        </svg>
      </button>
      <div className="w-px h-6 bg-gray-500 mx-1" />
      <OpenImage resizeCanvas={resizeCanvas} loadImage={loadImage} />
      <SaveImage />
      <RestoreImage loadImage={loadImage} />
    </div>
  );
};

export default ImgFileHandler;
