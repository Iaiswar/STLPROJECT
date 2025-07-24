import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface StandardBarChartProps {
  title?: string;
  color?: string;
  mode: 'CO' | 'PROD' | 'SAM';
  selectedTab: 'OEE' | 'Waste' | 'Downtime';
  startDate: string;
  endDate: string;
  workCenter: string;
}

export default function StandardBarChart({
  title = 'Standard Bar Chart',
  color = '#4299e1',
  mode,
  selectedTab,
  startDate,
  endDate,
  workCenter,
}: StandardBarChartProps) {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    console.log(`Generating chart data for ${workCenter} from ${startDate} to ${endDate}`);
    const categories = ['BR', 'EU', 'ID', 'US', 'NW', 'CN'];
    const shuffled = categories.sort(() => Math.random() - 0.5);
    const randoms = shuffled.map(() => Math.random());
    const total = randoms.reduce((a, b) => a + b, 0);
    setData(
      shuffled.map((cat, i) => ({
        name: cat,
        value: parseFloat(((randoms[i] / total) * 100).toFixed(1)),
      }))
    );
  }, [mode, selectedTab, startDate, endDate, workCenter]);

  return (
    <div className="w-full h-96 p-4 bg-white border border-gray-200 rounded shadow-md">
      <h2 className="text-lg font-bold mb-3 text-gray-800">{title}</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 15, right: 15, left: 15, bottom: 35 }}>
          <CartesianGrid horizontal strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 14, fill: '#4A5568' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 14, fill: '#4A5568' }}
          />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: '#fff',
              fontSize: '14px',
              borderRadius: '6px',
            }}
          />
          <Bar dataKey="value" fill={color} name="Percentage" barSize={30}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v: number) => `${v}%`}
              style={{ fontSize: '14px', fill: '#2D3748' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
