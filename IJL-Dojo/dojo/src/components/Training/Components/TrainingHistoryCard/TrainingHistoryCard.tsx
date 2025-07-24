import React from "react";

interface TrainingRecord {
  id: number;
  topic: string;
  date: string;
  duration: string;
  faculty: string;
  type: string;
  comments: string;
}

interface TrainingHistoryCardProps {
  employeeName: string;
  department: string;
  skillLevel: number;
  totalExperience: string;
  dateOfJoining: string;
  eCode: string;
  skilledArea: string;
  supervisorName: string;
  trainings: TrainingRecord[];
}

const TrainingHistoryCard: React.FC<TrainingHistoryCardProps> = ({
  employeeName,
  department,
  skillLevel,
  totalExperience,
  dateOfJoining,
  eCode,
  skilledArea,
  supervisorName,
  trainings,
}) => {
  return (
    <div className="flex flex-col p-2 min-w-[300px] rounded-lg shadow-md text-center bg-white overflow-hidden">
      <h2 className="text-lg font-bold p-2 text-white rounded mb-4 bg-gradient-to-r from-[#1e1e2f] to-[#292941]">
        Training History Card
      </h2>

      <div className="text-left flex flex-col gap-4 px-2 mb-4">
        <div className="grid grid-cols-5 gap-4 text-sm">
          <p><strong>Name of Employee:</strong> {employeeName}</p>
          <p><strong>Department:</strong> {department}</p>
          <p><strong>Skill Level:</strong> {skillLevel}</p>
          <p><strong>Total Experience:</strong> {totalExperience}</p>
          <p><strong>Date of Joining:</strong> {dateOfJoining}</p>
        </div>
        <div className="grid grid-cols-5 gap-4 text-sm">
          <p><strong>E.Code:</strong> {eCode}</p>
          <p><strong>Skilled Area:</strong> {skilledArea}</p>
          <p><strong>Supervisor Name:</strong> {supervisorName}</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 max-h-[200px] scroll-smooth">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border p-2 text-left">Sr. No</th>
              <th className="border p-2 text-left">Training Topic</th>
              <th className="border p-2 text-left">Training Date</th>
              <th className="border p-2 text-left">Duration</th>
              <th className="border p-2 text-left">Faculty</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training, index) => (
              <tr key={training.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{training.topic}</td>
                <td className="border p-2">{training.date}</td>
                <td className="border p-2">{training.duration}</td>
                <td className="border p-2">{training.faculty}</td>
                <td className="border p-2">{training.type}</td>
                <td className="border p-2">{training.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingHistoryCard;
