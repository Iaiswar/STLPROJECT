import React from "react";
import ReactSpeedometer, { CustomSegmentLabelPosition } from "react-d3-speedometer";
import profile1 from "../../../images/profile1.png";
import profile2 from "../../../images/profile2.png";
import profile3 from "../../../images/profile3.png";
import profile4 from "../../../images/profile4.png";
import profile5 from "../../../images/profile5.png";

// Employee list with levels
const employees = [
  { name: "Amit Sharma", level: "L1" },
  { name: "Priya Verma", level: "L1" },
  { name: "Ravi Kumar", level: "L1" },
  { name: "Neha Singh", level: "L1" },
  { name: "Suresh Iyer", level: "L1" },
  { name: "Vikram Patel", level: "L2" },
  { name: "Ananya Nair", level: "L2" },
  { name: "Manoj Mehta", level: "L2" },
  { name: "Sneha Reddy", level: "L2" },
  { name: "Rahul Choudhary", level: "L2" },
  { name: "Kiran Joshi", level: "L3" },
  { name: "Siddharth Rao", level: "L3" },
  { name: "Pooja Desai", level: "L3" },
  { name: "Arun Menon", level: "L3" },
  { name: "Meera Kapoor", level: "L3" },
  { name: "Tarun Bhatia", level: "L4" },
  { name: "Swati Saxena", level: "L4" },
  { name: "Deepak Malhotra", level: "L4" },
  { name: "Roshni Pillai", level: "L4" },
  { name: "Anil Agrawal", level: "L4" },
];

// Map levels to speed values
const levelSpeedMap: Record<string, number> = {
  L1: 20,
  L2: 40,
  L3: 60,
  L4: 80,
};

// Profile images array (cycled through)
const profileImages = [profile1, profile2, profile3, profile4, profile5];

// Generate profiles dynamically
const profiles: Record<
  string,
  { image: string; level: string; speedValue: number }
> = employees.reduce((acc, employee, index) => {
  acc[employee.name] = {
    image: profileImages[index % profileImages.length],
    level: employee.level,
    speedValue: levelSpeedMap[employee.level] || 0,
  };
  return acc;
}, {} as Record<string, { image: string; level: string; speedValue: number }>);

interface SpeedometerCardProps {
  selectedProfile: string;
  onProfileChange: (profile: string) => void;
}

const SpeedometerCard: React.FC<SpeedometerCardProps> = ({
  selectedProfile,
  onProfileChange,
}) => {
  const profileData = profiles[selectedProfile];

  if (!profileData) {
    return <div className="flex-1 min-w-[250px] h-[300px] p-5 rounded-lg shadow-md text-center bg-white">Profile not found</div>;
  }

  const { image, level, speedValue } = profileData;

  return (
    <div className="flex-1 min-w-[250px] h-[300px] p-2 rounded-lg shadow-md text-center bg-white flex flex-col justify-between">
      {/* Header: Profile + Dropdown */}
      <div className="flex justify-between items-center mb-3">
        <img
          src={image}
          alt="Profile"
          className="w-12 h-12 rounded-full mx-auto"
        />
        <select
          className="p-1 text-sm border border-gray-300 rounded cursor-pointer"
          value={selectedProfile}
          onChange={(e) => onProfileChange(e.target.value)}
        >
          {Object.keys(profiles).map((profileName) => (
            <option key={profileName} value={profileName}>
              {profileName}
            </option>
          ))}
        </select>
      </div>

      {/* Speedometer */}
      <div className="flex justify-center items-center">
        <ReactSpeedometer
          value={speedValue}
          maxValue={100}
          needleColor="#5BE12C"
          startColor="#EA4228"
          endColor="#5BE12C"
          segments={4}
          width={260}
          height={170}
          needleTransitionDuration={400}
          needleHeightRatio={0.75}
          ringWidth={15}
          valueTextFontSize="16px"
          currentValueText={level}
          customSegmentLabels={[
            {
              text: "Beginner",
              position: CustomSegmentLabelPosition.Outside,
              fontSize: "12px",
            },
            {
              text: "Intermediate",
              position: CustomSegmentLabelPosition.Outside,
              fontSize: "12px",
            },
            {
              text: "Advanced",
              position: CustomSegmentLabelPosition.Outside,
              fontSize: "12px",
            },
            {
              text: "Expert",
              position: CustomSegmentLabelPosition.Outside,
              fontSize: "12px",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default SpeedometerCard;
