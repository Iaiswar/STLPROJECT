"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';

export default function WasteBucketChart() {
  const [data] = useState([
    { bucket: '0-3%', machines: 105, color: 'bg-green-500' },
    { bucket: '3-5%', machines: 90, color: 'bg-green-500' },
    { bucket: '5-7%', machines: 47, color: 'bg-orange-500' },
    { bucket: '7-10%', machines: 32, color: 'bg-orange-500' },
    { bucket: '10-15%', machines: 20, color: 'bg-orange-300' },
    { bucket: '15-20%', machines: 7, color: 'bg-orange-300' },
    { bucket: '>20%', machines: 1, color: 'bg-orange-300' },
  ]);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-2xl flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-center mb-4">
        #Machines by Waste Bucket
      </h2>

      {/* Chart */}
      <div className="w-full h-[200px] flex justify-center items-center">
        <ResponsiveContainer width="90%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="bucket" 
              angle={-30}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 10 }}   // Smaller text size
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} machines`, "Machines"]}
              contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
            />
            <Bar dataKey="machines">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.color === 'bg-green-500' ? '#22c55e' : 
                    entry.color === 'bg-orange-500' ? '#f97316' : 
                    '#fdba74'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
