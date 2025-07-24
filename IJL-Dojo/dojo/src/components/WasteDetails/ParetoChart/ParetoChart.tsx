import { useState } from 'react';
import { Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
  color: string;
  percentage?: number;
  cumulativePercentage?: number;
}

const ParetoChart: React.FC = () => {
  // Sample data based on the image
  const [data] = useState<DataItem[]>([
    { name: 'NB', value: 17000, color: '#8BAD4A' },
    { name: 'SU', value: 5200, color: '#8BAD4A' },
    { name: 'TD', value: 4500, color: '#8BAD4A' },
    { name: 'BY', value: 2200, color: '#8BAD4A' },
    { name: 'TL', value: 1900, color: '#8BAD4A' },
    { name: 'PI', value: 1800, color: '#8BAD4A' },
    { name: 'SD', value: 1600, color: '#E57373' },
    { name: 'PJ', value: 1500, color: '#E57373' },
    { name: 'BM', value: 1300, color: '#E57373' },
    { name: 'LI', value: 1100, color: '#E57373' },
    { name: 'DR', value: 1000, color: '#E57373' },
    { name: 'FK', value: 900, color: '#E57373' },
    { name: 'RG', value: 800, color: '#E57373' },
    { name: 'BT', value: 700, color: '#E57373' },
    { name: 'AB', value: 600, color: '#E57373' },
    { name: 'LD', value: 500, color: '#E57373' },
    { name: 'DF', value: 400, color: '#E57373' },
    { name: 'FM', value: 300, color: '#E57373' },
  ]);

  // Calculate total and cumulative percentages
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercent = 0;
  const enhancedData = data.map(item => {
    cumulativePercent += (item.value / totalValue) * 100;
    return {
      ...item,
      percentage: (item.value / totalValue) * 100,
      cumulativePercentage: cumulativePercent
    };
  });

  const renderCustomBarShape = (props: any) => {
    const { x, y, width, height, dataItem } = props;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={dataItem.color}
      />
    );
  };

  return (
    <div className="w-full bg-white p-4 shadow-2xl">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-gray-800">Top Runners by ProdVolume (in MnRod)</h2>
        <span className="text-3xl font-bold text-green-600">41,775.17</span>
      </div>
      
      <div className="flex items-center my-2 text-xs">
        <div className="flex items-center mr-6">
          <div className="w-3 h-3 rounded-full bg-green-600 mr-1"></div>
          <span>ProductVolume</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span>(Pareto) % Product</span>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={enhancedData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            barGap={0}
            barCategoryGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#cccccc" />
            <XAxis 
              dataKey="name" 
              scale="band" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#cccccc' }}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value / 1000}K`}
              tickLine={false}
              axisLine={false}
              domain={[0, 20000]}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'value') return [value, 'Volume'];
                if (name === 'cumulativePercentage' && typeof value === 'number') {
                  return [`${value.toFixed(1)}%`, 'Cumulative %'];
                }
                return [value, name];
              }}
              contentStyle={{ fontSize: '12px' }}
            />
            <Bar 
              dataKey="value" 
              yAxisId="left"
              fill="#8BAD4A"
              maxBarSize={25}
              shape={(props: {
                x?: number;
                y?: number;
                width?: number;
                height?: number;
                payload?: any;
              }) => {
                const item = props.payload as DataItem;
                return <rect
                  x={props.x}
                  y={props.y}
                  width={props.width}
                  height={props.height}
                  fill={item.color}
                />;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulativePercentage" 
              yAxisId="right" 
              stroke="#4285F4" 
              strokeWidth={2}
              dot={{ fill: '#4285F4', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Horizontal dashed lines */}
      <div className="relative -mt-64 h-64 pointer-events-none">
        <div className="absolute w-full border-t border-gray-300 border-dashed" style={{ top: '0%' }}></div>
        <div className="absolute w-full border-t border-gray-300 border-dashed" style={{ top: '25%' }}></div>
        <div className="absolute w-full border-t border-gray-300 border-dashed" style={{ top: '50%' }}></div>
        <div className="absolute w-full border-t border-gray-300 border-dashed" style={{ top: '75%' }}></div>
        <div className="absolute w-full border-t border-gray-300 border-dashed" style={{ top: '100%' }}></div>
      </div>
    </div>
  );
};

export default ParetoChart;