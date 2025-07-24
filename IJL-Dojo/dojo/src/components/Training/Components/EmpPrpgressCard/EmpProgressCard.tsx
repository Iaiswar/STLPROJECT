import React from "react";

interface EmployeeProgressProps {
  selectedProfile: string;
}

// Employee List
const employeeNames = [
  "Amit Sharma", "Priya Verma", "Ravi Kumar", "Neha Singh", "Suresh Iyer",
  "Vikram Patel", "Ananya Nair", "Manoj Mehta", "Sneha Reddy", "Rahul Choudhary",
  "Kiran Joshi", "Siddharth Rao", "Pooja Desai", "Arun Menon", "Meera Kapoor",
  "Tarun Bhatia", "Swati Saxena", "Deepak Malhotra", "Roshni Pillai", "Anil Agrawal"
];

// Generate random progress data
const generateProgressData = (): Record<string, { name: string; progress: number }[]> => {
  const masteryLevels = ["Basic Mastery", "Intermediate Mastery", "Advanced Mastery", "Expert Mastery"];
  return employeeNames.reduce((acc, name) => {
    acc[name] = masteryLevels.map(level => ({
      name: level,
      progress: Math.floor(Math.random() * 100),
    }));
    return acc;
  }, {} as Record<string, { name: string; progress: number }[]>);
};

const progressData = generateProgressData();

const EmployeeProgress: React.FC<EmployeeProgressProps> = ({ selectedProfile }) => {
  const courses = progressData[selectedProfile] || [];

  return (
    <div className="flex-1 min-w-[250px] h-[300px] p-2 rounded-lg shadow-md bg-white text-center overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-[#16163e]">Employee Progress</h2>
      {courses.map((course, index) => (
        <div key={index} className="flex items-center gap-4 mb-4">
          <span className="text-sm font-bold flex-1 text-left">{course.name}</span>
          <div className="flex-2 h-6 bg-gray-300 rounded overflow-hidden w-full">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold w-12 text-right">{course.progress}%</span>
        </div>
      ))}
    </div>
  );
};

export default EmployeeProgress;
