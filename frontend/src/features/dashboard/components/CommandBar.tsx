'use client';

import { useState, useEffect } from 'react';
import { Zap, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useVoiceInput } from '../hooks/useVoiceInput';

const PLACEHOLDERS = [
  'Ate 2 eggs, drank 1L water. Did a 30 min run...',
  'Logged 250g grilled chicken, 150g sweet potato...',
  'Completed a 45 min core and power workout...',
  'Drank 500ml water and took vitamins...',
  'Finished afternoon deep work block, logged tasks...'
];

export default function CommandBar() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Voice Input Hook
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasBrowserSupport,
  } = useVoiceInput();

  // Sync transcript to input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setInput(''); // Clear input on new dictation
      startListening();
      toast('Listening...', {
        icon: '🎙️',
        style: { borderRadius: '100px', background: '#e11d48', color: '#fff' },
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) stopListening();

    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      // Call the new Smart Parser API
      const response = await fetch('/api/smart-parser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      let data;
      try {
        // Check content-type to ensure we are receiving JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error('Server returned non-JSON:', text.substring(0, 500));
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      } catch (parseError: any) {
        if (parseError.message.startsWith('Server error')) throw parseError;
        throw new Error(`Failed to parse server response: ${parseError.message}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to process input');
      }

      toast.success('Log added successfully!', {
        icon: '⚡',
        duration: 2500,
      });

      setInput('');

      // Allow toast to be seen before reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Failed to process command:', err);
      toast.error('Failed to process. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group z-10">
      <div className="absolute inset-y-0 left-3 md:left-4 flex items-center pointer-events-none">
        {isProcessing ? (
          <Loader2 size={16} className="md:w-[18px] md:h-[18px] text-primary animate-spin" />
        ) : (
          <Zap
            size={16}
            className="md:w-[18px] md:h-[18px] text-muted-foreground group-focus-within:text-primary transition-colors"
          />
        )}
      </div>
      <input
        type="text"
        placeholder={PLACEHOLDERS[placeholderIndex]}
        className="w-full bg-card/60 backdrop-blur-xl border border-border rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-xl shadow-foreground/5"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isProcessing}
      />
      {/* Voice Command Button */}
      {hasBrowserSupport && (
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`absolute inset-y-1.5 md:inset-y-2 right-12 md:right-14 px-3 rounded-xl transition-all flex items-center justify-center ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-zinc-500 hover:text-zinc-300'}`}
          title={isListening ? 'Stop Listening' : 'Voice Command'}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      )}

      <button
        type="submit"
        disabled={!input.trim() || isProcessing}
        className="absolute inset-y-1.5 md:inset-y-2 right-1.5 md:right-2 px-3 md:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-0 disabled:scale-90 flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/20"
      >
        <Sparkles size={14} className="md:w-4 md:h-4" />
      </button>
    </form>
  );
}
