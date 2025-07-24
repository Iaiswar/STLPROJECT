// import { MonthlySkillEvaluationForm } from "./MonthlySkills";
import OperationsCard from "./OperationsCard";
// import OperatorLevelsComponent from "./OperatorLevelsCard";
import SectionCard from "./SectionCard";
import SkillMatrixCard from "./SkillMatrixCard";

const SkillMatrixForm = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Skill Matrix Settings </h1>
        <div className="flex flex-col gap-2">
          <SkillMatrixCard />
          <SectionCard />
          <OperationsCard />
          {/* <OperatorLevelsComponent /> */}
          {/* <MonthlySkillEvaluationForm />  */}
        </div>
      </div>
    </div>
  );
};

export default SkillMatrixForm;
