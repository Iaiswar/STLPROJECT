import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface ContributionData {
  month: string;
  quarter?: string;
  BR: number;
  CN: number;
  EU: number;
  ID: number;
  NW: number;
  US: number;
}

interface SiteContributionChartProps {
  mode: 'CO' | 'PROD' | 'SAM';
  selectedTab: 'OEE' | 'Waste' | 'Downtime';
  startDate: string;  // Added missing prop
  endDate: string;    // Added missing prop
  workCenter: string; // Added missing prop
}

export default function SiteContributionChart({ 
  mode, 
  selectedTab, 
  startDate, 
  endDate, 
  workCenter 
}: SiteContributionChartProps) {
  const [data, setData] = useState<ContributionData[]>([]);

  useEffect(() => {
    // You can now use startDate, endDate, and workCenter here
    console.log(`Generating data for ${workCenter} from ${startDate} to ${endDate}`);
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];

    const baseShift = {
      CO: 0,
      PROD: 2,
      SAM: 4,
    };

    const shift = baseShift[mode]; // Add variability based on mode

    const newData: ContributionData[] = months.map((month, index) => {
      let quarter;
      if (index < 3) quarter = 'Qtr 1';
      else if (index < 6) quarter = 'Qtr 2';
      else quarter = 'Qtr 3';

      // Vary base values per mode
      const getBRValue = () => 15 + Math.random() * 2 + shift;
      const getCNValue = () => 18 + Math.random() * 2 + shift;
      const getEUValue = () => 17 + Math.random() * 2 + shift;
      const getIDValue = () => 16 + Math.random() * 2 + shift;
      const getNWValue = () => 14 + Math.random() * 2 + shift;
      const getUSValue = () => 20 + Math.random() * 2 + shift;

      return {
        month,
        quarter,
        BR: getBRValue(),
        CN: getCNValue(),
        EU: getEUValue(),
        ID: getIDValue(),
        NW: getNWValue(),
        US: getUSValue(),
      };
    });

    // Update data based on selectedTab
    if (selectedTab === 'Waste') {
      // Example logic for modifying data when the "Waste" tab is selected
      newData.forEach(item => {
        item.BR *= 1.2;  // Example: increase all BR values by 20% for "Waste"
      });
    }

    setData(newData);
  }, [mode, selectedTab, startDate, endDate, workCenter]);  // Updated dependencies

  return (
    <div className="w-full h-93 bg-white border border-gray-200 shadow-2xl rounded">
      <div className="p-4">
        <h2 className="text-center text-xl font-semibold mb-4">Site Contribution</h2>

        <div className="flex justify-center items-center mb-4">
          {[{ label: 'BR', color: 'bg-yellow-500' },
            { label: 'CN', color: 'bg-red-600' },
            { label: 'EU', color: 'bg-purple-600' },
            { label: 'ID', color: 'bg-blue-700' },
            { label: 'NW', color: 'bg-indigo-800' },
            { label: 'US', color: 'bg-green-600' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center mx-2">
              <div className={`w-3 h-3 rounded-full ${color} mr-1`}></div>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="98%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
              stackOffset="expand"
              barSize={40}
            >
              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine
                tick={(props) => {
                  const { x, y, payload } = props;
                  const month = payload.value;
                  const quarter = data.find((item) => item.month === month)?.quarter;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
                        {month}
                      </text>
                      {['January', 'April', 'July'].includes(month) && (
                        <text x={0} y={0} dy={32} textAnchor="middle" fill="#666" fontSize={12}>
                          {quarter}
                        </text>
                      )}
                    </g>
                  );
                }}
                height={60}
              />
              <YAxis
                tickFormatter={(tick) => `${tick * 100}%`}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                itemSorter={(item) => item.value !== undefined ? -item.value : 0}
              />
              <Bar dataKey="BR" stackId="a" fill="#ECC94B" />
              <Bar dataKey="CN" stackId="a" fill="#C53030" />
              <Bar dataKey="EU" stackId="a" fill="#805AD5" />
              <Bar dataKey="ID" stackId="a" fill="#2B6CB0" />
              <Bar dataKey="NW" stackId="a" fill="#434190" />
              <Bar dataKey="US" stackId="a" fill="#38A169" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* <div className="text-center text-gray-500 mt-4">2019</div> */}
      </div>
    </div>
  );
}