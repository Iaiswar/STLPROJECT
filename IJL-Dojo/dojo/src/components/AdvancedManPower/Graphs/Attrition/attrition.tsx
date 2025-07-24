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

interface AttritionData {
  month: string;
  attrition_trend_ctq: number;
}

interface Props {
  factoryId: number | null;
  departmentId: number | null;
}

const AttritionTrendChart: React.FC<Props> = ({ factoryId, departmentId }) => {
  const [data, setData] = useState<AttritionData[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(560); // Default width

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('attrition-chart-container');
      if (container) {
        setContainerWidth(container.clientWidth);
      }
    };

    handleResize(); // Set initial width
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
        const trend = json.attrition_trend || [];
        const cleaned = trend.filter((item: AttritionData) =>
          item.month && typeof item.attrition_trend_ctq === 'number' && !isNaN(item.attrition_trend_ctq)
        );
        setData(cleaned);
      })
      .catch((err) => {
        console.error('Error fetching attrition data:', err);
      });
  }, [factoryId, departmentId]);

  const formatMonth = (value: string) => {
    // On small screens, show only first 3 letters of month
    if (containerWidth < 400) {
      return value.split(' ')[0].substring(0, 3);
    }
    return value.split(' ')[0];
  };

  const CustomLegend = () => (
    <div className="text-sm text-gray-600 text-center mt-3">
      <span className="inline-flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#007bff]" />
        Attrition Rate
      </span>
    </div>
  );

  // Adjust font sizes based on container width
  const labelFontSize = containerWidth < 500 ? 10 : 12;
  const tickFontSize = containerWidth < 500 ? 10 : 12;

  return (
    <div 
      id="attrition-chart-container"
      className="relative w-full h-[350px] bg-white rounded-lg shadow-lg p-4"
      style={{ minWidth: '300px' }} // Minimum width to prevent squishing
    >
      <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">
        Attrition Rate Trend
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{ 
            top: 20, 
            right: containerWidth < 500 ? 5 : 10, 
            left: 0, 
            bottom: 0 
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
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Attrition Rate']}
            contentStyle={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: labelFontSize,
            }}
          />
          <Legend verticalAlign="bottom" height={36} content={<CustomLegend />} />

          <Area
            type="monotone"
            dataKey="attrition_trend_ctq"
            stroke="#007bff"
            strokeWidth={2}
            fill="rgba(0, 123, 255, 0.4)"
            dot={{ 
              stroke: '#007bff', 
              strokeWidth: 2, 
              fill: '#fff', 
              r: containerWidth < 500 ? 3 : 4 
            }}
            activeDot={{ r: containerWidth < 500 ? 4 : 6, stroke: '#007bff', strokeWidth: 2 }}
          >
            <LabelList
              dataKey="attrition_trend_ctq"
              position="top"
              fontSize={labelFontSize}
              fill="#333"
              offset={5}
              formatter={(value: number) => value || ''} // Don't show 0 values
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttritionTrendChart;