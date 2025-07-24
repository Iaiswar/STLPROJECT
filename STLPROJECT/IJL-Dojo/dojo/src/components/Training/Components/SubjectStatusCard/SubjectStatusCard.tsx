import React from "react";

interface SubjectStatusProps {
  subjects: { siNo: number; subject: string; status: string; date: string }[];
}

const statusColorMap: Record<string, string> = {
  completed: "text-green-600 font-bold",
  failed: "text-red-600 font-bold",
  upcoming: "text-yellow-400 font-bold",
};

const SubjectStatusCard: React.FC<SubjectStatusProps> = ({ subjects }) => {
  return (
    <div className="flex-1 min-w-[250px] p-2 rounded-lg shadow-md bg-white text-center">
      <h2 className="text-lg font-bold mb-2 text-[#16163e]">Training Test Alert</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 font-bold">
            <th className="border border-gray-300 p-2">SI No</th>
            <th className="border border-gray-300 p-2">Topic</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((item) => (
            <tr key={item.siNo}>
              <td className="border border-gray-300 p-2">{item.siNo}</td>
              <td className="border border-gray-300 p-2">{item.subject}</td>
              <td className={`border border-gray-300 p-2 ${statusColorMap[item.status.toLowerCase()] || ""}`}>
                {item.status}
              </td>
              <td className="border border-gray-300 p-2">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectStatusCard;
