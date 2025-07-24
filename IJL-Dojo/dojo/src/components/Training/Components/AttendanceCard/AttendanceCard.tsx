import React, { useState, useEffect } from "react";

interface AttendanceCardProps {
  selectedProfile: string;
}

// Days for Attendance Tracking
const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];

// Generate Random Attendance Data
const getRandomAttendance = () => days.map(() => (Math.random() > 0.3 ? "✅" : "❌"));

const AttendanceCard: React.FC<AttendanceCardProps> = ({ selectedProfile }) => {
  const [attendance, setAttendance] = useState<string[]>(getRandomAttendance());

  useEffect(() => {
    setAttendance(getRandomAttendance());
  }, [selectedProfile]);

  const totalPresent = attendance.filter((status) => status === "✅").length;
  const totalAbsent = days.length - totalPresent;

  return (
    <div className="flex-1 min-w-[250px] p-2 rounded-lg shadow-md text-center bg-white">
      <h2 className="text-lg font-bold mb-4 text-[#16163e]">Attendance</h2>

      <table className="w-full border-collapse mb-4">
        <thead>
          <tr>
            {days.map((day, index) => (
              <th
                key={index}
                className="border border-gray-300 px-2 py-1 bg-gradient-to-r from-[#1e1e2f] to-[#292941] text-white text-sm"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {attendance.map((status, index) => (
              <td
                key={index}
                className={`border border-gray-300 px-2 py-1 text-center ${
                  status === "✅" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {status}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="text-sm font-bold flex justify-around mt-2">
        <span>✅ Present: {totalPresent}</span>
        <span>❌ Absent: {totalAbsent}</span>
      </div>
    </div>
  );
};

export default AttendanceCard;
