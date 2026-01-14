'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface FuelGaugeProps {
    calories: number;
    protein: number;
    carbs?: number; // Optional as we might only have protein from logs
    fats?: number;  // Optional as we might only have protein from logs
}

export const FuelGauge = ({ calories, protein, carbs = 250, fats = 80 }: FuelGaugeProps) => {
    // Determine macro split based on calories if not fully provided
    // 1g Protein = 4 cal, 1g Carb = 4 cal, 1g Fat = 9 cal
    // Use defaults/estimates if only protein is known

    const proteinCals = protein * 4;
    // Remainder estimation for visualization if direct data missing
    const unaccounted = Math.max(0, calories - proteinCals);
    const estimatedCarbs = Math.floor(unaccounted * 0.6 / 4); // Assume 60% of remainder is carbs
    const estimatedFats = Math.floor(unaccounted * 0.4 / 9);  // Assume 40% of remainder is fats

    const data = [
        { name: 'Protein', value: protein, color: '#22c55e' }, // Green
        { name: 'Carbs', value: carbs > 0 ? carbs : estimatedCarbs, color: '#eab308' },    // Yellow
        { name: 'Fats', value: fats > 0 ? fats : estimatedFats, color: '#3b82f6' },      // Blue
    ];

    return (
        <div className="h-full flex flex-col justify-center items-center relative">
            <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#e4e4e7', fontSize: '12px', fontFamily: 'monospace' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">{calories}</span>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider">KCAL INPUT</span>
                </div>
            </div>

            <div className="flex gap-4 mt-2">
                {data.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <div className="text-xs text-zinc-400 font-mono">
                            {entry.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
