'use client';

import { ShieldAlert } from 'lucide-react';
import { Patient } from '../types/patientTypes';

interface CaseSummaryCardProps {
    patient: Patient;
}

export default function CaseSummaryCard({ patient }: CaseSummaryCardProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-rose-500/10 border-b border-rose-500/20 p-4 flex items-center gap-3">
                <ShieldAlert className="text-rose-500" size={20} />
                <span className="text-sm font-bold text-rose-200">Critical Summary</span>
            </div>
            <div className="p-5">
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    Patient presents with chronic hypertension and associated visual disturbances.
                    Monitor for potential cardiovascular complications. Latest lab results show
                    elevated serum creatinine levels.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                    <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Primary Dx</span>
                        <span className="text-xs text-zinc-300 font-medium">Hypertension (I10)</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Status</span>
                        <span className="text-xs text-emerald-500 font-medium">Monitoring</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
