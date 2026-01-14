import React, { useState } from 'react';
import { Calendar, CheckCircle, Circle, Plus, Loader2 } from 'lucide-react';
import { useGetMissionsQuery, useAddMissionMutation, useUpdateMissionMutation } from '../slices/operationsApiSlice';

export const MissionQueue = () => {
    const { data: response, isLoading } = useGetMissionsQuery(undefined);
    const [addMission] = useAddMissionMutation();
    const [updateMission] = useUpdateMissionMutation();

    const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'backlog'>('today');
    const [newTask, setNewTask] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const missions = response?.data || [];

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        // Determine due date based on tab
        const date = new Date();
        if (activeTab === 'tomorrow') date.setDate(date.getDate() + 1);
        // backlog defaults to today or null, keeping simple for now

        try {
            await addMission({
                title: newTask,
                dueDate: date.toISOString().split('T')[0],
                priority: 'Normal'
            }).unwrap();
            setNewTask('');
            setIsAdding(false);
        } catch (error) {
            console.error('Failed to add task', error);
        }
    };

    const toggleTask = async (id: string, currentStatus: boolean) => {
        try {
            await updateMission({ id, isCompleted: !currentStatus }).unwrap();
        } catch (error) {
            console.error('Failed to toggle task', error);
        }
    };

    // Filter logic (Simplified)
    const todayStr = new Date().toISOString().split('T')[0];
    // This is a basic filter; in production, use date-fns for robust comparison
    const filteredMissions = missions.filter((m: any) => {
        if (activeTab === 'backlog') return !m.isCompleted && m.dueDate < todayStr;
        if (activeTab === 'tomorrow') return m.dueDate > todayStr;
        return m.dueDate === todayStr || (activeTab === 'today' && !m.dueDate);
    });

    return (
        <div className="flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-2 text-teal-400 font-mono font-bold tracking-wider">
                    <Calendar size={16} /> MISSION QUEUE
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-xs bg-teal-900/30 text-teal-400 px-2 py-1 rounded border border-teal-500/30 hover:bg-teal-900/50 transition-colors"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex text-xs border-b border-zinc-800 font-mono">
                {['today', 'tomorrow', 'backlog'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-3 transition-colors uppercase ${activeTab === tab
                                ? 'bg-zinc-800 text-teal-400 border-b-2 border-teal-500'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            {isAdding && (
                <form onSubmit={handleAddTask} className="p-3 border-b border-zinc-800 bg-zinc-950/50">
                    <input
                        autoFocus
                        type="text"
                        placeholder="New directive..."
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600 font-mono"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onBlur={() => !newTask && setIsAdding(false)}
                    />
                </form>
            )}

            {/* List */}
            <div className="flex-1 p-2 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {isLoading ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-teal-500" /></div>
                ) : filteredMissions.length === 0 ? (
                    <div className="text-center text-zinc-600 text-xs py-8 font-mono">NO ACTIVE MISSIONS</div>
                ) : (
                    filteredMissions.map((task: any) => (
                        <div
                            key={task._id}
                            onClick={() => toggleTask(task._id, task.isCompleted)}
                            className={`flex items-start gap-3 p-3 rounded border transition-all cursor-pointer group select-none ${task.isCompleted
                                    ? 'bg-teal-900/5 border-teal-900/30 opacity-60'
                                    : 'bg-black/40 border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/60'
                                }`}
                        >
                            <div className="mt-0.5">
                                {task.isCompleted
                                    ? <CheckCircle size={16} className="text-teal-500" />
                                    : <Circle size={16} className="text-zinc-600 group-hover:text-teal-500/50 transition-colors" />
                                }
                            </div>
                            <span className={`text-sm font-light ${task.isCompleted ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                                {task.title}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
