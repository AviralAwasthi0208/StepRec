import React from 'react';
import { Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';

const StepCard = ({ step, index, onUpdate, onDelete, darkMode }) => {
  return (
    <div className={`group relative rounded-xl border shadow-sm transition-all hover:shadow-md ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header / Drag Handle Area */}
      <div className={`p-4 border-b flex items-center justify-between ${
        darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-50 bg-gray-50'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            darkMode ? 'bg-slate-700 text-white' : 'bg-white border border-gray-200 text-gray-700'
          }`}>
            {index + 1}
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${
            darkMode ? 'text-slate-400' : 'text-gray-400'
          }`}>
            {step.actionType}
          </span>
        </div>
        
        <button
          onClick={() => onDelete(step.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all dark:hover:bg-red-900/20"
          title="Delete Step"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 grid gap-6">
        {/* Editable Description */}
        <div>
          <label className={`block text-xs font-bold uppercase mb-2 ${
            darkMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            Description
          </label>
          <textarea
            value={step.description}
            onChange={(e) => onUpdate(step.id, { description: e.target.value })}
            className={`w-full p-3 rounded-lg border text-base font-medium transition-colors resize-none focus:ring-2 focus:ring-blue-500 outline-none ${
              darkMode 
                ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            rows={2}
            placeholder="Describe this step..."
          />
        </div>

        {/* Screenshot */}
        {step.screenshot ? (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900">
            <img 
              src={step.screenshot} 
              alt={`Step ${index + 1}`} 
              className="w-full h-auto object-contain max-h-[400px]" 
            />
          </div>
        ) : (
          <div className={`flex items-center justify-center h-48 rounded-lg border-2 border-dashed ${
            darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="text-center text-gray-400">
              <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
              <span className="text-sm">No screenshot available</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepCard;
