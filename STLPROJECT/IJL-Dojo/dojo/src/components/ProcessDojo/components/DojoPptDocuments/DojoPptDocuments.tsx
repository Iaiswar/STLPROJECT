import React from "react";
import { FaFilePowerpoint, FaPlusCircle } from "react-icons/fa";

const DojoPptDocuments: React.FC = () => {
  const pptFiles = [
    { name: "Process DOJO", url: "/ppt/6 Process Dojo.pptx" },
    { name: "Quality DOJO", url: "/ppt/7 Quality Dojo.pptx" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Process Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pptFiles.map((ppt, index) => (
          <div
            key={index}
            className="flex items-center p-3 space-x-3 rounded-lg border border-gray-200 hover:border-orange-300 cursor-pointer transition-all hover:shadow-md"
            onClick={() => window.open(ppt.url, "_blank")}
          >
            <div className="bg-orange-100 p-2 rounded-full">
              <FaFilePowerpoint className="text-orange-600 text-xl" />
            </div>
            <span className="font-medium text-gray-800 hover:text-orange-600 transition-colors">
              {ppt.name}
            </span>
          </div>
        ))}
        
        {/* Add More Documents Card */}
        
      </div>
    </div>
  );
};

export default DojoPptDocuments;