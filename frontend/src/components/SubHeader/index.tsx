import React from 'react';
import ImgFileHandler from './ImgFileHandler';

interface SubHeaderProps {
  resizeCanvas: (autoFit: boolean) => void;
  loadImage: (src?: string | Blob) => void;
}

const SubHeader: React.FC<SubHeaderProps> = ({ resizeCanvas, loadImage }) => (
  <div className="editor-toolbar">
    <ImgFileHandler resizeCanvas={resizeCanvas} loadImage={loadImage} />
  </div>
);

export default SubHeader;
