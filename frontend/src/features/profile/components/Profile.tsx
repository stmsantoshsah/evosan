'use client';

import { useState } from 'react'; // bio editing state could be kept or removed based on requirement, keeping for manifesto editing
// Actually, user wants "Manifesto" as a text block. I'll make it editable.
import { User, Shield, Zap, Activity, BookOpen, Dumbbell, Clock, Edit3, Save } from 'lucide-react';
import { useGetProfileQuery, useUpdateProfileMutation, useGetGamificationStatsQuery } from '../slices/profileApiSlice';
import { AchievementBadge } from './AchievementBadge';

export default function Profile() {
    const { data: profile, isLoading: isProfileLoading, error } = useGetProfileQuery();
    const { data: gameData, isLoading: isGameLoading } = useGetGamificationStatsQuery();
    const [updateProfile] = useUpdateProfileMutation();

    // Manifesto State (using bio field for now as proxy)
    const [isEditingManifesto, setIsEditingManifesto] = useState(false);
    const [manifestoContent, setManifestoContent] = useState('');

    const isLoading = isProfileLoading || isGameLoading;

    if (isLoading) {
        return <div className="p-8 text-zinc-500 font-mono animate-pulse">Initializing Identity Layer...</div>;
    }

    if (error) {
        return (
            <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-xl text-red-500 font-mono">
                <h3 className="text-lg font-bold mb-2">Systems Critical</h3>
                <p>Failed to load identity matrix.</p>
                <code className="text-xs mt-2 block opacity-70">{JSON.stringify(error)}</code>
            </div>
        );
    }

    if (!profile) return (
        <div className="p-8 text-zinc-500 font-mono">Profile not found.</div>
    );

    const stats = gameData?.data?.stats || {};
    const badges = gameData?.data?.badges || [];
    const gamification = gameData?.data || {};

    const handleSaveManifesto = async () => {
        try {
            await updateProfile({ bio: manifestoContent }).unwrap();
            setIsEditingManifesto(false);
        } catch (err) {
            console.error('Failed to update manifesto:', err);
        }
    };

    // Initialize manifesto on load
    if (!manifestoContent && profile.bio) {
        setManifestoContent(profile.bio);
    }

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-in fade-in duration-500">

            {/* --- LEFT COLUMN: PLAYER CARD (30%) --- */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
                    {/* Header Gradient */}
                    <div className="h-24 bg-gradient-to-b from-teal-900/40 to-zinc-900 border-b border-teal-500/20"></div>

                    <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-2xl bg-zinc-950 border-4 border-zinc-900 shadow-xl overflow-hidden mb-4 relative group">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                    <User size={48} className="text-zinc-600" />
                                </div>
                            )}
                            {/* Level Badge Overlay */}
                            <div className="absolute -bottom-2 -right-2 bg-zinc-950 border border-teal-500/50 text-teal-400 text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                                Lvl {gamification.level || 1}
                            </div>
                        </div>

                        {/* Identity */}
                        <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                {gamification.title || "Unknown Entity"}
                            </span>
                        </div>

                        {/* XP Bar */}
                        <div className="w-full mb-6">
                            <div className="flex justify-between text-[10px] uppercase text-zinc-500 font-bold mb-2">
                                <span>Progress</span>
                                <span>{gamification.xp} / {gamification.nextLevelXP} XP</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                                    style={{ width: `${(gamification.xp % 1000) / 10}%` }} // Simplified percentage logic
                                ></div>
                            </div>
                            <p className="text-[10px] text-zinc-600 mt-2 text-center">
                                {gamification.nextLevelXP - gamification.xp} XP to {gamification.title === "10x Engineer" ? "Self Actualization" : "Next Rank"}
                            </p>
                        </div>

                        {/* System Uptime */}
                        <div className="w-full pt-4 border-t border-zinc-800">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 uppercase tracking-wider font-bold">System Uptime</span>
                                <span className="text-teal-400 font-mono">{stats.uptime || 0} Days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact/Compact Info */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Identity Matrix</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-zinc-800 text-zinc-500">
                                <Shield size={14} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-zinc-500 uppercase">Role</p>
                                <p className="text-xs text-zinc-300 font-medium">{profile.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-zinc-800 text-zinc-500">
                                <Clock size={14} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-zinc-500 uppercase">Joined</p>
                                <p className="text-xs text-zinc-300 font-medium">{new Date(profile.joinedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: TROPHY CASE (70%) --- */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">

                {/* 1. LIFETIME STATS (The "Black Box") */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-3 text-orange-400">
                            <Dumbbell size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Workouts</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.totalWorkouts || 0}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Sessions Completed</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-3 text-cyan-400">
                            <BookOpen size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Knowledge</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.knowledgeIngested || 0}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Pages Ingested</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-3 text-purple-400">
                            <Zap size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Volume</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{(stats.volumeMoved / 1000).toFixed(1)}k</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Kg Moved</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-3 text-emerald-400">
                            <Activity size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Reliability</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.reliability || 0}%</p>
                        <p className="text-[10px] text-zinc-600 mt-1">System Consistency</p>
                    </div>
                </div>

                {/* 2. BADGE GRID */}
                <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        Achievement Protocol
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.map((badge: any) => (
                            <AchievementBadge
                                key={badge.id}
                                title={badge.title}
                                description={badge.description}
                                isUnlocked={badge.unlocked}
                                icon={badge.icon}
                            />
                        ))}
                    </div>
                </div>

                {/* 3. THE MANIFESTO */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            System Manifesto
                        </h3>
                        {!isEditingManifesto ? (
                            <button onClick={() => setIsEditingManifesto(true)} className="text-zinc-600 hover:text-white transition-colors">
                                <Edit3 size={14} />
                            </button>
                        ) : (
                            <button onClick={handleSaveManifesto} className="text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase">
                                <Save size={14} /> Save Objective
                            </button>
                        )}
                    </div>

                    {isEditingManifesto ? (
                        <textarea
                            value={manifestoContent}
                            onChange={(e) => setManifestoContent(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700/50 rounded-lg p-4 text-zinc-300 font-mono text-sm leading-relaxed outline-none focus:border-indigo-500/50 min-h-[120px]"
                            placeholder="Draft your mission statement..."
                        />
                    ) : (
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full"></div>
                            <p className="pl-6 text-zinc-300 font-mono text-sm md:text-base leading-relaxed italic opacity-80">
                                "{manifestoContent || "I am building this system to become the most disciplined version of myself, ensuring my physical hardware (body) can support my software (mind)."}"
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
