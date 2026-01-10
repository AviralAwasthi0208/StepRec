import React from 'react';
import { CheckCircle, MousePointer, Type, ArrowRight, Activity } from 'lucide-react';

const Sidebar = ({ steps, activeStepId, onStepClick, darkMode }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'CLICK': return <MousePointer size={14} />;
      case 'INPUT': return <Type size={14} />;
      case 'NAVIGATION': return <ArrowRight size={14} />;
      case 'SUBMIT': return <CheckCircle size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className={`w-80 flex-shrink-0 border-r h-[calc(100vh-64px)] overflow-y-auto sticky top-16 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="p-4 border-b border-gray-100 dark:border-slate-800">
        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Steps ({steps.length})</h3>
      </div>
      <div className="py-2">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            onClick={() => onStepClick(step.id)}
            className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 border-l-4 ${
              activeStepId === step.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              activeStepId === step.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-slate-400'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {step.description || "Untitled Step"}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                {getIcon(step.actionType)}
                <span>{step.actionType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
