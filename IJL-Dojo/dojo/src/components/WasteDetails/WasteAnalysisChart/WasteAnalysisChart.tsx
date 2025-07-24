import { useState } from 'react';
import { Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  month: string;
  quarter: string;
  totalWaste: number;
  standardDM: number;
  wastePercentage: number;
}

const WasteAnalysisChart: React.FC = () => {
  const [data] = useState<DataItem[]>([
    { name: 'Jan', month: 'January', quarter: 'Qtr 1', totalWaste: 120, standardDM: 3800, wastePercentage: 2.68 },
    { name: 'Feb', month: 'February', quarter: 'Qtr 1', totalWaste: 140, standardDM: 3600, wastePercentage: 2.74 },
    { name: 'Mar', month: 'March', quarter: 'Qtr 1', totalWaste: 150, standardDM: 3800, wastePercentage: 2.92 },
    { name: 'Apr', month: 'April', quarter: 'Qtr 2', totalWaste: 160, standardDM: 3900, wastePercentage: 3.03 },
    { name: 'May', month: 'May', quarter: 'Qtr 2', totalWaste: 130, standardDM: 3500, wastePercentage: 2.87 },
    { name: 'Jun', month: 'June', quarter: 'Qtr 2', totalWaste: 110, standardDM: 3200, wastePercentage: 2.85 },
    { name: 'Jul', month: 'July', quarter: 'Qtr 3', totalWaste: 120, standardDM: 3400, wastePercentage: 2.85 },
    { name: 'Aug', month: 'August', quarter: 'Qtr 3', totalWaste: 130, standardDM: 3900, wastePercentage: 2.99 },
    { name: 'Sep', month: 'September', quarter: 'Qtr 3', totalWaste: 140, standardDM: 1800, wastePercentage: 2.99 },
  ]);

  // Find the unique quarters for drawing the dividers
  const quarters = Array.from(new Set(data.map(item => item.quarter)));
  
  // Calculate positions for quarter dividers
  const getQuarterPositions = () => {
    const positions: Record<string, { start: number, end: number }> = {};
    
    quarters.forEach(quarter => {
      const quarterData = data.filter(item => item.quarter === quarter);
      const startIndex = data.findIndex(item => item.quarter === quarter);
      const endIndex = startIndex + quarterData.length - 1;
      
      positions[quarter] = {
        start: startIndex / (data.length - 1),
        end: endIndex / (data.length - 1)
      };
    });
    
    return positions;
  };
  
  const quarterPositions = getQuarterPositions();

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded shadow-2xl ">
      <div className="p-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">TotalWaste and Waste(%) by Period</h2>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-center space-x-6 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm">TotalWaste</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-200 mr-2"></div>
            <span className="text-sm">Standard DM</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
            <span className="text-sm">Waste(%)</span>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${Math.round(value/1000)}M`}
                domain={[0, 4000]}
                tickCount={5}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[2.6, 3.0]}
                tickCount={5}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'wastePercentage') {
                    return [`${value}%`, 'Waste (%)'];
                  }
                  if (name === 'standardDM') {
                    return [value, 'Standard DM'];
                  }
                  return [value, 'Total Waste'];
                }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="standardDM" 
                fill="#bfdbfe" 
                barSize={30}
                radius={[0, 0, 0, 0]}
                stackId="stack"
                name="Standard DM"
              />
              <Bar 
                yAxisId="left" 
                dataKey="totalWaste" 
                fill="#f59e0b" 
                barSize={6} 
                radius={[3, 3, 0, 0]}
                name="Total Waste"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="wastePercentage"
                stroke="#f87171"
                strokeWidth={2}
                dot={{ 
                  fill: '#f87171', 
                  r: 5,
                  strokeWidth: 0
                }}
                activeDot={{ 
                  r: 6,
                  stroke: '#f87171',
                  strokeWidth: 1
                }}
                label={(props) => {
                  const { x, y, value } = props;
                  return (
                    <g transform={`translate(${x},${y - 20})`}>
                      <rect x={-22} y={-12} width={45} height={20} rx={4} fill="#C15C5C" />
                      <text x={0} y={2} textAnchor="middle" fill="#FFFFFF" fontSize={11} fontWeight="500">
                        {typeof value === 'number' ? `${value.toFixed(2)}%` : ''}
                      </text>
                    </g>
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Quarter dividers and labels */}
        <div className="relative -mt-12 mb-2">
          <div className="border-t border-gray-300 border-dashed w-full"></div>
          
          {Object.entries(quarterPositions).map(([quarter, pos]) => {
            const midPoint = (pos.start + pos.end) / 2 * 100;
            const startPoint = pos.start * 100;
            const endPoint = pos.end * 100;
            
            return (
              <div key={quarter} className="absolute" style={{ left: `${midPoint}%`, transform: 'translateX(-50%)' }}>
                {/* Quarter label */}
                <div className="text-xs text-gray-500 text-center mt-2">{quarter}</div>
                
                {/* Left dashed line */}
                {startPoint > 0 && (
                  <div 
                    className="absolute border-l border-gray-300 border-dashed h-16" 
                    style={{ left: `-${(midPoint - startPoint) / 2}%`, bottom: '12px' }}
                  ></div>
                )}
                
                {/* Right dashed line */}
                {endPoint < 100 && (
                  <div 
                    className="absolute border-l border-gray-300 border-dashed h-16" 
                    style={{ left: `${(endPoint - midPoint) / 2}%`, bottom: '12px' }}
                  ></div>
                )}
              </div>
            );
          })}
          
          <div className="text-xs text-gray-500 text-center mt-8">2019</div>
        </div>
      </div>
    </div>
  );
};

export default WasteAnalysisChart;