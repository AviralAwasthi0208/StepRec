import React from 'react';
import { Globe, Monitor, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ darkMode }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          What would you like to capture and generate the workflow steps?
        </h2>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Choose a recording mode to get started
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Web Recorder Card */}
        <div 
          onClick={() => navigate('/record/web')}
          className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
            darkMode 
              ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-blue-900/20' 
              : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-xl'
          }`}
        >
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
            darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            <Globe size={32} />
          </div>
          
          <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Web Recorder
          </h3>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Capture workflows directly within your browser. Ideal for web-based tools and documentation.
          </p>
          
          <div className='bg-black text-white mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-blue-200 '>
            Chrome Extension Only . More browsers soon
          </div>
        </div>

        {/* Desktop Recorder Card */}
        <div 
          onClick={() => navigate('/record/desktop')}
          className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
            darkMode 
              ? 'bg-slate-800 border-slate-700 hover:border-purple-500 hover:shadow-purple-900/20' 
              : 'bg-white border-slate-200 hover:border-purple-500 hover:shadow-xl'
          }`}
        >
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
          </div>

          <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
            darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'
          }`}>
            <Monitor size={32} />
          </div>
          
          <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Desktop Recorder
          </h3>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Record any application on your screen. Perfect for desktop software and cross-application flows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
