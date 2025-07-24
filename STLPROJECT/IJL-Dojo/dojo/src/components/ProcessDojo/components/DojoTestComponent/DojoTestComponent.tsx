import React from "react";
import { FaPlay, FaPlusCircle } from "react-icons/fa";

interface TestItem {
  name: string;
  url: string;
}

const DojoTestComponent: React.FC = () => {
  const tests: TestItem[] = [
    { name: "Safety Knowledge Test", url: "/tests/safety" },
    { name: "Quality Standards Test", url: "/tests/quality" },
    { name: "Machine Operation Test", url: "/tests/machine" },
    { name: "Process Understanding Test", url: "/tests/process" },
    { name: "Equipment Handling Test", url: "/tests/equipment" },
    { name: "Emergency Procedures Test", url: "/tests/emergency" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[270px] flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Training Tests</h2>
      <div className="overflow-y-auto flex-grow pr-2  [scrollbar-width:none] [-ms-overflow-style:none] ">
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-200 transition-all"
            >
              <span className="font-medium text-gray-800">{test.name}</span>
              <button
                onClick={() => window.open(test.url, "_blank")}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors text-sm"
              >
                <span>Start</span>
                <FaPlay className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Test Button - Fixed at bottom */}
    
      
    </div>
  );
};


export default DojoTestComponent;