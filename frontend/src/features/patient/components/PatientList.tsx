'use client';

import { Search, UserPlus } from 'lucide-react';
import { useGetPatientsQuery } from '../slices/patientApiSlice';

interface PatientListProps {
    onSelectPatient: (id: string) => void;
    onOpenCreateModal: () => void;
    selectedId?: string;
}

export default function PatientList({ onSelectPatient, onOpenCreateModal, selectedId }: PatientListProps) {
    const { data: patients = [], isLoading } = useGetPatientsQuery();

    if (isLoading) {
        return <div className="p-4 text-zinc-500">Scanning patient directory...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-zinc-900/30 border-r border-zinc-800">
            {/* --- HEADER --- */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Patients</h2>
                <button
                    onClick={onOpenCreateModal}
                    className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white transition-colors"
                >
                    <UserPlus size={18} />
                </button>
            </div>

            {/* --- SEARCH --- */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search IDs, Names..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 pl-10 pr-4 text-sm focus:border-cyan-500 outline-none transition-colors text-white"
                    />
                </div>
            </div>

            {/* --- LIST --- */}
            <div className="flex-1 overflow-y-auto">
                {patients.map((patient) => (
                    <div
                        key={patient.id}
                        onClick={() => onSelectPatient(patient.id)}
                        className={`
                            p-4 cursor-pointer border-b border-zinc-800/50 transition-all
                            ${selectedId === patient.id ? 'bg-cyan-900/20 border-l-2 border-l-cyan-500' : 'hover:bg-zinc-800/50'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-semibold text-zinc-200">{patient.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">#{patient.id.substring(0, 6)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>{patient.age}y</span>
                            <span>•</span>
                            <span>{patient.gender}</span>
                            <span className="ml-auto text-zinc-600">
                                {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'New'}
                            </span>
                        </div>
                    </div>
                ))}

                {patients.length === 0 && (
                    <div className="p-8 text-center text-zinc-600 italic text-sm">
                        No active records found.
                    </div>
                )}
            </div>
        </div>
    );
}
