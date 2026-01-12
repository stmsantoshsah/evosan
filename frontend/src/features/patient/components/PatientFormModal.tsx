'use client';

import { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { useCreatePatientMutation } from '../slices/patientApiSlice';

interface PatientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PatientFormModal({ isOpen, onClose }: PatientFormModalProps) {
    const [name, setName] = useState('');
    const [age, setAge] = useState<number>(0);
    const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [createPatient, { isLoading }] = useCreatePatientMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPatient({ name, age, gender, email, phone }).unwrap();
            onClose();
            // Reset form
            setName('');
            setAge(0);
            setGender('MALE');
            setEmail('');
            setPhone('');
        } catch (err) {
            console.error('Failed to create patient:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* --- HEADER --- */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-600/20 rounded-lg text-cyan-500">
                            <UserPlus size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Create New Record</h2>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* --- BODY --- */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-cyan-500 outline-none transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Age</label>
                            <input
                                type="number"
                                value={age || ''}
                                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-cyan-500 outline-none transition-all"
                                placeholder="30"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as any)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-cyan-500 outline-none transition-all"
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email (Optional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-cyan-500 outline-none transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Phone (Optional)</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:border-cyan-500 outline-none transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 font-bold transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 text-white rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                            {isLoading ? 'Processing...' : 'Register Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
