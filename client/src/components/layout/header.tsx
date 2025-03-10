import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-dark-800 border-b border-dark-600 p-4 flex justify-between items-center sticky top-0 z-10 w-full -mx-4">
      <div className="md:hidden">
        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-neon-green bg-opacity-20">
          <i className="fas fa-chart-line text-neon-green"></i>
        </div>
      </div>
      <h2 className="text-xl font-mono font-bold hidden md:block">{title}</h2>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-dark-700 text-gray-400 hover:text-white transition-colors duration-200">
          <i className="fas fa-bell"></i>
        </button>
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-dark-700 text-gray-400 hover:text-white transition-colors duration-200">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
