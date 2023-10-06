import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
import thunk from 'redux-thunk';
import reducers from './reducers';
import Main from './components/Main';
import './style.css';

// Define your initial state using Immutable.js
const initialState = {
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

// Create a Redux store using Redux Toolkit
const store = configureStore({
  reducer: reducers,
  preloadedState: initialState,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});

const App = () => {
  return <Main />;
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('main')
);
