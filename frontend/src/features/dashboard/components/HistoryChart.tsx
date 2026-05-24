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
  const isPlaceholder = !data || data.length === 0;
  const chartData = isPlaceholder
    ? [
        { date: 'Mon', habits: 2, mood: 6 },
        { date: 'Tue', habits: 4, mood: 7 },
        { date: 'Wed', habits: 3, mood: 5 },
        { date: 'Thu', habits: 5, mood: 8 },
        { date: 'Fri', habits: 4, mood: 7 },
        { date: 'Sat', habits: 6, mood: 8 },
        { date: 'Sun', habits: 5, mood: 9 },
      ]
    : data;

  return (
    <div className="h-64 w-full relative group/chart" style={{ width: '100%', height: 250, minHeight: 250 }}>
      {isPlaceholder && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4 z-20 rounded-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-500 font-mono uppercase tracking-widest">
              Neural Stream Calibrating
            </span>
          </div>
          <p className="text-xs font-bold text-foreground font-mono max-w-xs leading-normal">
            Calibrating Performance Trend
          </p>
          <p className="text-[10px] text-muted-foreground max-w-xs mt-1 leading-relaxed font-mono">
            Logs required to complete baseline performance trend: 3/5
          </p>
        </div>
      )}
      <div className={`w-full h-full transition-all duration-500 ${isPlaceholder ? 'opacity-30 blur-[0.5px] select-none pointer-events-none' : ''}`}>
        <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
    </div>
  );
}
