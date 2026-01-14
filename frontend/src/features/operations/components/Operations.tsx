'use client';

import { MissionQueue } from './MissionQueue';
import { DataBank } from './DataBank';

export default function Operations() {
    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] gap-6 p-4 md:p-6 overflow-hidden">
            {/* --- LEFT PANEL: MISSION QUEUE (TASKS) --- */}
            <div className="w-full md:w-1/3 h-1/2 md:h-full">
                <MissionQueue />
            </div>

            {/* --- RIGHT PANEL: DATA BANK (NOTES) --- */}
            <div className="w-full md:w-2/3 h-1/2 md:h-full">
                <DataBank />
            </div>
        </div>
    );
}
