import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import StepCard from './StepCard';
import PDFGenerator from '../PDFGenerator';
import { Plus, Download, RotateCcw } from 'lucide-react';

const EditorLayout = ({ steps, setSteps, darkMode, onNewRecording }) => {
  const [activeStepId, setActiveStepId] = useState(null);

  // Scroll to active step
  const scrollToStep = (id) => {
    setActiveStepId(id);
    const element = document.getElementById(`step-card-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const updateStep = (id, updates) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const deleteStep = (id) => {
    if (window.confirm("Are you sure you want to delete this step?")) {
      setSteps(prev => prev.filter(step => step.id !== id));
    }
  };

  const addStep = (index) => {
    const newStep = {
      id: crypto.randomUUID(),
      actionType: 'MANUAL',
      description: '',
      timestamp: Date.now(),
      mode: 'WEB'
    };
    
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps.splice(index + 1, 0, newStep);
      return newSteps;
    });
    
    // Wait for render then scroll
    setTimeout(() => scrollToStep(newStep.id), 100);
  };

  return (
    <div className={`flex h-[calc(100vh-64px)] ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      
      {/* Left Sidebar */}
      <Sidebar 
        steps={steps} 
        activeStepId={activeStepId} 
        onStepClick={scrollToStep}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 pb-32">
          
          {/* Editor Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Workflow Guide
              </h1>
              <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>
                Review and edit your captured steps before exporting.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onNewRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <RotateCcw size={18} />
                New Recording
              </button>
              <PDFGenerator steps={steps} />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div id={`step-card-${step.id}`}>
                  <StepCard 
                    step={step} 
                    index={index} 
                    onUpdate={updateStep} 
                    onDelete={deleteStep}
                    darkMode={darkMode}
                  />
                </div>
                
                {/* Add Step Button (Between steps) */}
                <div className="flex justify-center group">
                  <button
                    onClick={() => addStep(index)}
                    className={`p-2 rounded-full transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 ${
                      darkMode 
                        ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' 
                        : 'bg-white text-blue-600 shadow-md hover:bg-blue-50'
                    }`}
                    title="Insert Step Here"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </React.Fragment>
            ))}
            
            {/* Add Step at the end */}
             <button
                onClick={() => addStep(steps.length - 1)}
                className={`w-full py-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-colors ${
                  darkMode 
                    ? 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200' 
                    : 'border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500'
                }`}
              >
                <Plus size={20} />
                <span className="font-medium">Add Final Step</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
