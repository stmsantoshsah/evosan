'use client';

import React, { useState } from 'react';
import { useSignupMutation } from '../slices/authApiSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowRight, Activity, Cpu } from 'lucide-react';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
    });
    const [signup, { isLoading, error }] = useSignupMutation();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(formData).unwrap();
            router.push('/login');
        } catch (err) {
            console.error('Failed to signup:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
            {/* 1. BACKGROUND EFFECTS */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            <div className="absolute top-0 left-0 w-full h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* 2. THE CARD */}
            <div className="relative z-10 w-full max-w-md p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-purple-900/30 border border-purple-500/50 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <Activity className="text-purple-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-mono text-white tracking-tight">EVOSAN</h1>
                    <p className="text-purple-500/60 text-xs font-mono tracking-widest mt-2 uppercase">
                        New User Protocol v2.0
                    </p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>

                    <div className="relative">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu size={18} className="text-gray-500" /> CREATE IDENTITY
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-gray-500 uppercase ml-1">Full Designation</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        id="full_name"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono placeholder:text-gray-700"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-gray-500 uppercase ml-1">Communication Channel</label>
                                <div className="relative">
                                    <Activity className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono placeholder:text-gray-700"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-gray-500 uppercase ml-1">Secure Passkey</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono placeholder:text-gray-700"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && <div className="text-red-500 text-xs text-center font-mono">Initialization failed. Try again.</div>}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg mt-6 transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'REGISTERING...' : 'CONFIRM IDENTITY'}
                                {!isLoading && <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-6 flex justify-center text-xs text-gray-500 font-mono">
                            <Link href="/login" className="hover:text-purple-400 transition-colors">
                                [ Return to Login ]
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8 text-[10px] text-gray-700 font-mono">
                    SECURE REGISTRATION UPLINK • 2026 EVOSAN SYSTEMS
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
