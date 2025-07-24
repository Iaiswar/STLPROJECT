

import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, GraduationCap, CalendarCheck } from "lucide-react";
import Nav from "../../../../../HomeNav/nav";
import FileUploadComponent from "./FileUpload/FileUpload";


interface LocationState {
  lineId?: string;
  lineName?: string;
  prevpage?: string;
  sectionTitle?: string;
  questionPaperId?: number;
  skillId?: number;
  skillName?: string;
}


const TrainingOptionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { lineId, lineName, prevpage,sectionTitle } = (location.state as LocationState) || {};
  const { lineId, lineName, prevpage, sectionTitle, questionPaperId, skillId, skillName } = (location.state as LocationState) || {};

  console.log('Received state:', { lineId, lineName, prevpage, sectionTitle, questionPaperId, skillId, skillName });
  // Training Option Handlers
  // const handleEvaluationTestClick = () => navigate("/");
  const handleEvaluationTestClick = () => {
    navigate("/assign-remote", {
      state: {
        lineId,
        lineName,
        prevpage,
        sectionTitle,
        questionPaperId,  // <-- pass questionPaperId forward
        skillId,
        levelId: 2, // Level 2 training
        fromNavigation: true,
        skillName: skillName || lineName, // Use the actual topic name as skill name
        levelName: 'Level 2'
      }
    });
  };
  const handleOJTClick = () => navigate("");
  // const handleTenCycleClick = () => navigate("/SearchBar");
  const handleTenCycleClick = () => {
    navigate("/SearchBar", {
      state: {
        lineId,
        lineName,
        prevpage,
        sectionTitle
      }
    });
  };

  // Render functions
  const renderTrainingOptions = () => (
    <div className="p-4 bg-gray-50 rounded-lg mx-auto mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
          onClick={handleEvaluationTestClick}
        >
          <CheckCircle className="w-10 h-10 text-blue-500 mb-4" />
          <span className="text-gray-700 font-medium text-lg text-center">Evaluation Test</span>
        </div>
        
        <div 
          className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-green-50 hover:border-green-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
          onClick={handleOJTClick}
        >
          <GraduationCap className="w-10 h-10 text-green-500 mb-4" />
          <span className="text-gray-700 font-medium text-lg text-center">On-Job Training</span>
        </div>
        
        <div 
          className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-purple-50 hover:border-purple-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
          onClick={handleTenCycleClick}
        >
          <CalendarCheck className="w-10 h-10 text-purple-500 mb-4" />
          <span className="text-gray-700 font-medium text-lg text-center">10 Cycle</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Nav />
      <div className="mx-auto p-6 pt-20">
        {renderTrainingOptions()}
        <FileUploadComponent />
      </div>
    </>
  );
};

export default TrainingOptionsPage;