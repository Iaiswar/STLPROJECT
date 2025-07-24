import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from 'recharts';

interface AbsenteeData {
  month: string;
  absentee_trend_ctq: number;
}

interface Props {
  factoryId: number | null;
  departmentId: number | null;
}

const AbsenteeTrendChart: React.FC<Props> = ({ factoryId, departmentId }) => {
  const [data, setData] = useState<AbsenteeData[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(560);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('absentee-chart-container');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!factoryId || !departmentId) return;

    const url = `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${factoryId}&department_id=${departmentId}`;
    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((json) => {
        const trend = json.absentee_trend || [];
        setData(trend);
      })
      .catch((err) => {
        console.error('Error fetching absentee data:', err);
      });
  }, [factoryId, departmentId]);

  const formatMonth = (value: string) => {
    if (containerWidth < 400) {
      return value.split(' ')[0].substring(0, 3);
    }
    return value.split(' ')[0];
  };

  const CustomLegend = () => (
    <div className="text-xs sm:text-sm text-gray-600 text-center mt-3">
      <span className="inline-flex items-center gap-1 sm:gap-2">
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#007bff]" />
        Absenteeism Rate Trend
      </span>
    </div>
  );

  const labelFontSize = containerWidth < 500 ? 10 : 12;
  const tickFontSize = containerWidth < 500 ? 10 : 12;

  return (
    <div 
      id="absentee-chart-container"
      className="relative w-full h-[350px] bg-white rounded-lg shadow-lg p-4"
      style={{ minWidth: '300px' }}
    >
      <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">
        Absenteeism Rate Trend
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart 
          data={data} 
          margin={{ 
            top: 20, 
            right: containerWidth < 500 ? 5 : 10, 
            left: 0, 
            bottom: 5 
          }}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: tickFontSize }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatMonth}
          />
          <YAxis
            tick={false}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 5', 'dataMax + 10']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={40} 
            content={<CustomLegend />} 
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Absentee Rate']}
            contentStyle={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: labelFontSize,
            }}
          />
          <Area
            type="linear"
            dataKey="absentee_trend_ctq"
            stroke="#007bff"
            strokeWidth={2}
            fill="rgba(0, 123, 255, 0.4)"
            fillOpacity={1}
            dot={{
              stroke: '#007bff',
              strokeWidth: 1,
              fill: '#fff',
              r: containerWidth < 500 ? 3 : 4
            }}
            activeDot={{
              r: containerWidth < 500 ? 5 : 6,
              stroke: '#007bff',
              strokeWidth: 2
            }}
          >
            <LabelList
              dataKey="absentee_trend_ctq"
              position="top"
              fontSize={labelFontSize}
              fill="#333"
              offset={5}
              formatter={(value: number) => value ? `${value}%` : ''}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AbsenteeTrendChart;