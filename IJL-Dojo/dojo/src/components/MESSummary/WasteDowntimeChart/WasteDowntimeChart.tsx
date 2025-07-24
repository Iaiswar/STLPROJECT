import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts';

interface WasteDowntimeChartProps {
  mode: 'CO' | 'PROD' | 'SAM';
  selectedTab: 'OEE' | 'Waste' | 'Downtime';
  setSelectedTab: React.Dispatch<React.SetStateAction<'OEE' | 'Waste' | 'Downtime'>>;
  startDate?: string;
  endDate?: string;
  workCenter?: string;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September'
];

// Base values for each type
const baseValues = {
  OEE: [5.06, 5.23, 7.62, 4.62, 5.26, 4.92, 5.18, 8.75, 8.62],
  Waste: [8.5, 9.0, 9.0, 8.0, 9.1, 6.8, 6.0, 7.2, 4.0],
  Downtime: [9.5, 6.8, 7.8, 5.0, 9.6, 5.1, 10.4, 9.0, 8.7],
};

const tabs = ["OEE", "Waste", "Downtime"];

// Reference values for different modes
const referenceValues = {
  CO: { OEE: 6.14, Waste: 7.0, Downtime: 8.0 },
  PROD: { OEE: 5.85, Waste: 6.5, Downtime: 7.5 },
  SAM: { OEE: 6.50, Waste: 7.2, Downtime: 8.2 }
};

function generateRandomData(base: number[], variance = 0.5, workCenter = 'All', mode = 'PROD') {
  // Apply work center and mode influence to the data
  const workCenterFactor = workCenter === 'All' ? 1 : 
                          workCenter === 'WK1' ? 1.1 : 
                          workCenter === 'WK2' ? 0.9 : 1.05;
  
  const modeFactor = mode === 'CO' ? 0.95 : 
                    mode === 'PROD' ? 1 : 1.05;
                    
  return base.map((value, i) => ({
    month: months[i],
    value: +((value * workCenterFactor * modeFactor) + 
             (Math.random() * variance * 2 - variance)).toFixed(2),
  }));
}

// Function to filter data based on date range
function filterDataByDateRange(data: any[], startDate: string, endDate: string) {
  // Convert dates to month indexes (0-based)
  const startMonth = new Date(startDate).getMonth();
  const endMonth = new Date(endDate).getMonth();
  
  return data.filter((item, index) => {
    const monthIndex = months.indexOf(item.month);
    return monthIndex >= startMonth && monthIndex <= endMonth;
  });
}

export default function WasteDowntimeChart({ 
  mode, 
  selectedTab, 
  setSelectedTab,
  startDate = '2025-01-01',
  endDate = '2025-09-01',
  workCenter = 'All'
}: WasteDowntimeChartProps) {
  const [data, setData] = useState(generateRandomData(baseValues[selectedTab]));
  const [filteredData, setFilteredData] = useState(data);
  const [referenceValue, setReferenceValue] = useState(referenceValues[mode][selectedTab]);

  // Regenerate chart data when any parameter changes
  useEffect(() => {
    console.log(`Refreshing WasteDowntimeChart with:`, { 
      mode, selectedTab, startDate, endDate, workCenter 
    });
    
    // Generate new base data based on tab, mode and work center
    const base = baseValues[selectedTab];
    const newData = generateRandomData(base, 0.5, workCenter, mode);
    
    // Apply date filtering
    const filtered = filterDataByDateRange(newData, startDate, endDate);
    
    // Update reference value based on mode
    const newReferenceValue = referenceValues[mode][selectedTab];
    
    setData(newData);
    setFilteredData(filtered);
    setReferenceValue(newReferenceValue);
  }, [selectedTab, mode, startDate, endDate, workCenter]);

  return (
    <div className="p-6 bg-white rounded shadow-2xl">
      <div className="flex justify-center gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as 'OEE' | 'Waste' | 'Downtime')}
            className={`px-4 py-2 rounded-full border transition
              ${selectedTab === tab ? 'bg-black text-white' : 'bg-gray-100 text-black'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* <div className="text-sm text-gray-500 mb-2">
        Showing data for: {workCenter} · {startDate} to {endDate} · {mode} mode
      </div> */}

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData.length > 0 ? filteredData : data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[4, 10]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
          <ReferenceLine 
            y={referenceValue} 
            label={`${referenceValue}%`} 
            stroke="red" 
            strokeDasharray="3 3" 
          />
          <Line
            type="linear"
            dataKey="value"
            stroke="#1D4ED8"
            strokeWidth={3}
            activeDot={{ r: 6 }}
            label={{
              position: 'top',
              formatter: (value: number) => `${value.toFixed(2)}%`,
              fontSize: 12,
              fill: '#000',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {filteredData.length === 0 && (
        <div className="text-center text-red-500 mt-4">
          No data available for the selected date range.
        </div>
      )}
    </div>
  );
}