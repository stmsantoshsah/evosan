// d:/santosh/evosan/frontend/src/features/dashboard/components/ChatPanel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X,
  Compass
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'user' | 'evosan';
  text: string;
  isStreaming?: boolean;
}

interface ChatPanelProps {
  onClose?: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'evosan',
      text: 'Evosan Neural Uplink active. Senior Architectural Coach standing by. Practice your daily standups or outline your protocol bottlenecks.'
    }
  ]);
  const formatBoldText = (textStr: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(textStr)) !== null) {
      if (match.index > lastIndex) {
        parts.push(textStr.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.25)]">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < textStr.length) {
      parts.push(textStr.substring(lastIndex));
    }

    return parts.length > 0 ? parts : textStr;
  };

  const renderFormattedMessage = (text: string) => {
    if (!text) return null;
    
    // Merge any bullet characters that are separated from their text by a newline
    const preprocessedText = text.replace(/([•*\-])\s*\n\s*/g, '$1 ');
    const lines = preprocessedText.split('\n');
    
    return (
      <div className="space-y-1.5 font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex flex-row items-start gap-2 pl-2 w-full">
                <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                <span className="text-xs md:text-sm text-foreground/90 inline-block">{formatBoldText(content)}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-xs md:text-sm text-foreground/95 leading-relaxed">
              {formatBoldText(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice synthesis read-back
  const speakText = (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.90; // pace for verbal shadowing
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));
    if (engVoice) utterance.voice = engVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Text Streaming Message Dispatch
  const handleSendText = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessageText = inputText.trim();
    setInputText('');
    setIsProcessing(true);

    const userMsgId = `user_${Date.now()}`;
    const evosanMsgId = `evosan_${Date.now()}`;

    // Append human query to logs
    setMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: userMessageText }
    ]);

    // Append initial empty bot response placeholder
    setMessages(prev => [
      ...prev,
      { id: evosanMsgId, sender: 'evosan', text: '', isStreaming: true }
    ]);

    try {
      const formData = new FormData();
      formData.append('message', userMessageText);
      formData.append('user_id', 'santosh_sah');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/chat/stream`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Streaming connection failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponseText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullResponseText += chunk;

          // Stream chunks directly to the UI
          setMessages(prev => 
            prev.map(msg => 
              msg.id === evosanMsgId 
                ? { ...msg, text: fullResponseText }
                : msg
            )
          );
        }
      }

      // Finalize streaming state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === evosanMsgId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

      // Trigger read-back
      speakText(fullResponseText);

    } catch (error: any) {
      console.error(error);
      toast.error('Network downlink issue.');
      setMessages(prev => 
        prev.map(msg => 
          msg.id === evosanMsgId 
            ? { ...msg, text: 'Fault detected. Evosan offline.', isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle Voice Recording
  const startRecording = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      toast.error('Audio capabilities are missing in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Compress audio to standard webm container
      const options = { mimeType: 'audio/webm' };
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAudioChat(audioBlob);

        // Stop all track indicators
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      toast.success('System listening... 🎙️');
    } catch (e: any) {
      console.error('Audio recording init failed', e);
      toast.error('Microphone permissions blocked.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Upload Voice to Whisper Chat Api
  const uploadAudioChat = async (blob: Blob) => {
    setIsProcessing(true);
    const toastId = toast.loading(' Whisper transcribing vocal logs...');

    try {
      const formData = new FormData();
      formData.append('file', blob, 'audio_capture.webm');
      formData.append('user_id', 'santosh_sah');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/chat/voice`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Voice analysis failure');
      }

      const data = await response.json();
      toast.success('Vocal log decoded successfully!', { id: toastId });

      const userMsgId = `user_${Date.now()}`;
      const evosanMsgId = `evosan_${Date.now()}`;

      // Append transcribing result and final coaching response
      setMessages(prev => [
        ...prev,
        { id: userMsgId, sender: 'user', text: data.transcript || '[Audio Capture]' },
        { id: evosanMsgId, sender: 'evosan', text: data.response || 'Coaching connection offline.' }
      ]);

      speakText(data.response);

    } catch (e) {
      console.error(e);
      toast.error('Voice translation fault.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/75 backdrop-blur-md border border-border/40 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Title Header bar */}
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Compass className="text-primary w-4.5 h-4.5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xs md:text-sm font-bold text-foreground flex items-center gap-1.5">
              Evosan Tactical AI Hub
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h2>
            <p className="text-[10px] text-muted-foreground font-mono">GROQ LLAMA-3.3 // LANGRAPH STATEFUL</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            className={`p-2 rounded-lg border transition-all ${
              isSpeechEnabled 
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                : 'hover:bg-muted text-muted-foreground border-transparent'
            }`}
            title="Toggle read-aloud voice shadowing"
          >
            {isSpeechEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-all"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Messages list container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans custom-scrollbar bg-card/10">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className={`p-3.5 rounded-xl border text-xs md:text-sm leading-relaxed shadow-sm transition-all ${
              msg.sender === 'user'
                ? 'bg-primary text-primary-foreground border-primary/20 rounded-tr-none'
                : 'bg-card/50 text-foreground border-border/40 rounded-tl-none font-sans'
            }`}>
              {msg.text ? renderFormattedMessage(msg.text) : (
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce delay-225"></span>
                </div>
              )}
            </div>
            
            <span className="text-[9px] text-muted-foreground mt-1 px-1 font-mono uppercase tracking-wider">
              {msg.sender === 'user' ? 'Santosh' : 'Evosan Node'}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel boundary */}
      <div className="p-4 border-t border-border/40 bg-muted/20">
        <div className="flex items-center gap-2">
          {/* Recording Trigger */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`p-3 rounded-xl border transition-all duration-300 relative group flex-shrink-0 ${
              isRecording 
                ? 'bg-rose-500 text-white border-rose-500 animate-pulse scale-105' 
                : 'bg-card border-border hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground'
            }`}
            title={isRecording ? "Stop recording voice log" : "Record voice practice session"}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            disabled={isProcessing}
            placeholder={isRecording ? "System recording vocally..." : "Practice elevator introduction or ask directives..."}
            className="flex-1 bg-card border border-border/40 focus:border-primary/50 outline-none rounded-xl px-4 py-3 text-xs md:text-sm text-foreground transition-all duration-300 disabled:opacity-50"
          />

          {/* Send Action */}
          <button
            onClick={handleSendText}
            disabled={!inputText.trim() || isProcessing}
            className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
