import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';

import 'babel-polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';
import reducers from './reducers';
import './style.css';

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  render() {
    return <Main />;
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('main')
);
