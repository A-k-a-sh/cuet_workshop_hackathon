import React, { useState, useRef } from 'react';

export default function Uploader({ onFileSelected, onError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Check size limit: 25MB = 25 * 1024 * 1024 bytes
    const maxLimit = 25 * 1024 * 1024;
    if (file.size > maxLimit) {
      onError('File must be under 25MB');
      return;
    }

    // Check extension
    const allowedExtensions = ['.mp3', '.m4a', '.amr', '.wav', '.webm', '.ogg'];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!isAllowed) {
      onError('Invalid audio format. Please upload .mp3, .m4a, .amr, .wav, or .webm.');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer text-center max-w-md mx-auto shadow-md ${
        isDragActive
          ? 'border-green-500 bg-green-500/10 text-green-400'
          : 'border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-800 text-slate-400'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleChange}
        className="hidden"
      />

      <div className="p-4 bg-slate-700/50 rounded-full border border-slate-600">
        <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-slate-200">
          Drag and drop your audio file here, or <span className="text-green-500 font-bold hover:underline">browse</span>
        </p>
        <p className="text-3xs text-slate-500">
          Supports MP3, M4A, WAV, AMR, WEBM (Max 25MB)
        </p>
      </div>
    </div>
  );
}
