'use client';

import { useGetProfileQuery, useUpdateProfileMutation, useGetGamificationStatsQuery } from '../slices/profileApiSlice';
import { ProfileView } from './ProfileView';

export default function Profile() {
    const { data: profile, isLoading: isProfileLoading, error } = useGetProfileQuery();
    const { data: gameData, isLoading: isGameLoading } = useGetGamificationStatsQuery();
    const [updateProfile] = useUpdateProfileMutation();

    const isLoading = isProfileLoading || isGameLoading;

    if (isLoading) {
        return <div className="p-8 text-zinc-500 font-mono animate-pulse">Initializing Identity Layer...</div>;
    }

    if (error) {
        return (
            <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-xl text-red-500 font-mono">
                <h3 className="text-lg font-bold mb-2">Systems Critical</h3>
                <p>Failed to load identity matrix.</p>
                <code className="text-xs mt-2 block opacity-70 mb-4">{JSON.stringify(error)}</code>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded text-xs uppercase font-bold transition-colors"
                >
                    Re-authenticate
                </button>
            </div>
        );
    }

    if (!profile) return (
        <div className="p-8 text-zinc-500 font-mono">Profile not found.</div>
    );

    const handleSaveManifesto = async (content: string) => {
        try {
            await updateProfile({ bio: content }).unwrap();
        } catch (err) {
            console.error('Failed to update manifesto:', err);
        }
    };

    return (
        <ProfileView
            profile={profile}
            gamification={gameData?.data || {}}
            isEditable={true}
            onSaveManifesto={handleSaveManifesto}
        />
    );
}
