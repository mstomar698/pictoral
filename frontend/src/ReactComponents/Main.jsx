import React, { useEffect, useState } from 'react';
import './Style.css';
import { add } from 'image-editor/image_editor_bg';
const wasm = import('image-editor/image_editor_bg');

const ReactMain = () => {
  const [ans, setAns] = useState(0);
  useEffect(() => {
    wasm.then(() => {
      setAns(add(1, 1));
    });
  }, [ans]);
  return (
    <div className="App">
      <header className="App-header">
        <h1>This is Main React Component</h1>
        <h2>
          Frontend is WORKING!!
          <br /> now CODE in <code>./src/app.js</code>
        </h2>
        <h2>
          Backend is WORKING!!
          <br />" 1 + 1 = `{ans}` "
        </h2>
      </header>
    </div>
  );
};

export default ReactMain;
