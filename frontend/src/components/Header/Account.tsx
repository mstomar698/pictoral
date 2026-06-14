import React from 'react';
import { Link } from 'react-router-dom';

const Account: React.FC = () => (
  <Link to="/login" className="text-white text-2xl font-bold p-4">
    Login
  </Link>
);

export default Account;
