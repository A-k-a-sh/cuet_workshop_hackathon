import React, { useState, useEffect, useRef } from 'react';

export default function Recorder({ onRecordingComplete, onError }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Draw idle wave on mount
  useEffect(() => {
    drawIdleWave();
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const drawIdleWave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#475569'; // Slate 600
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      
      // Draw a subtle flat/slight sine line for idle state
      for (let i = 0; i < width; i++) {
        const angle = (i / width) * Math.PI * 2;
        const y = height / 2 + Math.sin(angle) * 2; // tiny wave
        ctx.lineTo(i, y);
      }
      ctx.stroke();
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const startRecording = async () => {
    chunksRef.current = [];
    setTimeLeft(30);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup Web Audio API for visualizer
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyserRef.current = analyser;
      source.connect(analyser);

      // Start recording
      const options = { mimeType: 'audio/webm' };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (err) {
        recorder = new MediaRecorder(stream); // fallback
      }
      
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        onRecordingComplete(audioBlob);
      };

      recorder.start(250);
      setIsRecording(true);

      // Start waveform animation
      cancelAnimationFrame(animationFrameRef.current);
      drawLiveWave();

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Microphone access error:', err);
      onError('Microphone access needed. Please allow in browser settings.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    setIsRecording(false);
    cancelAnimationFrame(animationFrameRef.current);
    drawIdleWave();
  };

  const drawLiveWave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, width, height);
      
      // Draw smooth wave
      ctx.lineWidth = 3;
      
      // Set up gradient for waveform
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#22c55e'); // Green 500
      gradient.addColorStop(0.5, '#4ade80'); // Green 400
      gradient.addColorStop(1, '#22c55e'); // Green 500
      ctx.strokeStyle = gradient;
      
      ctx.beginPath();
      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // SVG Circular countdown properties
  const radius = 45;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  return (
    <div className="bg-slate-800 border border-slate-700/60 p-6 rounded-2xl flex flex-col items-center gap-6 max-w-md mx-auto shadow-xl w-full">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Audio Recorder
        </h3>
        <p className="text-xs text-slate-500 text-center">
          Record up to 30 seconds of your self-introduction.
        </p>
      </div>

      {/* Waveform Canvas */}
      <div className="w-full bg-slate-900 border border-slate-950 rounded-xl px-4 py-6 relative overflow-hidden h-24 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width="400"
          height="80"
          className="w-full h-full max-h-[80px]"
        />
        {isRecording && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-500/20 border border-red-500/35 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-red-500">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
            Rec
          </div>
        )}
      </div>

      {/* Controls Container */}
      <div className="flex items-center gap-8">
        {/* Countdown Ring */}
        <div className="relative h-24 w-24 flex items-center justify-center">
          <svg className="absolute inset-0 transform -rotate-90" width="96" height="96" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#1e293b" // Slate 800
              strokeWidth={strokeWidth}
            />
            {/* Countdown Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={isRecording ? '#22c55e' : '#64748b'} // Green or Slate
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="text-xl font-extrabold tracking-tight text-white flex flex-col items-center">
            <span>{timeLeft}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">sec</span>
          </div>
        </div>

        {/* Record Button */}
        <div>
          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 active:scale-95 text-white h-16 w-16 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25 transition-all cursor-pointer"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1.5" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="bg-green-500 hover:bg-green-600 active:scale-95 text-white h-16 w-16 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 transition-all cursor-pointer"
            >
              <svg className="h-6 w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
