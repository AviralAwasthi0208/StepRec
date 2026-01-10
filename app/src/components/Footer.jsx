import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full py-6 border-t mt-auto transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-900 border-slate-800 text-slate-400' 
        : 'bg-white border-gray-100 text-gray-500'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0">
          © {currentYear} StepRec. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <Link to="/privacy" className={`transition-colors ${
            darkMode ? 'hover:text-white' : 'hover:text-blue-600'
          }`}>
            Privacy Policy
          </Link>
          <a 
            href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=aviralawasthi0208@gmail.com&su=StepRec%20Support" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`transition-colors ${
              darkMode ? 'hover:text-white' : 'hover:text-blue-600'
            }`}
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
