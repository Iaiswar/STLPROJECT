import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaSpinner, FaLock } from "react-icons/fa";

type Level = {
  level: string;
  status: "Completed" | "In Progress" | "Locked";
  progress?: number;
  locked?: boolean;
};

interface EmployeeLevelCardProps {
  selectedProfile: string;
}

const employeeNames = [
  "Amit Sharma", "Priya Verma", "Ravi Kumar", "Neha Singh", "Suresh Iyer",
  "Vikram Patel", "Ananya Nair", "Manoj Mehta", "Sneha Reddy", "Rahul Choudhary",
  "Kiran Joshi", "Siddharth Rao", "Pooja Desai", "Arun Menon", "Meera Kapoor",
  "Tarun Bhatia", "Swati Saxena", "Deepak Malhotra", "Roshni Pillai", "Anil Agrawal"
];

const generateLevelData = (): Record<string, Level[]> => {
  const levels = ["Level 1", "Level 2", "Level 3", "Level 4"];

  return employeeNames.reduce((acc, name) => {
    const completedLevels = Math.floor(Math.random() * 4);
    const progress = completedLevels < 3 ? Math.floor(Math.random() * 100) : 0;
    const employeeLevels: Level[] = levels.map((level, index) => {
      if (index < completedLevels) {
        return { level, status: "Completed" };
      } else if (index === completedLevels) {
        return { level, status: "In Progress", progress };
      } else {
        return { level, status: "Locked", locked: true };
      }
    });

    acc[name] = employeeLevels;
    return acc;
  }, {} as Record<string, Level[]>);
};

const levelData = generateLevelData();

const EmployeeLevelCard: React.FC<EmployeeLevelCardProps> = ({ selectedProfile }) => {
  const [levelStatus, setLevelStatus] = useState<Level[]>(levelData[selectedProfile] || []);

  useEffect(() => {
    setLevelStatus(levelData[selectedProfile] || []);
  }, [selectedProfile]);

  const handleCompleteLevel = (index: number) => {
    setLevelStatus((prevLevels) =>
      prevLevels.map((level, i) => {
        if (i === index) {
          return { ...level, status: "Completed", progress: 100 };
        }
        if (i === index + 1 && level.locked) {
          return { ...level, status: "In Progress", locked: false, progress: 50 };
        }
        return level;
      })
    );
  };

  return (
    <div className="flex-1 min-w-[250px] h-[300px] p-2 rounded-lg shadow-md text-center bg-white overflow-y-auto scrollbar-hide">
      <h2 className="text-lg font-bold mb-3 text-[#16163e]">Employee Levels</h2>
      <div className="flex flex-col gap-2">
        {levelStatus.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-3 rounded bg-[rgba(213,229,255,0.8)] transition-all relative ${
              item.locked ? "bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <span className="font-bold text-[#2c3e50]">{item.level}</span>
            <div className="flex items-center gap-2 font-bold">
              {item.status === "Completed" && <FaCheckCircle className="text-green-600" />}
              {item.status === "In Progress" && (
                <FaSpinner className="text-blue-600 animate-spin" />
              )}
              {item.status === "Locked" && <FaLock className="text-red-600" />}
              <span>{item.status}</span>
            </div>

            {item.status === "In Progress" && (
              <div className="w-[70%] bg-gray-300 rounded h-2 mt-1 overflow-hidden relative">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
                <span className="text-xs font-bold mt-1 block">{item.progress}%</span>
              </div>
            )}

            {item.status === "In Progress" && !item.locked && (
              <button
                onClick={() => handleCompleteLevel(index)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded mt-2"
              >
                Mark Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeLevelCard;
