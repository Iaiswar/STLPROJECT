"use client";

import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'BR', waste: 3.81, contribution: 24, color: '#F0B442' }, // Orange/yellow
  { name: 'NW', waste: 3.34, contribution: 21, color: '#808080' }, // Gray
  { name: 'ID', waste: 2.76, contribution: 17, color: '#6B5B95' }, // Purple
  { name: 'CN', waste: 2.24, contribution: 14, color: '#D05A50' }, // Reddish
  { name: 'EU', waste: 2.06, contribution: 13, color: '#A16BB5' }, // Light Purple
  { name: 'US', waste: 1.67, contribution: 11, color: '#9FBF58' }, // Greenish
];

export default function TopItemsPieChart() {
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-2xl flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-center mb-4">
         Waste (%) and Contribution (%) by site
      </h2>

      {/* Pie Chart */}
      <PieChart width={400} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="contribution"
        //   label={({ name }) => name}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value}%`, "Contribution"]}
          contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
        />
      </PieChart>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {entry.name} {entry.waste}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
