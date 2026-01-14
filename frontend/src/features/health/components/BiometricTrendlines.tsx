'use client';

import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    ResponsiveContainer,
    YAxis
} from 'recharts';

interface TrendProps {
    title: string;
    value: string;
    subValue: string;
    trend: 'up' | 'down' | 'neutral';
    data: any[];
    dataKey: string;
    type: 'line' | 'bar';
    color: string;
}

const TrendCard = ({ title, value, subValue, trend, data, dataKey, type, color }: TrendProps) => {
    const isUp = trend === 'up';
    const isDown = trend === 'down';

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start mb-2">
                <div>
                    <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{title}</h4>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-white">{value}</span>
                        <span className={`text-xs mb-1 font-mono ${isDown ? 'text-green-500' : isUp ? 'text-red-500' : 'text-zinc-500'
                            }`}>
                            {subValue}
                        </span>
                    </div>
                </div>
            </div>

            <div className="h-16 w-full opacity-50 group-hover:opacity-80 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'line' ? (
                        <LineChart data={data}>
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={true}
                            />
                        </LineChart>
                    ) : (
                        <BarChart data={data}>
                            <Bar
                                dataKey={dataKey}
                                fill={color}
                                radius={[2, 2, 0, 0]}
                                isAnimationActive={true}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const BiometricTrendlines = () => {
    // Mock Data
    const weightData = [
        { val: 76.0 }, { val: 75.8 }, { val: 75.9 }, { val: 75.6 }, { val: 75.5 }, { val: 75.4 }, { val: 75.4 }
    ];

    const sleepData = [
        { val: 6.5 }, { val: 7.2 }, { val: 5.8 }, { val: 6.9 }, { val: 7.5 }, { val: 8.0 }, { val: 6.7 }
    ];

    const calorieData = [
        { val: 2400 }, { val: 2350 }, { val: 2600 }, { val: 2200 }, { val: 2100 }, { val: 2500 }, { val: 2300 }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TrendCard
                title="Total Body Mass"
                value="75.4 kg"
                subValue="↘ -0.6kg"
                trend="down"
                data={weightData}
                dataKey="val"
                type="line"
                color="#3b82f6" // blue
            />
            <TrendCard
                title="Sleep Efficiency"
                value="6h 42m"
                subValue="Avg"
                trend="neutral"
                data={sleepData}
                dataKey="val"
                type="bar"
                color="#8b5cf6" // violet
            />
            <TrendCard
                title="Net Calories"
                value="2,300"
                subValue="In vs Out"
                trend="neutral"
                data={calorieData}
                dataKey="val"
                type="line"
                color="#f97316" // orange
            />
        </div>
    );
};
