import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./method.module.css";
// import DigitalDashboard from "../DigitalDashboard/DigitalDashboard";
// import AdvancedDashboardSettings from "../DashboardNew/MainContents/DashboardSettings/DashboardSettings";
import DigitalSettings from "../DigitalDashboard/ManagementSettings/digitalsettings";
// import PresentationUpload from "../Presentation/PresentationUpload";
import GroupCreate from "./GroupSettings/GroupCreate";
import PlantCreate from "./Plantsettings/PlantCreate";
import DepartmentCreate from "./DepartmentSettings/DepartmentCreate";
import DayCreate from "./DaysSettings/DateSettings";

import TestUpload from "../Quizzes/Quizzes";
import OperatorTrainingAssignmentForm from "../OperatorAssignments/OperatorAssignments";
import OperatorTestAssignmentForm from "./OperatorTestAssignmentForm/OperatorTestAssignmentForm";
import MachineAllocationSettings from "../MachineAllocationSettings/MachineAllocationSettings";
import ManRelatedDefectForm from "./ManRelatedDefectForm/ManRelatedDefectForm";
import LevelWiseTrainingMethod from "../LevelWiseTrainingMethod/LevelWiseTrainingMethod";
import SkillMatrixForm from "./skillsettings/skillsettings";
import AddUserForm from "../user/user";
import GeneralSettingsMethod from "./GeneralSettings/GeneralSettings";

import AdvancedSettings from "./AdvancedManpower/advancedSettings";
import MasterTableSettings from "../MasterTable/MastertableSettings/mastertableSettings";
import QuestionForm from "../Evaluation Test/QuestionForm";
import BiometricTable from "../Biometric/biometric";

interface TabData {
	name: string;
	path: string;
	state?: any;
	component: React.ReactNode;
}

const Method: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const PlaceholderComponent: React.FC<{ title: string }> = ({ title }) => (
		<div className='p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-4'>
			<h2 className='text-xl font-semibold text-gray-800'>
				{title} Content
			</h2>
			<p className='text-gray-600'>
				This is the {title} component placeholder. Replace with actual
				component content.
			</p>

			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<GroupCreate />
				<PlantCreate />
				<DepartmentCreate />
				<DayCreate />
				{/* <TrainingSkillCreate /> */}
				<TestUpload />
				<OperatorTrainingAssignmentForm />
				<OperatorTestAssignmentForm />
				<ManRelatedDefectForm />
			</div>
		</div>
	);

	const tabs: TabData[] = [
		{
            name: "Management Review Dashboard Settings",
            path: "/methodsettings",
            state: { tab: "digitalDashboard" },
            component: ( <DigitalSettings/> )
        },
        {
            name: "Advance Manpower Dashboard Settings",
            path: "/methodsettings",
            state: { tab: "advanceManpower" },
            component: <AdvancedSettings />
        },
        {
            name: "General Settings",
            path: "/methodsettings",
            state: { tab: "generalSettings" },
            component: <GeneralSettingsMethod />
        },
        {
            name: "Master Table Settings",
            path: "/methodsettings",
            state: { tab: "masterTableSettings" },
            component: <MasterTableSettings />
        },
        
        // {
        //     name: "Biometric Table",
        //     path: "/methodsettings",
        //     state: { tab: "biometricTable" },
        //     component: <BiometricTable />
        // },
        {
            name: "Skill Matrix Settings",
            path: "/methodsettings",
            state: { tab: "skillMatrix" },
            component: <SkillMatrixForm />
        },
        {
            name: "Level Wise Training",
            path: "/methodsettings",
            state: { tab: "levelWiseTraining" },
            component: <LevelWiseTrainingMethod />
       },
        {
            name: "Quiz Questions",
            path: "/methodsettings",
            state: { tab: "quizQuestion" },
            component: <QuestionForm />
        },
        {
            name: "New User",
            path: "/methodsettings",
            state: { tab: "newUser" },
            component: <AddUserForm />
        },
	];

	// Determine which tab is active based on location state
	const getInitialActiveTab = (): string => {
		if (location.state && location.state.tab) {
			const tabMap: { [key: string]: string } = {
				digitalDashboard: "Management Review Dashboard Settings",
                advanceManpower: "Advance Manpower Dashboard Settings",
                skillMatrix: "Skill Matrix Settings",
                master: "Master Table Settings",
                machineAllocation: "Machine Allocation Settings",
                employee: "Employee Settings",
                levelWiseTraining : "Level Wise Training",
                presentationUpload: "PresentationUpload",
                newUser:'New User',
                quizQuestion:'Quiz Questions',
                generalSettings:'General Settings',
                masterTableSettings:'Master Table Settings',
                // biometricTable:'Biometric Table',
			};
			return tabMap[location.state.tab] || "Digital Dashboard Settings";
		}

		// Default to Digital Dashboard Settings
		return "Management Review Dashboard Settings";
	};

	// State for the active tab
	const [activeTab, setActiveTab] = useState<string>(getInitialActiveTab());

	// Update active tab when location changes
	useEffect(() => {
		setActiveTab(getInitialActiveTab());
	}, [location.state]);

	// Handle tab click - update state and URL without redirecting to a new page
	const handleTabClick = (tab: TabData) => {
		setActiveTab(tab.name);

		// Use replace to avoid building up history entries
		navigate(tab.path, {
			state: tab.state,
			replace: true,
		});
	};

	// Find the current active tab data
	const activeTabData = tabs.find((tab) => tab.name === activeTab);

	return (
		<div className={styles.methodContainer}>
			<div className={styles.tabsContainer}>
				{tabs.map((tab) => (
					<button
						key={tab.name}
						className={`${styles.tabButton} ${
							activeTab === tab.name ? styles.activeTab : ""
						}`}
						onClick={() => handleTabClick(tab)}
					>
						{tab.name}
					</button>
				))}
			</div>

			<div className={styles.tabContent}>{activeTabData?.component}</div>
		</div>
	);
};

export default Method;



// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import styles from "./method.module.css";
// import DigitalDashboard from "../DigitalDashboard/DigitalDashboard";
// import AdvancedDashboardSettings from "../DashboardNew/MainContents/DashboardSettings/DashboardSettings";
// import DigitalSettings from "../DigitalDashboard/ManagementSettings/digitalsettings";
// // import PresentationUpload from "../Presentation/PresentationUpload";
// import GroupCreate from "./GroupSettings/GroupCreate";
// import PlantCreate from "./Plantsettings/PlantCreate";
// import DepartmentCreate from "./DepartmentSettings/DepartmentCreate";
// import DayCreate from "./DaysSettings/DateSettings";

// import TestUpload from "../Quizzes/Quizzes";
// import OperatorTrainingAssignmentForm from "../OperatorAssignments/OperatorAssignments";
// import OperatorTestAssignmentForm from "./OperatorTestAssignmentForm/OperatorTestAssignmentForm";
// import MachineAllocationSettings from "../MachineAllocationSettings/MachineAllocationSettings";
// import ManRelatedDefectForm from "./ManRelatedDefectForm/ManRelatedDefectForm";
// import LevelWiseTrainingMethod from "../LevelWiseTrainingMethod/LevelWiseTrainingMethod";
// import SkillMatrixForm from "./skillsettings/skillsettings";
// import AddUserForm from "../user/user";
// import GeneralSettingsMethod from "./GeneralSettings/GeneralSettings";

// import AdvancedSettings from "./AdvancedManpower/advancedSettings";
// import MasterTableSettings from "../MasterTable/MastertableSettings/mastertableSettings";
// import QuestionForm from "../Evaluation Test/QuestionForm";
// import BiometricTable from "../Biometric/biometric";

// interface TabData {
// 	name: string;
// 	path: string;
// 	state?: any;
// 	component: React.ReactNode;
// }

// const Method: React.FC = () => {
// 	const navigate = useNavigate();
// 	const location = useLocation();

// 	useEffect(() => {
// 		window.scrollTo(0, 0);
// 	}, []);

// 	const PlaceholderComponent: React.FC<{ title: string }> = ({ title }) => (
// 		<div className='p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-4'>
// 			<h2 className='text-xl font-semibold text-gray-800'>
// 				{title} Content
// 			</h2>
// 			<p className='text-gray-600'>
// 				This is the {title} component placeholder. Replace with actual
// 				component content.
// 			</p>

// 			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
// 				<GroupCreate />
// 				<PlantCreate />
// 				<DepartmentCreate />
// 				<DayCreate />
// 				{/* <TrainingSkillCreate /> */}
// 				<TestUpload />
// 				<OperatorTrainingAssignmentForm />
// 				<OperatorTestAssignmentForm />
// 				<ManRelatedDefectForm />
// 			</div>
// 		</div>
// 	);

// 	const tabs: TabData[] = [
// 		{
//             name: "Management Review Dashboard Settings",
//             path: "/methodsettings",
//             state: { tab: "digitalDashboard" },
//             component: ( <DigitalSettings/> )
//         },
//         {
//             name: "Advance Manpower Dashboard Settings",
//             path: "/methodsettings",
//             state: { tab: "advanceManpower" },
//             component: <AdvancedSettings />
//         },
//         {
//             name: "General Settings",
//             path: "/methodsettings",
//             state: { tab: "generalSettings" },
//             component: <GeneralSettingsMethod />
//         },
//         {
//             name: "Master Table Settings",
//             path: "/methodsettings",
//             state: { tab: "masterTableSettings" },
//             component: <MasterTableSettings />
//         },
        
//         {
//             name: "Biometric Table",
//             path: "/methodsettings",
//             state: { tab: "biometricTable" },
//             component: <BiometricTable />
//         },
//         {
//             name: "Skill Matrix Settings",
//             path: "/methodsettings",
//             state: { tab: "skillMatrix" },
//             component: <SkillMatrixForm />
//         },
//         {
//             name: "Level Wise Training",
//             path: "/methodsettings",
//             state: { tab: "levelWiseTraining" },
//             component: <LevelWiseTrainingMethod />
//        },
//         {
//             name: "Quiz Questions",
//             path: "/methodsettings",
//             state: { tab: "quizQuestion" },
//             component: <QuestionForm />
//         },
//         {
//             name: "New User",
//             path: "/methodsettings",
//             state: { tab: "newUser" },
//             component: <AddUserForm />
//         },
// 	];

// 	// Determine which tab is active based on location state
// 	const getInitialActiveTab = (): string => {
// 		if (location.state && location.state.tab) {
// 			const tabMap: { [key: string]: string } = {
// 				digitalDashboard: "Management Review Dashboard Settings",
//                 advanceManpower: "Advance Manpower Dashboard Settings",
//                 skillMatrix: "Skill Matrix Settings",
//                 master: "Master Settings",
//                 machineAllocation: "Machine Allocation Settings",
//                 employee: "Employee Settings",
//                 levelWiseTraining : "Level Wise Training",
//                 presentationUpload: "PresentationUpload",
//                 newUser:'New User',
//                 quizQuestion:'Quiz Questions',
//                 generalSettings:'General Settings',
//                 masterTableSettings:'Master Table Settings',
//                 // biometricTable:'Biometric Table',
// 			};
// 			return tabMap[location.state.tab] || "Digital Dashboard Settings";
// 		}

// 		// Default to Digital Dashboard Settings
// 		return "Digital Dashboard Settings";
// 	};

// 	// State for the active tab
// 	const [activeTab, setActiveTab] = useState<string>(getInitialActiveTab());

// 	// Update active tab when location changes
// 	useEffect(() => {
// 		setActiveTab(getInitialActiveTab());
// 	}, [location.state]);

// 	// Handle tab click - update state and URL without redirecting to a new page
// 	const handleTabClick = (tab: TabData) => {
// 		setActiveTab(tab.name);

// 		// Use replace to avoid building up history entries
// 		navigate(tab.path, {
// 			state: tab.state,
// 			replace: true,
// 		});
// 	};

// 	// Find the current active tab data
// 	const activeTabData = tabs.find((tab) => tab.name === activeTab);

// 	return (
// 		<div className={styles.methodContainer}>
// 			<div className={styles.tabsContainer}>
// 				{tabs.map((tab) => (
// 					<button
// 						key={tab.name}
// 						className={`${styles.tabButton} ${
// 							activeTab === tab.name ? styles.activeTab : ""
// 						}`}
// 						onClick={() => handleTabClick(tab)}
// 					>
// 						{tab.name}
// 					</button>
// 				))}
// 			</div>

// 			<div className={styles.tabContent}>{activeTabData?.component}</div>
// 		</div>
// 	);
// };

// export default Method;
