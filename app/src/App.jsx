import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Recorder from './components/Recorder';
import DesktopRecorder from './components/DesktopRecorder';
import EditorLayout from './components/Editor/EditorLayout';
import HelpModal from './components/HelpModal';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import Footer from './components/Footer';
import { ArrowLeft } from 'lucide-react';

function App() { 
  const [isRecording, setIsRecording] = useState(false);
  const [steps, setSteps] = useState([]);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Initialize dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Navigate to editor if steps exist and not recording
  useEffect(() => {
    // Only redirect if we have steps, we are NOT recording, and we are NOT already in the editor
    // Also avoid redirecting if we are just landing on dashboard with cleared steps (which is handled by steps.length check)
    if (steps.length > 0 && !isRecording && location.pathname !== '/editor') {
        navigate('/editor');
    }
  }, [steps.length, isRecording, location.pathname, navigate]);

  const addStep = useCallback((step) => {
    setSteps((prev) => {
      const lastStep = prev[prev.length - 1];
      // Deduplicate consecutive inputs
      if (lastStep && 
          lastStep.actionType === 'INPUT' && 
          step.actionType === 'INPUT' &&
          lastStep.xpath === step.xpath
      ) {
         return [...prev.slice(0, -1), { ...step, id: lastStep.id }];
      }
      return [...prev, { ...step, id: crypto.randomUUID() }];
    });
  }, []);

  // Extension detection & Message Handling
  useEffect(() => {
    const handleMessage = (event) => {
      // 1. Detection
      if (event.data.type === "EXTENSION_INSTALLED") {
        setExtensionInstalled(true);
      }
      
      // 2. Status Sync (Tango-like)
      if (event.data.type === "RECORDING_STATUS_RESPONSE" || event.data.type === "EXTERNAL_STATE_CHANGE") {
        const { isRecording: remoteIsRecording, steps: remoteSteps } = event.data.payload;
        
        // Sync recording state
        if (remoteIsRecording !== undefined) {
           setIsRecording(remoteIsRecording);
        }

        // Sync steps (Always sync if we have remote steps and local is empty, OR if we are just loading)
        if (remoteSteps && Array.isArray(remoteSteps)) {
             setSteps(prev => {
                 // Handle Reset/Clear from Extension
                 if (remoteSteps.length === 0) {
                     // If we receive an external update with 0 steps and not recording, assume reset
                     if (event.data.type === "EXTERNAL_STATE_CHANGE" && !remoteIsRecording) {
                         return [];
                     }
                     return prev;
                 }

                 // If we have no steps locally, accept remote steps
                 if (prev.length === 0) return remoteSteps;
                 // If we have fewer steps than remote, accept remote (e.g. missed some)
                 if (remoteSteps.length > prev.length) return remoteSteps;
                 return prev;
             });
        }
      }

      // 3. Receiving Steps
      if (event.data.type === "RECORDER_STEP") {
         if (!isRecording) setIsRecording(true);
         addStep(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Poll for extension and status
    const interval = setInterval(() => {
      if (!extensionInstalled) {
        window.postMessage({ type: "CHECK_EXTENSION_AVAILABILITY" }, "*");
      }
      // Also check status to sync if we reload the app
      window.postMessage({ type: "GET_RECORDING_STATUS_REQUEST" }, "*");
    }, 1000);

    const timeout = setTimeout(() => clearInterval(interval), 10000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isRecording, extensionInstalled, addStep]);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Securely tell extension to start
    window.postMessage({ type: "START_RECORDING_REQUEST" }, "*");
    toast.success('Recording started');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Securely tell extension to stop
    window.postMessage({ type: "STOP_RECORDING_REQUEST" }, "*");
    toast.success('Recording stopped');
  };

  const handleReset = () => {
    if (isRecording) {
      handleStopRecording();
    }
    setSteps([]);
    navigate('/');
    toast.success('Reset successfully');
  };

  const handleNewRecording = () => {
    if (steps.length > 0) {
      // Use toast.promise or custom confirm? 
      // For now keep confirm but use toast for result
      if (window.confirm("Start a new recording? Current steps will be cleared.")) {
        setSteps([]);
        window.postMessage({ type: "RESET_RECORDING_REQUEST" }, "*");
        navigate('/');
        toast.success('Ready for new recording');
      }
    } else {
        navigate('/');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'}`}>
      <Toaster position="top-center" />
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} darkMode={darkMode} />

      {/* Navbar */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onReset={() => {
          handleReset();
        }}
        setShowHelp={setShowHelp} 
      />

      <main className={`flex-grow w-full ${location.pathname === '/editor' ? "" : "max-w-7xl mx-auto p-6 lg:p-8"}`}>
          <Routes>
            <Route path="/" element={
                <Dashboard 
                  darkMode={darkMode}
                />
            } />
            <Route path="/record/web" element={
                <div className="space-y-8 animate-fade-in pb-24">
                  <button 
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-2 text-sm font-medium mb-4 ${
                      darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                  </button>

                  <Recorder 
                    isRecording={isRecording} 
                    onStart={handleStartRecording} 
                    onStop={handleStopRecording}
                    onNewRecording={handleNewRecording}
                    hasSteps={steps.length > 0}
                    addStep={addStep} 
                    darkMode={darkMode}
                  />
                </div>
            } />
            <Route path="/record/desktop" element={
                <div className="space-y-8 animate-fade-in pb-24">
                  <button 
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-2 text-sm font-medium mb-4 ${
                      darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                  </button>

                  <DesktopRecorder 
                    onRecordingComplete={(newSteps) => {
                        setSteps(newSteps);
                        // useEffect will handle navigation to editor
                        toast.success('Recording completed');
                    }}
                    darkMode={darkMode}
                  />
                </div>
            } />
            <Route path="/editor" element={
                <EditorLayout 
                  steps={steps} 
                  setSteps={setSteps} 
                  darkMode={darkMode} 
                  onNewRecording={handleNewRecording}
                />
            } />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
      </main>

      {location.pathname !== '/editor' && <Footer darkMode={darkMode} />}
    </div>
  );
}

export default App;