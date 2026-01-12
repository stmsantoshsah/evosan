'use client';

import { Users } from 'lucide-react';

export default function EmptyDetailsPlaceholder() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 bg-zinc-950/20">
            <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                <Users size={48} className="text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-zinc-400">No Patient Selected</h3>
            <p className="max-w-xs text-center mt-2 text-sm">
                Select a patient from the directory to view clinical history and diagnostics.
            </p>
        </div>
    );
}
