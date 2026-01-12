'use client';

export default function NoteCard({ content, date }: { content: string, date: string }) {
    return (
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
            <div className="flex justify-between mb-2">
                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">
                    Physician Record
                </span>
                <span className="text-[10px] text-zinc-600">
                    {new Date(date).toLocaleString()}
                </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed italic">
                "{content}"
            </p>
        </div>
    );
}
