import React from 'react';
import { Moon, Sun, HelpCircle, Mail } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode, onReset, setShowHelp }) => {
  return (
    <header className={`shadow-md sticky top-0 z-20 backdrop-blur-md ${darkMode ? 'bg-slate-900/90 border-b border-slate-700' : 'bg-white/90 border-b border-gray-100'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div 
            onClick={onReset}
            className="cursor-pointer flex items-center gap-2 group mr-8"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">StepRec</h1>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=aviralawasthi028@gmail.com&su=StepRec Feedback"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Send Feedback"
            >
              <Mail size={20} />
              <span className="hidden sm:inline">For Feedback</span>
            </a>

            <button 
              onClick={() => setShowHelp(true)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <HelpCircle size={20} />
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-all ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
