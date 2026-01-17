'use client';

import React, { useState } from 'react';
import { useLoginMutation } from '../slices/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowRight, Activity } from 'lucide-react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await login({ email, password }).unwrap();
            dispatch(setCredentials(userData));
            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to login:', err);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
            {/* 1. BACKGROUND EFFECTS */}
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

            {/* Top Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* 2. THE CARD */}
            <div className="relative z-10 w-full max-w-md p-8">

                {/* Header Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-teal-900/30 border border-teal-500/50 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                        <Activity className="text-teal-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-mono text-white tracking-tight">EVOSAN</h1>
                    <p className="text-teal-500/60 text-xs font-mono tracking-widest mt-2 uppercase">
                        System Access Portal v2.0
                    </p>
                </div>

                {/* The Form Box */}
                <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl relative group">

                    {/* Subtle Border Glow on Hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>

                    <div className="relative">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Lock size={18} className="text-gray-500" /> IDENTIFY YOURSELF
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-gray-500 uppercase ml-1">User Identifier</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono placeholder:text-gray-700"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-gray-500 uppercase ml-1">Security Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono placeholder:text-gray-700"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="text-red-500 text-xs text-center font-mono">Invalid identifier or security key</div>}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg mt-6 transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'INITIALIZING...' : 'INITIALIZE SESSION'}
                                {!isLoading && <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-6 flex justify-between text-xs text-gray-500 font-mono">
                            <Link href="/signup" className="hover:text-teal-400 transition-colors">
                                [ Create New ID ]
                            </Link>
                            <Link href="#" className="hover:text-teal-400 transition-colors">
                                [ Reset Key ]
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Status Footer */}
                <div className="text-center mt-8 text-[10px] text-gray-700 font-mono">
                    SECURE CONNECTION ESTABLISHED • ENCRYPTION: 256-BIT
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
