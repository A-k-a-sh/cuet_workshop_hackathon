import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Recorder from './components/Recorder';
import Uploader from './components/Uploader';
import Transcript from './components/Transcript';
import Scorecard from './components/Scorecard';

// Custom Skeleton Loader Component
function SkeletonLoader({ currentStep }) {
  const steps = [
    "Transcribing voice recording...",
    "Analyzing grammar, pace, and speech pattern...",
    "Generating AI speech coaching scorecard..."
  ];

  return (
    <div className="bg-slate-850 border border-slate-700/65 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl flex flex-col gap-6 text-left animate-pulse">
      <div className="flex flex-col gap-2 border-b border-slate-700/60 pb-4">
        <div className="h-4 bg-slate-700 rounded-sm w-1/3 animate-pulse"></div>
        <div className="h-3 bg-slate-700 rounded-sm w-1/2 mt-1 animate-pulse"></div>
      </div>
      
      {/* Steps List */}
      <div className="flex flex-col gap-4 my-2">
        {steps.map((step, idx) => {
          const isPending = idx > currentStep;
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div key={idx} className="flex items-center gap-3">
              {isCompleted ? (
                <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">
                  ✓
                </div>
              ) : isActive ? (
                <div className="h-5 w-5 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-slate-700 bg-slate-800"></div>
              )}
              <span className={`text-xs font-semibold transition-colors duration-300 ${
                isActive ? 'text-green-400 font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mock scorecard block loader */}
      <div className="space-y-3 mt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-slate-900 border border-slate-950 rounded-xl"></div>
          <div className="h-20 bg-slate-900 border border-slate-950 rounded-xl col-span-2"></div>
        </div>
        <div className="h-10 bg-slate-900 border border-slate-950 rounded-xl w-full"></div>
        <div className="h-3 bg-slate-700 rounded-sm w-3/4"></div>
        <div className="h-3 bg-slate-700 rounded-sm w-5/6"></div>
      </div>
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState('IDLE'); // 'IDLE', 'PROCESSING', 'RESULTS'
  const [activeTab, setActiveTab] = useState('record'); // 'record' | 'upload'
  const [toast, setToast] = useState(null);
  const [loaderStep, setLoaderStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Toast helper
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle file analysis flow
  const analyzeAudio = async (audioBlobOrFile, isFile = false) => {
    setAppState('PROCESSING');
    setLoaderStep(0);
    setAnalysisResult(null);

    // Step loader interval: increments loaderStep every 1 second
    const stepInterval = setInterval(() => {
      setLoaderStep((prev) => {
        if (prev >= 2) {
          clearInterval(stepInterval);
          return 2;
        }
        return prev + 1;
      });
    }, 1000);

    try {
      // 1. Prepare FormData
      const formData = new FormData();
      if (isFile) {
        formData.append('file', audioBlobOrFile);
      } else {
        // Recording Blob, rename it to audio.webm
        formData.append('file', audioBlobOrFile, 'recording.webm');
      }

      // 2. Fire Transcribe Request
      const transcribeRes = await axios.post('/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { transcript, duration_seconds, word_count } = transcribeRes.data;

      if (!transcript || transcript.trim().length === 0) {
        clearInterval(stepInterval);
        showToast('No speech detected in recording. Try again.');
        setAppState('IDLE');
        return;
      }

      // 3. Fire Analyze Request
      const analyzeRes = await axios.post('/api/analyze', {
        transcript,
        duration_seconds,
        word_count
      });

      const result = analyzeRes.data;

      // 4. Wait for the step loaders to reach 2 and let 3 seconds lapse total
      await new Promise(resolve => setTimeout(resolve, 3100));

      setAnalysisResult({
        ...result,
        transcript
      });
      setAppState('RESULTS');

    } catch (err) {
      console.error(err);
      clearInterval(stepInterval);
      const errMsg = err.response?.data?.detail || 'Analysis failed. Please try again.';
      showToast(errMsg);
      setAppState('IDLE');
    }
  };

  // Action helpers
  const handleCopyTranscript = () => {
    if (analysisResult?.transcript) {
      navigator.clipboard.writeText(analysisResult.transcript);
      showToast('Transcript copied to clipboard!', 'success');
    }
  };

  const handleDownloadSummary = () => {
    if (!analysisResult) return;
    const textSummary = `SPEECH COACH ANALYSIS SUMMARY
=============================
Overall Score: ${analysisResult.overall_score}/100
Speaking Pace: ${analysisResult.wpm} WPM
Duration: ${analysisResult.duration_seconds.toFixed(1)} seconds
Word Count: ${analysisResult.word_count} words

Scores:
- Grammar: ${analysisResult.grammar.score}/100
- Vocabulary: ${analysisResult.vocabulary.score}/100
- Structure: ${analysisResult.structure.score}/100
- Confidence: ${analysisResult.confidence.score}/100

Key Strength:
${analysisResult.top_strength}

Top Improvement:
${analysisResult.top_improvement}

Transcript:
"${analysisResult.transcript}"
`;
    const blob = new Blob([textSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speech_analysis_scorecard.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Summary downloaded successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased relative overflow-hidden transition-colors duration-200">
      {/* Ambient background mesh glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Subtle diagnostic layout grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none"></div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 animate-bounce ${
          toast.type === 'success'
            ? 'bg-green-500/20 border-green-500/30 text-green-400'
            : 'bg-red-500/20 border-red-500/30 text-red-400'
        }`}>
          {toast.type === 'success' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span className="text-xs font-bold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-green-500 text-slate-950 p-2 rounded-xl shadow-md shadow-green-500/25">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">
              IntroCoach AI
            </h1>
            <p className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
              AI Self-Introduction Analyzer
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-700/50">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
          Whisper & Llama Active
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        <div className="text-left border-b border-slate-850 pb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            AI Speech Coach Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Record a 30-second introduction or upload an audio file to receive detailed feedback on your pacing, vocabulary level, structure, and speaking confidence.
          </p>
        </div>

        {/* State Machine Views */}
        {appState === 'IDLE' && (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            {/* Toggle tabs */}
            <div className="flex bg-slate-850 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('record')}
                className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'record'
                    ? 'bg-slate-750 text-white shadow-md border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Record Audio
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-slate-750 text-white shadow-md border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload Audio File
              </button>
            </div>

            {/* Render selected view */}
            <div className="mt-2 transition-all">
              {activeTab === 'record' ? (
                <Recorder
                  onRecordingComplete={(blob) => analyzeAudio(blob, false)}
                  onError={(err) => showToast(err)}
                />
              ) : (
                <Uploader
                  onFileSelected={(file) => analyzeAudio(file, true)}
                  onError={(err) => showToast(err)}
                />
              )}
            </div>
          </div>
        )}

        {appState === 'PROCESSING' && (
          <div className="w-full">
            <SkeletonLoader currentStep={loaderStep} />
          </div>
        )}

        {appState === 'RESULTS' && analysisResult && (
          <div className="flex flex-col gap-6 w-full animate-fadeIn">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-slate-800 border border-slate-700/50 p-4 rounded-xl shadow-md">
              <button
                type="button"
                onClick={() => setAppState('IDLE')}
                className="flex items-center gap-2 text-xs font-bold text-green-400 hover:text-green-300 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Analyze New Audio
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyTranscript}
                  className="bg-slate-700 hover:bg-slate-650 px-3.5 py-1.5 rounded-lg text-[10px] font-bold text-slate-200 hover:text-white transition-all border border-slate-600 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Transcript
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSummary}
                  className="bg-green-500 hover:bg-green-600 px-3.5 py-1.5 rounded-lg text-[10px] font-bold text-slate-950 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Summary
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Scorecard */}
              <div className="lg:col-span-12">
                <Scorecard scorecard={analysisResult} />
              </div>
              {/* Transcript */}
              <div className="lg:col-span-12">
                <Transcript
                  transcript={analysisResult.transcript}
                  wpm={analysisResult.wpm}
                  duration={analysisResult.duration_seconds}
                  wordCount={analysisResult.word_count}
                  fillerCounts={analysisResult.filler_counts}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-950/20 mt-auto">
        <p>© 2026 IntroCoach AI Speech Laboratory. Powered by Groq Whisper & Llama 3.3.</p>
      </footer>
    </div>
  );
}
