import React from 'react';
import './Style.css';
import ReactMain from './Main.jsx';
const wasm = import('image-editor/image_editor_bg');

function Index() {
  console.log(wasm);
  return (
    <div>
      <ReactMain />
    </div>
  );
}

export default Index;
