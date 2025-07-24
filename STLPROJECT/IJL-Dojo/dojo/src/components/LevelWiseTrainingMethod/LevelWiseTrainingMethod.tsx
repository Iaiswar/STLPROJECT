import React from "react";
import HQForm from "./Components/HQForm/HQForm";
import FactoryForm from "./Components/FactoryForm/FactoryForm";
import DepartmentForm from "./Components/DepartmentForm/DepartmentForm";
import LineForm from "./Components/LineForm/LineForm";
import LevelForm from "./Components/LevelForm/LevelForm";
import SkillTrainingForm from "./Components/SkillTrainingForm/SkillTrainingForm";
import DayForm from "./Components/DayForm/DayForm";
import SubTopicForm from "./Components/SubTopicForm/SubTopicForm";
import BatchCreation from "../Method/BatchCreation/BatchCreation";
// import TrainingContentComponent from "../Method/TrainingContentComponent/TrainingContentComponent";
import SubTopicContentForm from "./Components/SubTopicContentForm/SubTopicContentForm";
import LevelTwoSkillTrainingForm from "./Components/LevelTwoSkillTrainingForm/LevelTwoSkillTrainingForm";
import LevelTwoSectionForm from "./Components/LevelTwoSectionForm/LevelTwoSectionForm";
import LevelTwoTopicForm from "./Components/LevelTwoTopicForm/LevelTwoTopicForm";
import LevelTwoSubTopicForm from "./Components/LevelTwoSubTopicForm/LevelTwoSubTopicForm";
import LevelTwoUnitForm from "./Components/LevelTwoUnitForm/LevelTwoUnitForm";

import LevelTwoUnitContentForm from "./Components/Level2ContentForm/Level2ContentForm";



const LevelWiseTrainingMethod: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Level Wise Training Method</h1>
          {/* <HQForm /> */}
          {/* <FactoryForm /> */}
          {/* <DepartmentForm /> */}
          <LineForm />
          <LevelForm />
          <SkillTrainingForm />
          <DayForm />
          <SubTopicForm />
          <SubTopicContentForm />
          {/* <BatchCreation /> */}
          {/* <TrainingContentComponent /> */}
          <LevelTwoSkillTrainingForm />
          <LevelTwoSectionForm />
          <LevelTwoTopicForm />
          <LevelTwoSubTopicForm />
          {/* <LevelTwoUnitForm /> */}
          {/* <LevelTwoUnitContentForm /> */}
      </div>
    </div>
  );
};

export default LevelWiseTrainingMethod;