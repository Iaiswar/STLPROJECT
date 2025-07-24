import React from "react";
import HQForm from "../../LevelWiseTrainingMethod/Components/HQForm/HQForm";
import FactoryForm from "../../LevelWiseTrainingMethod/Components/FactoryForm/FactoryForm";
import DepartmentForm from "../../LevelWiseTrainingMethod/Components/DepartmentForm/DepartmentForm";
import CompanyLogoUpload from "../CompanyLogoUpload/CompanyLogoUpload";

// import EmployeeAssignmentForm from "../Method/EmployeeAssignmentForm/EmployeeAssignmentForm";

const GeneralSettingsMethod: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">General Settings </h1>
                <CompanyLogoUpload />
                <HQForm />
                <FactoryForm />
                <DepartmentForm />
            </div>
        </div>
    );
};

export default GeneralSettingsMethod;