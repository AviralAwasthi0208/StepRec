import React from 'react';
import { X, Chrome, CheckCircle, Globe, Shield, Eye, Lock } from 'lucide-react';

const HelpModal = ({ isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
        
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-blue-500">Getting Started</span> with StepRec
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Section 1: Installation (Production Ready) */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Chrome size={20} className="text-blue-500" />
              1. Install Browser Extension
            </h3>
            <div className={`p-6 rounded-xl border flex flex-col md:flex-row gap-6 items-center ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex-1">
                <p className="mb-4">
                  To accurately record web steps (clicks, typing, screenshots), StepRec requires a helper extension.
                </p>
                <ul className="space-y-2 text-sm opacity-80 mb-6">
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Official Chrome Web Store Extension</li>
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Lightweight & Secure</li>
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> No data collected silently</li>
                </ul>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); alert("In production, this opens the Chrome Web Store page."); }}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-500/20"
                >
                  <Chrome size={20} />
                  Add to Chrome
                </a>
                <p className="text-xs mt-3 opacity-60">
                  Version 1.0 • Verified Safe
                </p>
                <p className="text-xs mt-2 text-blue-500 font-medium">
                  Extensions for other browsers are coming soon!
                </p>
              </div>
              <div className={`hidden md:flex items-center justify-center w-32 h-32 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-inner`}>
                <Globe size={48} className="text-blue-500 opacity-50" />
              </div>
            </div>
          </section>

          {/* Section 2: Privacy & Safety (New) */}
          <section>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-green-500" />
              2. Privacy & Safety
            </h3>
            <div className={`grid md:grid-cols-2 gap-4`}>
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200'}`}>
                <h4 className="font-bold mb-2 flex items-center gap-2 text-sm"><Eye size={16} /> What we capture</h4>
                <p className="text-xs opacity-80">
                  Only when you press <strong>Start Recording</strong>:
                </p>
                <ul className="text-xs list-disc list-inside mt-2 space-y-1 opacity-70">
                  <li>Screenshots of clicked elements</li>
                  <li>Text you type (except passwords)</li>
                  <li>URL of the page you are on</li>
                </ul>
              </div>
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-gray-200'}`}>
                <h4 className="font-bold mb-2 flex items-center gap-2 text-sm"><Lock size={16} /> What we NEVER capture</h4>
                <ul className="text-xs list-disc list-inside space-y-1 opacity-70">
                  <li>Passwords or hidden fields</li>
                  <li>Browsing history</li>
                  <li>Background activity</li>
                  <li>Anything when "Stop" is pressed</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-center mt-4 opacity-60">
              Your data never leaves your device unless you explicitly export it.
            </p>
          </section>

          {/* Section 3: Modes removed */}

        </div>
      </div>
    </div>
  );
};

export default HelpModal;
