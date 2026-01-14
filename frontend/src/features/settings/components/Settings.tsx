'use client';

import { useState, useEffect } from 'react';
import { Save, Download, Trash2, User, Activity, Check } from 'lucide-react';
import {
    useGetWorkoutPlanQuery,
    useSaveWorkoutPlanMutation
} from '@/features/health/slices/healthApiSlice';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper Components
const TabButton = ({ active, onClick, label, icon }: any) => (
    <button
        onClick={onClick}
        className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-colors relative ${active ? 'text-teal-400' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
        {icon} {label}
        {active && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />}
    </button>
);

const SettingCard = ({ title, children }: any) => (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="font-bold text-zinc-200 mb-4 font-mono uppercase tracking-wider text-xs">{title}</h3>
        {children}
    </div>
);

export default function Settings() {
    const [activeTab, setActiveTab] = useState('protocols'); // Default to protocols as that was the main feature

    // --- PROTOCOLS TAB STATE ---
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [msg, setMsg] = useState('');
    const [formState, setFormState] = useState({
        routine_name: '',
        exercises: ''
    });

    // RTK Query hooks (Only used when Protocols tab is active, but hooks must be top level)
    const { data: plan, isLoading: isFetching } = useGetWorkoutPlanQuery(selectedDay);
    const [savePlan, { isLoading: isSaving }] = useSaveWorkoutPlanMutation();

    // Sync form state when data is loaded
    useEffect(() => {
        if (plan) {
            setFormState({
                routine_name: plan.routine_name || '',
                exercises: plan.exercises || ''
            });
        } else {
            setFormState({ routine_name: '', exercises: '' });
        }
    }, [plan, selectedDay]);

    const handleSaveProtocol = async () => {
        try {
            await savePlan({ day: selectedDay, ...formState }).unwrap();
            setMsg('Saved!');
            setTimeout(() => setMsg(''), 2000);
        } catch (e) {
            console.error(e);
            setMsg('Error saving');
        }
    };

    // --- GENERAL TAB STATE ---
    const [userName, setUserName] = useState('Santosh Sah'); // Mock default

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-white">System Configuration</h1>
            <p className="text-zinc-500 mb-8">Manage global variables and operational protocols.</p>

            {/* 1. THE TABS HEADER */}
            <div className="flex gap-6 border-b border-zinc-800 mb-8 overflow-x-auto">
                <TabButton
                    active={activeTab === 'general'}
                    onClick={() => setActiveTab('general')}
                    label="General"
                    icon={<User size={18} />}
                />
                <TabButton
                    active={activeTab === 'protocols'}
                    onClick={() => setActiveTab('protocols')}
                    label="Protocols (Workout)"
                    icon={<Activity size={18} />}
                />
                <TabButton
                    active={activeTab === 'data'}
                    onClick={() => setActiveTab('data')}
                    label="Data Management"
                    icon={<Download size={18} />}
                />
            </div>

            {/* 2. THE CONTENT AREAS */}

            {/* --- TAB 1: GENERAL --- */}
            {activeTab === 'general' && (
                <div className="grid gap-6 max-w-2xl animate-in fade-in">
                    <SettingCard title="Identity">
                        <div className="flex gap-4">
                            <input
                                className="bg-zinc-950 border border-zinc-800 rounded p-2 w-full text-zinc-200 outline-none focus:border-teal-500"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <button className="px-4 py-2 bg-teal-600/20 text-teal-400 border border-teal-600/50 rounded hover:bg-teal-600/30 transition-colors">
                                Update
                            </button>
                        </div>
                    </SettingCard>

                    <SettingCard title="System Units">
                        <div className="flex gap-4 text-zinc-300">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="units" defaultChecked className="accent-teal-500" /> Metric (kg/km)
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="units" className="accent-teal-500" /> Imperial (lbs/mi)
                            </label>
                        </div>
                    </SettingCard>
                </div>
            )}

            {/* --- TAB 2: PROTOCOLS (Your Workout Planner) --- */}
            {activeTab === 'protocols' && (
                <div className="flex flex-col md:flex-row gap-6 animate-in fade-in">
                    {/* Sidebar for Days */}
                    <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`p-3 text-left rounded-lg transition-all whitespace-nowrap ${selectedDay === day
                                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
                                        : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Editor Area */}
                    <div className="w-full md:w-3/4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <div className="mb-6">
                            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Routine Name</label>
                            <input
                                className="w-full bg-black border border-zinc-800 rounded p-3 font-mono text-teal-200 outline-none focus:border-teal-500 transition-colors"
                                value={formState.routine_name}
                                onChange={e => setFormState({ ...formState, routine_name: e.target.value })}
                                placeholder="e.g. UPPER BODY HYPERTROPHY"
                            />
                        </div>

                        <div className="mb-6 h-[400px]">
                            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Execution Script</label>
                            <textarea
                                className="w-full h-full bg-black border border-zinc-800 rounded p-4 font-mono text-sm leading-relaxed text-zinc-300 focus:border-teal-500 outline-none resize-none"
                                value={formState.exercises}
                                onChange={e => setFormState({ ...formState, exercises: e.target.value })}
                                placeholder={`1. Flat Bench Press - 3 sets x 8-10 reps\n2. Incline Dumbbell Press - 3 sets x 10-12 reps...`}
                            />
                        </div>

                        <div className="flex justify-end items-center gap-4">
                            {msg && <span className="text-green-500 text-sm flex items-center gap-1"><Check size={14} /> {msg}</span>}
                            <button
                                onClick={handleSaveProtocol}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-500 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Save size={18} /> {isSaving ? 'Saving...' : 'Save Protocol'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 3: DATA (The Developer Feature) --- */}
            {activeTab === 'data' && (
                <div className="grid gap-6 max-w-2xl animate-in fade-in">
                    <SettingCard title="Export Database">
                        <p className="text-sm text-zinc-500 mb-4">Download a JSON dump of all your habits, workouts, and journals.</p>
                        <button className="flex items-center gap-2 px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 text-zinc-300 transition-colors">
                            <Download size={16} /> Export JSON
                        </button>
                    </SettingCard>

                    <SettingCard title="Danger Zone">
                        <p className="text-sm text-zinc-500 mb-4">Irreversible action. Wipes all data from your local instance.</p>
                        <button className="flex items-center gap-2 px-4 py-2 border border-red-900/50 text-red-500 bg-red-900/10 rounded hover:bg-red-900/20 transition-colors">
                            <Trash2 size={16} /> Factory Reset System
                        </button>
                    </SettingCard>
                </div>
            )}

        </div>
    );
}
