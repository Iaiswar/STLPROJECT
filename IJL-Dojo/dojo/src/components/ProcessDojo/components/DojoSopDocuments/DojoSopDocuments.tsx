import React from "react";
import { FaFileWord, FaFilePdf, FaPlusCircle } from "react-icons/fa";

const DojoSopDocuments: React.FC = () => {
  const sopFiles = [
    { name: "SOP for Machine Operation", url: "/pdf/sop-machine-operation.docx", type: "word" },
    { name: "SOP for Quality Check", url: "/pdf/sop-quality-check.docx", type: "word" },
    { name: "1 Know your Company", url: "/pdf/1 Know your Company.pdf", type: "pdf" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">SOP Documents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sopFiles.map((doc, index) => (
          <div
            key={index}
            className={`flex items-center p-3 space-x-3 rounded-lg border border-gray-200 hover:border-${doc.type === 'word' ? 'blue' : 'red'}-300 cursor-pointer transition-all hover:shadow-md`}
            onClick={() => window.open(doc.url, "_blank")}
          >
            <div className={`bg-${doc.type === 'word' ? 'blue' : 'red'}-100 p-2 rounded-full`}>
              {doc.type === 'word' ? (
                <FaFileWord className="text-blue-600 text-xl" />
              ) : (
                <FaFilePdf className="text-red-600 text-xl" />
              )}
            </div>
            <span className={`font-medium text-gray-800 hover:text-${doc.type === 'word' ? 'blue' : 'red'}-600 transition-colors`}>
              {doc.name}
            </span>
          </div>
        ))}
        
        {/* Add More Documents Card */}
       
      </div>
    </div>
  );
};

export default DojoSopDocuments;