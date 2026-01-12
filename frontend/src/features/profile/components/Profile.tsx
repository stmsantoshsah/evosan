'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Award, Edit3, Save, Camera, Loader2 } from 'lucide-react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../slices/profileApiSlice';

export default function Profile() {
    const { data: profile, isLoading: isFetching } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        specialization: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                bio: profile.bio || '',
                specialization: profile.specialization || ''
            });
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            await updateProfile(formData).unwrap();
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    if (isFetching) {
        return <div className="p-8 text-zinc-500">Retrieving security clearance and profile data...</div>;
    }

    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* --- HERO BANNER --- */}
            <div className="relative h-48 rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-950 overflow-hidden border border-zinc-800">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 flex items-end gap-6 translate-y-12">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl bg-zinc-900 border-4 border-black flex items-center justify-center text-zinc-600 overflow-hidden">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} />
                            )}
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-black/80 hover:bg-black rounded-lg text-white border border-zinc-700 opacity-0 group-hover:opacity-100 transition-all">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="mb-14">
                        <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                        <p className="text-zinc-400 flex items-center gap-2">
                            <Shield size={14} className="text-cyan-500" />
                            {profile.role} • <span className="text-zinc-500 text-sm">Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                {/* --- SIDEBAR INFO --- */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-zinc-300">
                                <Mail size={18} className="text-zinc-600" />
                                <span className="text-sm">{profile.email}</span>
                            </div>
                            {profile.specialization && (
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <Award size={18} className="text-zinc-600" />
                                    <span className="text-sm">{profile.specialization}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Biography</h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors uppercase"
                                >
                                    <Edit3 size={14} /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                        className="flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase disabled:opacity-50"
                                    >
                                        {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all p-2"
                                    />
                                </div>
                                {profile.role === 'DOCTOR' && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Clinical Specialization</label>
                                        <input
                                            type="text"
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all p-2"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Professional Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition-all h-32 resize-none p-2"
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-zinc-400 leading-relaxed italic">
                                {profile.bio || "No biography provided. Tell the system about your objectives and professional background."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
