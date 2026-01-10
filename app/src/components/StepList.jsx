import React from 'react';
import { MousePointer, Type, ArrowRight, CheckCircle, Activity } from 'lucide-react';

const StepList = ({ steps }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'CLICK': return <MousePointer size={16} />;
      case 'INPUT': return <Type size={16} />;
      case 'NAVIGATION': return <ArrowRight size={16} />;
      case 'SUBMIT': return <CheckCircle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getTimeLabel = (step) => {
    return step.timestamp ? new Date(step.timestamp).toLocaleTimeString() : '';
  };

  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={step.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600 flex items-center gap-1">
                  {getIcon(step.actionType)}
                  {step.actionType}
                </span>
                <span className="text-gray-400 text-xs">
                  {getTimeLabel(step)}
                </span>
              </div>
              <h3 className="text-lg font-medium mb-4">{step.description}</h3>
              
              {step.screenshot ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm max-w-2xl">
                  <img src={step.screenshot} alt={`Step ${index + 1}`} className="w-full h-auto" />
                  {/* Highlight box removed as per request */}
                  {/* {step.highlight && (
                    <div 
                      className="absolute border-4 border-red-500 rounded bg-red-500/10 pointer-events-none"
                      style={{
                        left: `${step.highlight.x}px`,
                        top: `${step.highlight.y}px`,
                        width: `${step.highlight.w}px`,
                        height: `${step.highlight.h}px`,
                        // Scale highlight if image is displayed smaller than original
                        // In a real app we'd need to handle scaling logic carefully
                        // For now we assume 1:1 or use percentages if we had viewport info
                      }}
                    />
                  )} */}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm flex items-center gap-2">
                  <Activity size={16} />
                  Screenshot unavailable for this step.
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepList;
