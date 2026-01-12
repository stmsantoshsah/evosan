'use client';

import { useState } from 'react';
import { Send, History } from 'lucide-react';
import { useSavePatientNoteMutation } from '../slices/patientApiSlice';
import NoteCard from './NoteCard';

interface ClinicalNotesFormProps {
    patientId: string;
}

export default function ClinicalNotesForm({ patientId }: ClinicalNotesFormProps) {
    const [note, setNote] = useState('');
    const [saveNote, { isLoading }] = useSavePatientNoteMutation();

    const handleSave = async () => {
        if (!note.trim()) return;
        try {
            await saveNote({ patientId, content: note }).unwrap();
            setNote('');
        } catch (err) {
            console.error('Failed to save clinical note:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* --- INPUT --- */}
            <div className="relative">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Document clinical findings, treatment adjustments, or observed symptoms..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 min-h-[120px] focus:border-cyan-500 outline-none transition-all resize-none"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSave}
                    disabled={isLoading || !note.trim()}
                    className="absolute right-3 bottom-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 text-white p-2 rounded-md transition-all"
                >
                    <Send size={18} />
                </button>
            </div>

            {/* --- HISTORY --- */}
            <div className="space-y-4">
                <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <History size={14} />
                    Audit Trail
                </h4>

                <div className="space-y-3">
                    {/* Placeholder for real notes from the API if we had them in a list */}
                    <NoteCard
                        content="Adjusted Lisinopril dosage to 20mg daily. Patient reported minor dry cough."
                        date="2026-01-10T14:30:00Z"
                    />
                    <NoteCard
                        content="Initial assessment: Patient presents with persistent headache and slight blurred vision."
                        date="2026-01-05T09:15:00Z"
                    />
                </div>
            </div>
        </div>
    );
}
