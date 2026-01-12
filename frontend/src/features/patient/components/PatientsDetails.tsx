'use client';

import { Activity, Clock, FileText, User } from 'lucide-react';
import { useGetPatientDetailsQuery } from '../slices/patientApiSlice';
import ClinicalNotesForm from './ClinicalNotesForm';
import CaseSummaryCard from './CaseSummaryCard';

interface PatientsDetailsProps {
    patientId: string;
}

export default function PatientsDetails({ patientId }: PatientsDetailsProps) {
    const { data: patient, isLoading, isError } = useGetPatientDetailsQuery(patientId);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
                <Clock className="animate-spin mr-2" size={20} />
                Accessing clinical database...
            </div>
        );
    }

    if (isError || !patient) {
        return (
            <div className="flex-1 flex items-center justify-center text-rose-500">
                Failed to retrieve patient metadata.
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-black p-6 space-y-8">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
                        <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                            <span className="font-mono text-cyan-500">#{patient.id.substring(0, 8)}</span>
                            <span>•</span>
                            <span>{patient.age} years</span>
                            <span>•</span>
                            <span>{patient.gender}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 rounded-md text-zinc-400 transition-colors text-sm">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-white transition-colors text-sm">
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* --- GRID LAYOUT --- */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Summary & Stats */}
                <div className="xl:col-span-1 space-y-6">
                    <CaseSummaryCard patient={patient} />

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Activity size={14} className="text-cyan-500" />
                            Vitals Overview
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Last BP</span>
                                <span className="text-zinc-200">120/80 mmHg</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">SpO2</span>
                                <span className="text-zinc-200">98%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Pulse</span>
                                <span className="text-zinc-200">72 bpm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Clinical Notes */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <FileText size={20} className="text-emerald-500" />
                            Clinical Documentation
                        </h3>

                        <ClinicalNotesForm patientId={patient.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
