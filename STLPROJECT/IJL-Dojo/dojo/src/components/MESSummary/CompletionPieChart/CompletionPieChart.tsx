import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom'; // make sure you're using react-router

interface CompletionPieChartProps {
  mode: 'CO' | 'PROD' | 'SAM';
  selectedTab: 'OEE' | 'Waste' | 'Downtime';
  startDate: string;
  endDate: string;
  workCenter: string;
}

const COLORS = ['#38A169', '#ECC94B', '#E53E3E'];

const renderLabel = ({ percent }: any) =>
  `${(percent * 100).toFixed(0)}%`;

const CompletionPieChart: React.FC<CompletionPieChartProps> = ({
  mode,
  selectedTab,
  startDate,
  endDate,
  workCenter,
}) => {
  const [data, setData] = useState([
    { name: 'Completed', value: 0 },
    { name: 'In Progress', value: 0 },
    { name: 'Not Completed', value: 0 },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const completed = Math.floor(Math.random() * 40) + 30;
    const inProgress = Math.floor(Math.random() * (100 - completed));
    const notCompleted = 100 - completed - inProgress;

    setData([
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Not Completed', value: notCompleted },
    ]);
  }, [mode, selectedTab, startDate, endDate, workCenter]);

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full h-72 bg-white border border-gray-200 shadow rounded p-3 flex flex-col">
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-lg font-semibold">Work Order Status</h2>
    <button
      onClick={() => navigate('/details')}
      className="text-blue-600 hover:underline text-xs"
    >
      View More →
    </button>
  </div>

  <div className="flex flex-row h-full">
    {/* Pie Chart */}
    <div className="w-2/3 h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            labelLine={false}
            label={renderLabel}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Legend */}
    <div className="w-1/3 flex flex-col justify-center items-start pl-3 text-xs">
      {data.map((entry, index) => {
        const percent = total > 0 ? ((entry.value / total) * 100).toFixed(0) : '0';
        return (
          <div key={index} className="mb-2">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
              <div className="font-medium">{entry.name}</div>
            </div>
            <div className="text-gray-500 ml-4">({percent}%)</div>
          </div>
        );
      })}
    </div>
  </div>
</div>

  );
};

export default CompletionPieChart;
