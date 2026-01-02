// evosan/frontend/app/page.tsx
'use client'; // We use client side here for the simple useEffect demonstration

import { useEffect, useState } from 'react';
import { getSystemStatus } from '@/lib/api';

export default function Home() {
  const [status, setStatus] = useState<string>('Checking...');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const data = await getSystemStatus();
      setStatus(data.status || 'Error');
      setMessage(data.message || 'Check console');
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-6">
        
        <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          EVOSAN
        </h1>
        
        <p className="text-zinc-400">Personal Growth System</p>

        <div className="border border-zinc-800 bg-zinc-900/50 p-6 rounded-lg shadow-xl backdrop-blur-md mt-8 text-center">
          <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">System Status</p>
          <div className="flex items-center gap-2 justify-center">
            {/* Blinking Dot Indicator */}
            <span className={`h-3 w-3 rounded-full ${status === 'System Operational' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-lg font-medium">{status}</span>
          </div>
          <p className="mt-4 text-sm text-zinc-400 font-light">"{message}"</p>
        </div>

      </div>
    </main>
  );
}