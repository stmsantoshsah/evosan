import React from 'react';

type MuscleStatus = 'ready' | 'recovering' | 'sore';

interface MuscleGroupProps {
    name: string;
    status: number; // 0-100
    lastTrained: string;
}

const MuscleGroup = ({ name, status, lastTrained }: MuscleGroupProps) => {
    // Status: 0-100. 
    // < 50 = Red (Sore), 50-80 = Yellow (Recovering), > 80 = Teal (Ready)

    let color = "bg-teal-500";
    let statusText = "SYSTEM READY";

    if (status < 50) {
        color = "bg-red-500";
        statusText = "CRITICAL REPAIR";
    } else if (status < 80) {
        color = "bg-yellow-500";
        statusText = "OPTIMIZING...";
    }

    return (
        <div className="mb-4">
            <div className="flex justify-between text-xs font-mono mb-1 text-gray-400">
                <span className="uppercase">{name}</span>
                <span>{lastTrained}</span>
            </div>

            {/* The Progress Bar Container */}
            <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                <div
                    className={`h-full ${color} transition-all duration-1000 ease-out`}
                    style={{ width: `${status}%` }}
                />
            </div>

            {/* Status Text */}
            <div className="text-[10px] text-right mt-1 text-gray-500 font-mono">
                {statusText}
            </div>
        </div>
    );
};

import { calculateRecoveryStatus } from '../utils/muscleMap';

export const MuscleMatrix = () => {
    // In a real app, these dates would come from the backend based on the last time 
    // a workout with these muscle tags was logged.
    // Simulating "Chest" being critical (today) and others recovering.

    // Mock Last Trained Dates
    const lastTrained = {
        CHEST_ACTUATORS: new Date().toISOString(), // Just trained -> 0%
        DORSAL_STABILIZERS: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago -> ~75%
        LOWER_LOCOMOTION: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago -> 100%
        CORE_SYSTEMS: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago -> 25%
    };

    const getStatus = (dateStr: string) => Math.floor(calculateRecoveryStatus(dateStr));

    // Helper to format "Ago"
    const formatTimeAgo = (dateStr: string) => {
        const diffHours = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
        if (diffHours < 1) return 'Just Now';
        if (diffHours < 24) return `${Math.floor(diffHours)}h Ago`;
        const days = Math.floor(diffHours / 24);
        return `${days} Day${days > 1 ? 's' : ''} Ago`;
    };

    return (
        <div className="bg-black/40 border border-gray-800 p-6 rounded-xl h-full">
            <h3 className="text-gray-200 font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                HARDWARE STATUS
            </h3>

            <div className="space-y-4">
                <MuscleGroup
                    name="CHEST_ACTUATORS"
                    status={getStatus(lastTrained.CHEST_ACTUATORS)}
                    lastTrained={formatTimeAgo(lastTrained.CHEST_ACTUATORS)}
                />
                <MuscleGroup
                    name="DORSAL_STABILIZERS"
                    status={getStatus(lastTrained.DORSAL_STABILIZERS)}
                    lastTrained={formatTimeAgo(lastTrained.DORSAL_STABILIZERS)}
                />
                <MuscleGroup
                    name="LOWER_LOCOMOTION"
                    status={getStatus(lastTrained.LOWER_LOCOMOTION)}
                    lastTrained={formatTimeAgo(lastTrained.LOWER_LOCOMOTION)}
                />
                <MuscleGroup
                    name="CORE_SYSTEMS"
                    status={getStatus(lastTrained.CORE_SYSTEMS)}
                    lastTrained={formatTimeAgo(lastTrained.CORE_SYSTEMS)}
                />
            </div>
        </div>
    );
};
