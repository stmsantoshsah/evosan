'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProfileView } from '@/features/profile/components/ProfileView';
import { Loader2 } from 'lucide-react';

export default function PublicProfilePage() {
    const params = useParams();
    const username = params.username as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/public/profile/${username}`);
                if (!response.ok) {
                    throw new Error('User not found or system offline');
                }
                const result = await response.json();
                setData(result.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-zinc-500 font-mono">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Establishing Secure Connection...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500 font-mono p-4">
                <h1 className="text-3xl font-bold mb-2">404 // SYSTEM ERROR</h1>
                <p className="text-zinc-600 mb-8">Target Identity Not Found</p>
                <div className="p-4 border border-red-900/50 bg-red-950/10 rounded max-w-md text-center">
                    <p>The requested profile "{username}" does not exist in the EVOSAN registry.</p>
                </div>
                <a href="/" className="mt-8 px-6 py-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors text-zinc-400">
                    Return to Home Base
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-4 md:p-8">
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">EVOSAN // <span className="text-teal-500">PUBLIC_ACCESS</span></h1>
                    <p className="text-xs text-zinc-500 font-mono">READ_ONLY MODE ENABLED</p>
                </div>
                <a href="/signup" className="text-xs text-teal-500 hover:text-teal-400 font-bold uppercase tracking-widest border border-teal-500/20 px-4 py-2 rounded bg-teal-500/10">
                    Build Your System
                </a>
            </div>

            <ProfileView
                profile={data.profile}
                gamification={data.gamification}
                isEditable={false}
            />
        </div>
    );
}
