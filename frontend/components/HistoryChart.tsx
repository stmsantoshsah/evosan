// frontend/components/HistoryChart.tsx
'use client';

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DataPoint {
  date: string;
  mood: number;
  habits: number;
}

export default function HistoryChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) return <div className="text-zinc-500 text-sm">No data available</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid stroke="#27272a" vertical={false} />
          
          <XAxis 
            dataKey="date" 
            stroke="#71717a" 
            tick={{fontSize: 12}} 
            axisLine={false}
            tickLine={false}
          />
          
          {/* Left Axis: Habits (Bars) */}
          <YAxis 
            yAxisId="left"
            stroke="#71717a" 
            tick={{fontSize: 12}} 
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          {/* Right Axis: Mood (Line) */}
          <YAxis 
            yAxisId="right"
            orientation="right" 
            domain={[0, 10]} 
            hide 
          />

          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
            itemStyle={{ fontSize: '12px' }}
          />

          {/* The Bars (Habits) */}
          <Bar 
            yAxisId="left"
            dataKey="habits" 
            name="Habits Completed"
            fill="url(#colorHabits)" 
            barSize={20} 
            radius={[4, 4, 0, 0]} 
          />

          {/* The Line (Mood) */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="mood" 
            name="Mood Level"
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#18181b', strokeWidth: 2 }} 
            activeDot={{ r: 6 }} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}