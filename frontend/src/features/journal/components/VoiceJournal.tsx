'use client';

import React, { useState, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Trash2,
  Send,
  Loader2,
  Volume2,
  ShieldCheck,
  Zap,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useUploadVoiceJournalMutation } from '../slices/journalApiSlice';

export default function VoiceJournal() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadVoiceJournal, { isLoading, data: result }] = useUploadVoiceJournalMutation();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleUpload = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('file', audioBlob, 'journal_voice.webm');

    try {
      await uploadVoiceJournal(formData).unwrap();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Volume2 className="text-purple-400" size={20} />
            Voice Codex
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Speak in English. Master your presence.</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
          <ShieldCheck size={14} className="text-purple-400" />
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-tighter">
            Secure Link Active
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-zinc-800 rounded-xl bg-black/40 mb-6">
        {!audioUrl ? (
          <div className="flex flex-col items-center">
            <div className={`relative ${isRecording ? 'animate-pulse' : ''}`}>
              {isRecording && (
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              )}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`h-20 w-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-zinc-800 hover:bg-zinc-700 hover:scale-105'
                }`}
              >
                {isRecording ? (
                  <Square fill="white" size={24} className="text-white" />
                ) : (
                  <Mic size={32} className="text-white" />
                )}
              </button>
            </div>
            <p className="mt-4 text-zinc-400 font-medium">
              {isRecording ? 'System Recording... Click to stop' : 'Initialize Voice Capture'}
            </p>
          </div>
        ) : (
          <div className="w-full px-10">
            <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 mb-6">
              <div className="flex items-center gap-3">
                <Play size={20} className="text-purple-400" />
                <span className="text-zinc-300 font-mono text-xs uppercase">
                  Journal_Voice_Encrypted.webm
                </span>
              </div>
              <button
                onClick={deleteRecording}
                className="text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-900/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              {isLoading ? 'TRANSMITTING...' : 'PROCESS SIGNAL'}
            </button>
          </div>
        )}
      </div>

      {/* AI ANALYSIS RESULTS */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-zinc-800 pt-8">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Zap size={64} className="text-purple-500" />
            </div>
            <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">
              Transcript Deciphered
            </h3>
            <p className="text-zinc-200 text-lg italic leading-relaxed">"{result.transcript}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-[10px] font-mono uppercase">
                  Confidence Score
                </span>
                <span className="text-purple-400 font-bold">
                  {result.analysis.confidence_score}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-1000"
                  style={{ width: `${result.analysis.confidence_score}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                <MessageSquare size={20} />
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] font-mono uppercase block">
                  Mood Detected
                </span>
                <span className="text-white font-bold">{result.analysis.mood}/10</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-xl">
            <h4 className="text-purple-400 font-bold font-mono text-sm mb-4 flex items-center gap-2">
              <ShieldCheck size={16} /> COACHING_DIRECTIVE
            </h4>
            <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
              {result.analysis.coaching_note}
            </p>

            <div className="space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Fluency Upgrades
              </span>
              {result.analysis.improvements.map((upgrade: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-black/40 p-3 rounded border border-zinc-800/50"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-purple-500"></div>
                  <p className="text-zinc-400 text-xs">{upgrade}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 bg-teal-500/10 p-4 rounded-lg border border-teal-500/20">
              <AlertCircle className="text-teal-400 shrink-0" size={18} />
              <div>
                <span className="text-teal-400 font-bold text-xs uppercase block mb-1">
                  Tactical Directive
                </span>
                <p className="text-teal-100 text-xs font-medium">
                  {result.analysis.tactical_directive}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
