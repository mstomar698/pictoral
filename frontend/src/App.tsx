import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import './style.css';
import store from './store';
import Main from './components/Main';
import Auth from './components/Auth';

const App: React.FC = () => (
  <BrowserRouter basename={URL_PATH || undefined}>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
      <ToastContainer position="bottom-center" limit={1} />
    </Provider>
  </BrowserRouter>
);

const container = document.getElementById('main');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
