import React, { Component } from 'react';

interface TextToolProps {
  redraw?: (reposition?: boolean) => void;
}

class TextTool extends Component<TextToolProps> {
  render() {
    return <div>text tool</div>;
  }
}

export default TextTool;
