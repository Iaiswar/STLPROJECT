import React from "react";
import { FaFileWord, FaPlusCircle } from "react-icons/fa";

const DojoWordDocuments: React.FC = () => {
  const wordFiles = [
    { name: "Standard Operating Procedure", url: "/docs/sop.docx" },
    { name: "Meeting Minutes", url: "/docs/minutes.docx" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Add More</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wordFiles.map((doc, index) => (
          <div
            key={index}
            className="flex items-center p-3 space-x-3 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all hover:shadow-md"
            onClick={() => window.open(doc.url, "_blank")}
          >
            <div className="bg-blue-100 p-2 rounded-full">
              <FaFileWord className="text-blue-600 text-xl" />
            </div>
            <span className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
              {doc.name}
            </span>
          </div>
        ))}
        
        {/* Add More Documents Card */}
        <div 
          className="flex items-center p-3 space-x-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-all"
          onClick={() => console.log("Add document clicked")} // Replace with your add function
        >
          <div className="bg-gray-100 p-2 rounded-full">
            <FaPlusCircle className="text-gray-500 text-xl" />
          </div>
          <span className="font-medium text-gray-500 hover:text-gray-700 transition-colors">
            Add Video or Document
          </span>
        </div>
      </div>
    </div>
  );
};

export default DojoWordDocuments;