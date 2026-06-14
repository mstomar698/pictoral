import React from 'react';
import ImgFileHandler from './ImgFileHandler';

const SubHeader = ({ resizeCanvas, loadImage }) => (
  <div className="w-full h-max flex z-50 relative top-0 justify-center items-center bg-gray-700 shadow-md">
    <ImgFileHandler
      resizeCanvas={resizeCanvas}
      loadImage={loadImage}
    />
  </div>
);

export default SubHeader;
