import React from "react";

interface RefresherTrainingProps {
  trainings: { siNo: number; topic: string; status: string; date?: string }[];
}

const statusColorMap: Record<string, string> = {
  completed: "text-green-600 font-bold",
  upcoming: "text-yellow-400 font-bold",
  pending: "text-red-600 font-bold",
};

const RefresherTrainingCard: React.FC<RefresherTrainingProps> = ({ trainings }) => {
  return (
    <div className="flex-1 min-w-[250px] p-2 rounded-lg shadow-md bg-white text-center">
      <h2 className="text-lg font-bold mb-2 text-[#16163e]">Refresher Training Schedule</h2>
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
          {trainings.map((item) => (
            <tr key={item.siNo}>
              <td className="border border-gray-300 p-2">{item.siNo}</td>
              <td className="border border-gray-300 p-2">{item.topic}</td>
              <td className={`border border-gray-300 p-2 ${statusColorMap[item.status.toLowerCase()] || ""}`}>
                {item.status}
              </td>
              <td className="border border-gray-300 p-2">
                {item.status.toLowerCase() === "pending" ? "" : item.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RefresherTrainingCard;
