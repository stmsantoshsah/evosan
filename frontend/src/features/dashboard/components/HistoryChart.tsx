'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function HistoryChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-600 bg-zinc-900/50 rounded-lg">
        Not enough data yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full" style={{ width: '100%', height: 250, minHeight: 250 }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            vertical={false}
            opacity={0.1}
          />
          <XAxis
            dataKey="date"
            stroke="currentColor"
            tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="currentColor"
            tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            itemStyle={{ color: 'var(--foreground)', fontWeight: 500, fontSize: '12px' }}
            labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px', fontSize: '11px' }}
          />
          <Area
            type="monotone"
            dataKey="habits"
            stroke="#06b6d4"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorHabits)"
            activeDot={{ r: 6, fill: '#22d3ee', stroke: '#083344', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorMood)"
            activeDot={{ r: 6, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
