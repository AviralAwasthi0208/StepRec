import React, { useState, useEffect } from 'react';
import { Play, Square, Video } from 'lucide-react';
import { screenRecorder } from '../lib/desktop-recorder';
import { processRecording } from '../lib/pipeline';
import { toast } from 'react-hot-toast';

const DesktopRecorder = ({
  onRecordingComplete,
  darkMode
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (isRecording) {
        screenRecorder.stopRecording();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      await screenRecorder.startRecording();
      setIsRecording(true);
      setDuration(0);

      const timer = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
      screenRecorder.timerInterval = timer;
    } catch (error) {
      console.error("Failed to start desktop recording", error);
      toast.error("Failed to start recording. Please allow screen access.");
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setProcessing(true);

    if (screenRecorder.timerInterval) {
      clearInterval(screenRecorder.timerInterval);
    }

    try {
      const recordingData = screenRecorder.stopRecording();
      const steps = await processRecording(recordingData);
      onRecordingComplete(steps);
    } catch (error) {
      console.error("Error processing recording:", error);
      toast.error("Error processing recording");
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-sm border ${
        darkMode
          ? 'bg-slate-800 border-slate-700 text-white'
          : 'bg-white border-gray-200 text-slate-900'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Video size={24} className="text-purple-600" />
          Desktop Recorder
          {isRecording && (
            <span className="ml-2 text-red-500 animate-pulse text-sm">● Recording</span>
          )}
        </h2>

        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={processing}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Play size={18} /> {processing ? "Processing..." : "Start Recording"}
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Square size={18} /> Stop Recording
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        {isRecording ? (
           <div className="text-4xl font-mono font-bold text-purple-600 mb-2">
             {formatTime(duration)}
           </div>
        ) : (
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Records your screen video and automatically detects steps based on clicks and screen changes.
          </p>
        )}
        
        {processing && (
            <div className="mt-4 text-purple-600 animate-pulse font-medium">
                Analyzing video and generating steps...
            </div>
        )}
      </div>
    </div>
  );
};

export default DesktopRecorder;
