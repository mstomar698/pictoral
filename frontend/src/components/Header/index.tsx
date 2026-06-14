import React from 'react';
import Account from './Account';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <div className="w-full h-16 flex top-0 z-50 justify-between bg-gray-600 shadow-md">
    <Link to="/" className="text-white text-2xl font-bold p-4">Pictoral</Link>
    <Account />
  </div>
);

export default Header;
