import React, { useState } from 'react';
import { FileText, Search, Plus, Loader2 } from 'lucide-react';
import { useGetArchivesQuery, useAddArchiveMutation } from '../slices/operationsApiSlice';

export const DataBank = () => {
    const { data: response, isLoading } = useGetArchivesQuery(undefined);
    const [addArchive] = useAddArchiveMutation();

    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });

    const archives = response?.data || [];

    // Filter Logic
    const filteredArchives = archives.filter((note: any) => {
        const query = searchQuery.toLowerCase();
        return (
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags?.some((tag: string) => tag.toLowerCase().includes(query))
        );
    });

    const handleSaveNote = async () => {
        if (!newNote.title.trim()) return;
        try {
            await addArchive({
                ...newNote,
                tags: newNote.tags.split(',').map(t => t.trim()).filter(Boolean)
            }).unwrap();
            setIsCreating(false);
            setNewNote({ title: '', content: '', tags: '' });
        } catch (error) {
            console.error('Failed to save note', error);
        }
    };

    return (
        <div className="flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center bg-black/40 gap-4 md:gap-0">
                <div className="flex items-center gap-2 text-purple-400 font-mono font-bold tracking-wider w-full md:w-auto">
                    <FileText size={16} /> DATA BANK
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-2 top-1.5 text-zinc-600" size={14} />
                        <input
                            placeholder="Query archives..."
                            className="bg-black border border-zinc-800 rounded pl-8 pr-2 py-1 text-xs w-full md:w-48 text-zinc-300 focus:border-purple-500/50 outline-none transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-purple-600/20 text-purple-400 border border-purple-600/50 px-3 py-1 rounded text-xs hover:bg-purple-600/30 transition-colors whitespace-nowrap"
                    >
                        + Create Entry
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-black/20">
                {isCreating ? (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 animate-in fade-in zoom-in-95">
                        <input
                            className="bg-transparent text-lg font-bold text-white w-full mb-4 outline-none placeholder:text-zinc-700"
                            placeholder="Title..."
                            value={newNote.title}
                            onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                            autoFocus
                        />
                        <textarea
                            className="bg-transparent text-sm text-zinc-300 w-full h-48 outline-none resize-none font-mono placeholder:text-zinc-800"
                            placeholder="Enter data..."
                            value={newNote.content}
                            onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                        />
                        <input
                            className="bg-zinc-900/50 border border-zinc-800 rounded px-3 py-2 text-xs text-white w-full mb-4 outline-none"
                            placeholder="Tags (comma separated)..."
                            value={newNote.tags}
                            onChange={e => setNewNote({ ...newNote, tags: e.target.value })}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-zinc-500 hover:text-white text-xs">Cancel</button>
                            <button onClick={handleSaveNote} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold">Save to Memory</button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoading ? (
                            <div className="col-span-full flex justify-center py-12"><Loader2 className="animate-spin text-purple-500" /></div>
                        ) : filteredArchives.length === 0 ? (
                            <div className="col-span-full text-center text-zinc-700 font-mono py-12">
                                {searchQuery ? 'NO MATCHING RECORDS' : 'ARCHIVES EMPTY'}
                            </div>
                        ) : (
                            filteredArchives.map((note: any) => (
                                <NoteCard key={note._id} note={note} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const NoteCard = ({ note }: { note: any }) => (
    <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg hover:border-purple-500/30 transition-all cursor-pointer group hover:bg-zinc-900/60 h-48 flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-zinc-300 group-hover:text-purple-300 transition-colors text-sm line-clamp-1">{note.title}</h4>
                <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">
                    {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-4 font-mono leading-relaxed">
                {note.content}
            </p>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
            {note.tags?.map((tag: string, i: number) => (
                <span key={i} className="text-[9px] px-1.5 py-0.5 bg-zinc-950 rounded border border-zinc-800 text-zinc-500 group-hover:border-purple-900/50 group-hover:text-purple-400/70 transition-colors">
                    #{tag}
                </span>
            ))}
        </div>
    </div>
);
