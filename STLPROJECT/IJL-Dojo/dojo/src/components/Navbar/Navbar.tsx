import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  heading?: string; // optional prop with default value
}

const Navbar: React.FC<NavbarProps> = ({ heading }) => {
  const [selectedPlant, setSelectedPlant] = useState("All Plants");
  const navigate = useNavigate();
  
  // Display "NL Technologies" if heading is empty or undefined
  const displayHeading = heading ? heading : "NL Technologies";

  // Navigation handler functions would go here
  const navigateDashboard = () => {navigate('/DashboardRedirect')};
  const navigateSkillMatrix = () => {navigate('/SkillsMatrix')};
  const navigateMaster = () => {navigate('/MasterTable')};
  const navEmployee = () => {navigate('/EmployeeEvaluationForm')};
  // const handleNavigate = () => {navigate('/home')};
  const navlevel = () => {navigate('/LevelWiseDashboard')};
  const navMethod = () => {navigate('/ProcessDojo')};
  const navHome = () => {navigate('/digital')};
  
  return (
    <div className="w-full max-w-full overflow-hidden p-4 box-border">
      <div className="flex justify-between items-center w-full">
        {/* Left side */}
        <div className="flex-1 text-left">
          <h1 className="text-lg font-bold uppercase tracking-wider bg-gradient-to-br from-gray-800 to-gray-900 text-white p-3 rounded-tl-xl rounded-br-xl shadow-lg w-[95%]">
            {displayHeading}
          </h1>
        </div>
        
        {/* Right side - Navigation buttons and dropdown */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={navigateDashboard}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm transition-colors"
          >
            Advance Manpower Dashboard
          </button>
          <button 
            onClick={navigateSkillMatrix}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm transition-colors"
          >
            Skill Matrix
          </button>
          <button 
            onClick={navigateMaster}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm transition-colors"
          >
            Master
          </button>
          <button 
            onClick={navEmployee}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm transition-colors"
          >
            Employee
          </button>
          <button 
            onClick={navlevel}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm transition-colors"
          >
            Machine Allocation
          </button>
          <button 
            onClick={navMethod}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm transition-colors"
          >
            Process
          </button>
          <button 
            onClick={navHome}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 text-sm transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;