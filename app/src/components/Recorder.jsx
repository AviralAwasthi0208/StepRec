import React from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';

const Recorder = ({
  isRecording,
  onStart,
  onStop,
  onNewRecording,
  hasSteps,
  darkMode
}) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-sm border ${
        darkMode
          ? 'bg-slate-800 border-slate-700 text-white'
          : 'bg-white border-gray-200 text-slate-900'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Web Recorder
          {isRecording && (
            <span className="ml-2 text-red-500 animate-pulse text-sm">● Recording</span>
          )}
        </h2>

        {!isRecording ? (
          <div className="flex gap-3">
            {hasSteps && (
              <button
                onClick={onNewRecording}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <RotateCcw size={18} /> New Recording
              </button>
            )}
            <button
              onClick={onStart}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play size={18} /> Start Recording
            </button>
          </div>
        ) : (
          <button
            onClick={onStop}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Square size={18} /> Stop Recording
          </button>
        )}
      </div>

      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
        {isRecording
          ? "Perform actions in your browser tabs. Steps are recorded automatically."
          : "Click Start to begin recording your browser actions."}
      </p>
    </div>
  );
};

export default Recorder;
