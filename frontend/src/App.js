import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import './style.css';
import store from './store';
import Main from './components/Main';
import Auth from './components/Auth';

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Auth />} />
        </Routes>
        <ToastContainer position="bottom-center" limit={1} />
      </Provider>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('main'));
