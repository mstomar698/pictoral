import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { add } from 'image-editor/image_editor_bg';
const wasm = import('image-editor/image_editor_bg');
import { configureStore } from '@reduxjs/toolkit';
import 'babel-polyfill';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, compose } from 'redux';
import './App.css';
import ReactReducers from './reducers/Index';
import Main from './components/Main';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }
  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

let initialState = {
  imgStat: fromJS({
    zoomRatio: 0,
    width: 0,
    height: 0,
  }),

  cropHandlersVisible: false,
  pixelateHandlers: fromJS({
    visible: false,
    position: { x: 0, y: 0, width: 0, height: 0 },
  }),
  miniHandlers: fromJS({
    visible: false,
    heights: { top: 0, bottom: 0 },
  }),
};

let store = configureStore(
  { reducer: ReactReducers },

  initialState,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);

class App extends Component {
  constructor(props) {
    // console.log(Image);
    // console.log(wasm);
    console.log(add);
    super(props);
    this.state = {
      loading: false,
    };
  }
  render() {
    return (
      <ErrorBoundary>
        <Main />
      </ErrorBoundary>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('main')
);
