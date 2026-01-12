'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HistoryChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-zinc-600 bg-zinc-900/50 rounded-lg">
                Not enough data yet
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#52525b"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#52525b"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 'auto']}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#e4e4e7' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="habits_completed"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#22d3ee' }}
                    />
                    {/* You can add a second line for Mood if you want */}
                    <Line
                        type="monotone"
                        dataKey="mood_score"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#34d399' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
