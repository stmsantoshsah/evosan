'use client';
import React, { useState } from 'react';
import { useLoginMutation, useForgotPasswordMutation } from '../slices/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowRight, Activity, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const [forgotPassword, { isLoading: isResetting }] = useForgotPasswordMutation();
  const [resetMessage, setResetMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(null);
    setLocalError(null);
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      router.push('/dashboard');
    } catch (err: any) {
      const errorMsg = err.data?.detail || err.error || 'Connection refused';
      console.error('System Access Denied:', errorMsg);
      setLocalError(errorMsg);
    }
  };

  const handleResetKey = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setResetMessage({ type: 'error', text: 'Please enter your email first' });
      return;
    }

    try {
      await forgotPassword(email).unwrap();
      setResetMessage({ type: 'success', text: 'Reset link sent to your email' });
    } catch {
      setResetMessage({ type: 'error', text: 'Failed to trigger reset' });
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
                <label className="text-xs font-mono text-gray-500 uppercase ml-1">
                  User Identifier
                </label>
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
                <label className="text-xs font-mono text-gray-500 uppercase ml-1">
                  Security Key
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-gray-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono placeholder:text-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-500 hover:text-teal-400 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {localError && (
                <div className="text-red-500 text-xs text-center font-mono border border-red-500/20 bg-red-500/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
                  SYSTEM DENIED: {localError}
                </div>
              )}

              {resetMessage && (
                <div
                  className={`text-xs text-center font-mono flex items-center justify-center gap-1 ${resetMessage.type === 'success' ? 'text-teal-400' : 'text-red-500'}`}
                >
                  {resetMessage.type === 'success' && <CheckCircle2 size={14} />}
                  {resetMessage.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg mt-6 transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'INITIALIZING...' : 'INITIALIZE SESSION'}
                {!isLoading && (
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 flex justify-between text-xs text-gray-500 font-mono">
              <Link href="/signup" className="hover:text-teal-400 transition-colors">
                [ Create New ID ]
              </Link>
              <button
                onClick={handleResetKey}
                disabled={isResetting}
                className="hover:text-teal-400 transition-colors focus:outline-none disabled:opacity-50"
              >
                {isResetting ? '[ Resetting... ]' : '[ Reset Key ]'}
              </button>
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
