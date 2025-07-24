import { useState } from 'react';

const WasteByMachineCodeChart = () => {
  // Data from the image
  const [data] = useState([
    { machineCode: 'MC1641', wastePercentage: 10 },
    { machineCode: 'MC0807', wastePercentage: 10 },
    { machineCode: 'MC0172', wastePercentage: 10 },
    { machineCode: 'MC1802', wastePercentage: 9 },
    { machineCode: 'MC0621', wastePercentage: 9 },
    { machineCode: 'MC0151', wastePercentage: 8 },
    { machineCode: 'MC0723', wastePercentage: 8 },
    { machineCode: 'MC0510', wastePercentage: 8 },
    { machineCode: 'MC1804', wastePercentage: 8 },
    { machineCode: 'MC0804', wastePercentage: 8 },
    { machineCode: 'MC1420', wastePercentage: 8 },
    { machineCode: 'MC1708', wastePercentage: 8 },
    { machineCode: 'MC0618', wastePercentage: 8 },
    { machineCode: 'MC0805', wastePercentage: 7 },
    { machineCode: 'MC0806', wastePercentage: 7 },
    { machineCode: 'MC0201', wastePercentage: 7 },
    { machineCode: 'MC0923', wastePercentage: 7 },
    { machineCode: 'MC0420', wastePercentage: 7 },
    { machineCode: 'MC3609', wastePercentage: 7 },
  ]);

  const maxPercentage = 10; // Maximum waste percentage for scaling
  
  return (
    <div className="w-full h-[615px] bg-white p-4 shadow rounded-md overflow-y-auto scrollbar-hide">
      <h2 className="text-lg font-semibold mb-4">Total Waste(%) by MachineCode</h2>
      
      <div className="relative mb-6">
        {/* X-axis markers and grid lines */}
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <div>0%</div>
          <div>5%</div>
          <div>10%</div>
        </div>
        
        {/* Chart container */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              {/* Machine code label */}
              <div className="w-16 text-xs pr-2 text-right">{item.machineCode}</div>
              
              {/* Bar container with gridlines background */}
              <div className="relative flex-grow h-6">
                {/* Vertical grid lines */}
                <div className="absolute inset-0 flex justify-between pointer-events-none">
                  <div className="h-full border-l border-gray-300"></div>
                  <div className="h-full border-l border-dashed border-gray-300"></div>
                  <div className="h-full border-l border-gray-300"></div>
                </div>
                
                {/* Actual bar */}
                <div 
                  className="absolute top-0 left-0 h-full bg-amber-500 flex items-center justify-end pr-2"
                  style={{ width: `${(item.wastePercentage / maxPercentage) * 100}%` }}
                >
                  <span className="text-xs font-medium">{item.wastePercentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chart footer */}
      <div className="flex justify-end text-gray-400 text-xs">
        <span>ara</span>
      </div>
    </div>
  );
};

export default WasteByMachineCodeChart;