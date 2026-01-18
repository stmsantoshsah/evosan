'use client';

import { MissionQueue } from './MissionQueue';
import { DataBank } from './DataBank';

export default function Operations() {
    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] gap-6 p-4 md:p-6 overflow-hidden">
            {/* --- TOP BAR: FOCUS MODE --- */}
            <div className="flex justify-end">
                <a href="/focus" className="bg-teal-600 hover:bg-teal-500 text-black font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-teal-900/50">
                    ⚡ ENTER FOCUS MODE
                </a>
            </div>

            <div className="flex flex-col md:flex-row flex-1 gap-6 overflow-hidden">
                {/* --- LEFT PANEL: MISSION QUEUE (TASKS) --- */}
                <div className="w-full md:w-1/3 h-1/2 md:h-full">
                    <MissionQueue />
                </div>

                {/* --- RIGHT PANEL: DATA BANK (NOTES) --- */}
                <div className="w-full md:w-2/3 h-1/2 md:h-full">
                    <DataBank />
                </div>
            </div>
        </div>
    );
}
