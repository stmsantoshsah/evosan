'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useResetPasswordMutation } from '@/features/auth/slices/authApiSlice';
import { Lock, ArrowRight, Activity, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage({ type: 'error', text: 'Invalid or missing reset token' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      await resetPassword({ token, newPassword: password }).unwrap();
      setMessage({ type: 'success', text: 'Password reset successful!' });
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      const errorMsg = err.data?.detail || 'Failed to reset password';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden p-8">
        <div className="relative z-10 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-900/20 border border-red-500/50 rounded-full flex items-center justify-center mb-6 mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">INVALID SESSION</h1>
          <p className="text-gray-400 mb-8">
            The reset link is missing or corrupted. Please request a new one.
          </p>
          <Link href="/login" className="text-teal-400 hover:text-teal-300 font-mono">
            [ BACK TO LOGIN ]
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      <div className="absolute top-0 left-0 w-full h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8">
        {/* Header Logo Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-purple-900/30 border border-purple-500/50 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Activity className="text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold font-mono text-white tracking-tight">EVOSAN</h1>
          <p className="text-purple-500/60 text-xs font-mono tracking-widest mt-2 uppercase">
            Credential Restoration v2.0
          </p>
        </div>

        {/* The Form Box */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>

          <div className="relative">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock size={18} className="text-gray-500" /> SECURE RESET
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-gray-500 uppercase ml-1">
                  New Security Key
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-gray-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-500 hover:text-purple-400 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-gray-500 uppercase ml-1">
                  Confirm Security Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-gray-700 text-gray-200 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`text-xs text-center font-mono py-2 rounded flex items-center justify-center gap-1 ${message.type === 'success' ? 'text-teal-400' : 'text-red-500'}`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg mt-6 transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                disabled={isLoading || message?.type === 'success'}
              >
                {isLoading
                  ? 'UPDATING KEY...'
                  : message?.type === 'success'
                    ? 'SUCCESS'
                    : 'UPDATE SECURITY KEY'}
                {!isLoading && message?.type !== 'success' && (
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="text-center mt-8 text-[10px] text-gray-700 font-mono uppercase">
          Encryption: AES-256 GCM • Active Node: Restorer-Alpha
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-teal-500 font-mono animate-pulse text-sm">
            INITIALIZING RESTORE MODULE...
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
