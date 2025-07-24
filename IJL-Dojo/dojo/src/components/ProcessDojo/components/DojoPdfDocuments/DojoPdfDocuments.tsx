import React from "react";
import { FaFilePdf } from "react-icons/fa";

const DojoPdfDocuments: React.FC = () => {
  const pdfFiles = [
    { name: "Safety DOJO", url: "/pdf/2 Safety Dojo.pdf" },
    { name: "Senses DOJO", url: "/pdf/3 Senses Dojo.pdf" },
    { name: "Product DOJO", url: "/pdf/4 Product Dojo.pdf" },
    { name: "Production Rule DOJO", url: "/pdf/5 Production Rule Dojo.pdf" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Safety Preparation</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pdfFiles.map((pdf, index) => (
          <div
            key={index}
            className="flex items-center p-3 space-x-3 rounded-lg border border-gray-200 hover:border-red-300 cursor-pointer transition-all hover:shadow-md"
            onClick={() => window.open(pdf.url, "_blank")}
          >
            <div className="bg-red-100 p-2 rounded-full">
              <FaFilePdf className="text-red-600 text-xl" />
            </div>
            <span className="font-medium text-gray-800 hover:text-red-600 transition-colors">
              {pdf.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DojoPdfDocuments;