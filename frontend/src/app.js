// React binary
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// From backend
import {  add } from 'image-editor/image_editor_bg';
const wasm = import('image-editor/image_editor_bg');
// From package.json
// import { applyMiddleware, compose } from 'redux';
// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import thunkMiddleware from 'redux-thunk';
import 'babel-polyfill';
import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
// From directory
import Main from './components/Main';
import reducers from './reducers';
import './style.css';
import Index from './index.jsx';

// For checking errors in react components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }
  render() {
    if (this.state.errorInfo) {
      // Error path
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
    // Normally, just render children
    return this.props.children;
  }
}

// Basic image functionalities
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
// store & reducers block
// let allReducers = combineReducers({
//here are all reducers
//   initialState,
//   reducers,
// });
// enhancers initialized
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// initializing store
// const store = configureStore(
//   { reducer: allReducers },
//   initialState,
//   composeEnhancers(applyMiddleware(thunkMiddleware))
// );
let store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);

// Main Loader
class App extends Component {
  constructor(props) {
    console.log(Image);
    console.log(wasm);
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
      <Index />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('main')
);
