import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";

const initialData = [
  {
    company: "L1 Training",
    companybg: "#FCC700",
    companycolor: "#FFF5D2",
    content: Array(8).fill({ head: "", status: "Completed" }).map((_, i) => ({
      head: ["Welding", "Buffing", "Drilling", "Milling", "Grinding", "Painting", "Turning", "Boring"][i],
      status: "Completed",
    })),
  },
  {
    company: "Test",
    companybg: "#FCC700",
    companycolor: "#FFF5D2",
    content: Array(8).fill({ head: "", status: "Completed" }).map((_, i) => ({
      head: ["Welding", "Buffing", "Drilling", "Milling", "Grinding", "Painting", "Turning", "Boring"][i],
      status: "Completed",
    })),
  },
  {
    company: "L2 Training",
    companybg: "#FCC700",
    companycolor: "#FFF5D2",
    content: ["Welding", "Buffing", "Drilling", "Milling", "Grinding", "Painting", "Turning", "Boring"].map((head, i) => ({
      head,
      status: i < 4 ? "Completed" : "Pending",
    })),
  },
  {
    company: "Test",
    companybg: "#F3426E",
    companycolor: "#FFEAF1",
    content: ["Welding", "Buffing", "Drilling", "Milling", "Grinding", "Painting", "Turning", "Boring"].map((head, i) => ({
      head,
      status: i === 0 ? "Completed" : i === 1 ? "Pending" : "",
    })),
  },
];

const TestHistory: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [popupIndex, setPopupIndex] = useState<{ companyIndex: number; contentIndex: number } | null>(null);

  const handleStatusChange = (companyIndex: number, contentIndex: number, newStatus: string) => {
    setData((prevData) =>
      prevData.map((company, cIndex) =>
        cIndex === companyIndex
          ? {
              ...company,
              content: company.content.map((item, iIndex) =>
                iIndex === contentIndex ? { ...item, status: newStatus } : item
              ),
            }
          : company
      )
    );
    setPopupIndex(null);
  };

  return (
    <div className="flex-1 min-w-[250px] h-[300px] p-2 rounded-lg shadow-md text-center bg-white overflow-y-auto">
      <div className="text-lg font-bold mb-2 text-[#16163e]">History</div>
      {data.map((company, companyIndex) => (
        <div
          key={companyIndex}
          className="relative grid grid-cols-[10%_repeat(8,1fr)] gap-1 bg-white border border-gray-300 shadow p-[5px_50px_5px_10px] rounded-lg mb-3 min-h-[70px]"
        >
          <div className="flex items-center justify-between text-sm font-semibold">
            <div
              className="flex-none w-[30%] h-[60%] rounded-sm"
              style={{ backgroundColor: company.companybg }}
            ></div>
            <div className="flex-none w-[59%] ml-[1%] text-left text-black">{company.company}</div>
          </div>
          {company.content.map((item, contentIndex) => (
            <div key={contentIndex} className="flex flex-col items-center text-xs font-semibold gap-1">
              <div
                className="rounded px-1 py-[5px] w-full text-center cursor-pointer"
                style={{ backgroundColor: company.companycolor }}
                onClick={() => setPopupIndex({ companyIndex, contentIndex })}
              >
                {item.head}
              </div>
              <div
                className={`rounded px-1 py-[5px] w-full text-center flex items-center justify-center ${
                  item.status === "Pending"
                    ? "text-yellow-500 border border-yellow-500"
                    : item.status === "Completed"
                    ? "text-green-600 border border-green-600"
                    : ""
                }`}
              >
                {item.status === "Pending" ? (
                  <>
                    <FaClock className="mr-1" /> {item.status}
                  </>
                ) : item.status === "Completed" ? (
                  <>
                    <FaCheckCircle className="mr-1" /> {item.status}
                  </>
                ) : (
                  item.status
                )}
              </div>
              {popupIndex &&
                popupIndex.companyIndex === companyIndex &&
                popupIndex.contentIndex === contentIndex && (
                  <div className="absolute -top-10 z-50 bg-white border border-black shadow rounded flex gap-2 p-1 text-xs font-medium">
                    <div
                      className="bg-green-700 text-white rounded px-2 py-1 cursor-pointer"
                      onClick={() => handleStatusChange(companyIndex, contentIndex, "Pending")}
                    >
                      Pending
                    </div>
                    <div
                      className="bg-orange-500 text-white rounded px-2 py-1 cursor-pointer"
                      onClick={() => handleStatusChange(companyIndex, contentIndex, "Completed")}
                    >
                      Completed
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TestHistory;
