"use client";
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FocusPage() {
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(25 * 60); // Default 25 mins
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [volume, setVolume] = useState(0.5);

    // Audio Context Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    // Initialize Timer on Duration Change
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(duration);
        }
    }, [duration, isActive]);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // SESSION COMPLETE
            handleSessionComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleSessionComplete = async () => {
        setIsActive(false);
        stopAudio();
        setAudioEnabled(false);

        try {
            // Log Session
            await fetch('/api/gamification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    duration: duration,
                    taskName: taskName || 'Deep Work Protocol'
                })
            });
            alert("SESSION COMPLETE. DATA UPLOADED. +50 XP AWARDED.");
        } catch (error) {
            console.error(error);
            alert("SESSION COMPLETE. UPLOAD FAILED.");
        }
    };

    // --- AUDIO ENGINE (Web Audio API) ---
    const initAudio = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContext();
        }
        return audioContextRef.current;
    };

    const generateBrownNoise = (ctx: AudioContext) => {
        const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;

        // Generate Brown Noise (Integrate White Noise)
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + (0.02 * white)) / 1.02;
            data[i] = lastOut * 3.5; // Compensate for gain loss
        }
        return buffer;
    };

    // Cyberpunk Rain Simulator (Pink Noise + Filter logic simplified for pure generated audio)
    // For now, let's stick to the generated Brown Noise which is close to rain, 
    // or we could use an HTMLAudioElement for actual mp3s if the user provided them.
    // Given the prompt asks for "Cyberpunk Rain" or "White Noise", I'll stick to Brown Noise as "White/Neural Noise"
    // and ideally I would add an <audio> tag for a rain file if I had one. 
    // I'll stick to the generator for now to ensure it works without assets.

    const playAudio = () => {
        try {
            const ctx = initAudio();

            // Create Gain Node (Volume)
            if (!gainNodeRef.current) {
                gainNodeRef.current = ctx.createGain();
                gainNodeRef.current.connect(ctx.destination);
            }
            gainNodeRef.current.gain.value = volume;

            // Create Source
            const buffer = generateBrownNoise(ctx);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            source.connect(gainNodeRef.current);
            source.start();

            sourceNodeRef.current = source;
        } catch (error) {
            console.error("Audio generation failed:", error);
            alert("Audio Error: " + error);
        }
    };

    const stopAudio = () => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }
    };

    const toggleAudio = () => {
        if (audioEnabled) {
            stopAudio();
        } else {
            playAudio();
        }
        setAudioEnabled(!audioEnabled);
    };

    // Handle Volume Change
    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume;
        }
    }, [volume]);

    // Formatting
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const durationOptions = [15, 25, 45, 60, 90];

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-gray-300 font-mono">

            {/* Background Pulse */}
            {isActive && <div className="absolute inset-0 bg-teal-900/10 animate-pulse pointer-events-none" />}

            {/* Top Navigation */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <Link href="/" className="hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft size={16} /> EXIT TERMINAL
                </Link>

                {/* Audio Controls */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs text-gray-600">GAIN</span>
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                    </div>
                    <button onClick={toggleAudio} className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${audioEnabled ? 'bg-teal-900/30 border-teal-500 text-teal-400' : 'border-gray-800 text-gray-500'}`}>
                        {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        <span className="text-xs hidden md:inline">NEURAL_NOISE</span>
                    </button>
                </div>
            </div>

            {/* MAIN INTERFACE */}
            <div className="z-10 text-center space-y-8 max-w-2xl w-full px-4">

                {/* Task Input */}
                <div className="relative">
                    <input
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="ENTER OBJECTIVE..."
                        disabled={isActive}
                        className="bg-transparent border-b-2 border-gray-800 text-center text-xl md:text-3xl font-bold text-gray-200 w-full py-4 focus:outline-none focus:border-teal-500 transition-colors disabled:border-transparent placeholder:text-gray-700 font-mono"
                    />
                    {isActive && <div className="text-teal-500 text-xs mt-2 animate-pulse">SYSTEM LOCKED • RECORDING XP</div>}
                </div>

                {/* Timer Display */}
                <div className={`text-[120px] md:text-[180px] font-bold leading-none tracking-tighter transition-all ${isActive ? 'text-white drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]' : 'text-gray-800'}`}>
                    {formatTime(timeLeft)}
                </div>

                {/* Duration Selection (Only visible when paused) */}
                {!isActive && (
                    <div className="flex justify-center gap-4 mb-8">
                        {durationOptions.map((mins) => (
                            <button
                                key={mins}
                                onClick={() => setDuration(mins * 60)}
                                className={`px-4 py-2 text-sm rounded border transition-all ${duration === mins * 60 ? 'border-teal-500 text-teal-400 bg-teal-950/30' : 'border-gray-800 text-gray-600 hover:border-gray-600'}`}
                            >
                                {mins}M
                            </button>
                        ))}
                    </div>
                )}

                {/* Primary Controls */}
                <div className="flex justify-center gap-6">
                    {!isActive ? (
                        <button
                            onClick={() => { setIsActive(true); if (!audioEnabled) toggleAudio(); }}
                            className="group relative px-8 py-4 bg-teal-600 hover:bg-teal-500 text-black font-bold text-xl rounded-xl transition-all hover:scale-105 flex items-center gap-3 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                        >
                            <Play fill="black" size={24} /> INITIATE FOCUS
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsActive(false)}
                                className="px-8 py-4 bg-gray-900 border border-gray-700 hover:border-white text-white font-bold text-xl rounded-xl transition-all flex items-center gap-3"
                            >
                                <Pause size={24} /> PAUSE
                            </button>
                            <button
                                onClick={() => { setIsActive(false); setTimeLeft(duration); stopAudio(); setAudioEnabled(false); }}
                                className="px-8 py-4 bg-red-900/10 border border-red-900/50 text-red-500 font-bold text-xl rounded-xl transition-all hover:bg-red-900/20 flex items-center gap-3"
                            >
                                <Square fill="currentColor" size={18} /> ABORT
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Info Footer */}
            <div className="absolute bottom-12 text-gray-700 text-xs flex gap-8">
                <div>MODULE: <span className="text-teal-600">BROWN_NOISE_GEN_V1</span></div>
                <div>STATUS: <span className={isActive ? "text-green-500" : "text-yellow-600"}>{isActive ? "ACTIVE" : "STANDBY"}</span></div>
            </div>
        </div>
    );
}
