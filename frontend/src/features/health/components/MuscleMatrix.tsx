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

export const MuscleMatrix = () => {
    return (
        <div className="bg-black/40 border border-gray-800 p-6 rounded-xl h-full">
            <h3 className="text-gray-200 font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                HARDWARE STATUS
            </h3>

            <div className="space-y-4">
                <MuscleGroup name="CHEST_ACTUATORS" status={30} lastTrained="Yesterday" />
                <MuscleGroup name="DORSAL_STABILIZERS" status={90} lastTrained="3 Days ago" />
                <MuscleGroup name="LOWER_LOCOMOTION" status={100} lastTrained="5 Days ago" />
                <MuscleGroup name="CORE_SYSTEMS" status={60} lastTrained="Today" />
            </div>
        </div>
    );
};
