import React from "react";
import { FaFilePdf } from "react-icons/fa";

interface PdfFile {
  name: string;
  url: string;
}

interface PdfViewerCardProps {
  pdfFiles: PdfFile[];
}

const PdfViewerCard: React.FC<PdfViewerCardProps> = ({ pdfFiles }) => {
  return (
    <div className="flex-1 min-w-[250px] h-[300px] p-2 rounded-lg shadow-md bg-white text-center overflow-y-auto">
      <h2 className="text-lg font-bold mb-8 text-[#16163e]">Documents</h2>
      <div className="grid grid-cols-3 gap-5 mb-2">
        {pdfFiles.map((pdf, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
            onClick={() => window.open(pdf.url, "_blank")}
          >
            <FaFilePdf className="text-[50px] text-red-600" />
            <span className="text-sm font-bold text-gray-800 mt-1 text-center">
              {pdf.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfViewerCard;
