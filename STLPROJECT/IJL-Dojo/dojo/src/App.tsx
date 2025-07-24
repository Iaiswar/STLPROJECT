// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Management from './components/ManagementDashboard/management';
import { ContactForm } from './components/Demo/Demo';
import Demo2 from './components/Demo/Demon2';
import MyForm from './components/Demo/Demo3';
// import ObservationForm from './components/ObservationForm/ObservationForm';
import MESSummary from './components/MESSummary/Waste';
import WasteDetails from './components/WasteDetails/WasteDetails';
import CustomizableTable from './components/ObservationForm/ObservationForm';
import Method from './components/Method/method';
import MasterTable from './components/MasterTable/MasterTable';
import Training from './components/Training/Training';
import LoginForm from './components/Login/Login';
import AddUserForm from './components/user/user';
import OperatorLogin from './components/OperatorLogin/OperatorLogin';
import OperatorDashboard from './components/OperatorDashbaord/OperatorDashbaord';
import QuestionsList from './components/Questions/Questions';
import EvaluationTable from './components/Evaluation form/evaluation';
import ProcessDojo from './components/ProcessDojo/ProcessDojo';
import DojoDetail from './components/ProcessDojo/components/DojoDetail/DojoDetail';
import Evaluation from './components/Evaluation form/EvaluationTable';
import LevelTrainingPage from './components/LevelWiseTraining/Components/LevelTrainingPage/LevelTrainingPage';
import LevelWiseTraining from './components/LevelWiseTraining/LevelWiseTraining';
import LessonDetailsPage from './components/LevelWiseTraining/Components/LessonDetailsPage/LessonDetailsPage';
import PersonnelObservanceSheet from './components/LevelWiseTraining/Components/PersonnelObservanceSheet/PersonnelObservanceSheet';
import EmployeeSkillTraining from './components/LevelWiseTraining/Components/EmployeeSkillTraining/EmployeeSkillTraining';
import Lv2 from './components/LevelWiseTraining/Components/Lv2/Lv2';
// import AssignmentTracker from './components/AssignmentTracker/AssignmentTracker';
import QRScannerPage from './components/AssignmentTracker/AssignmentTracker';
import Lv2Section from './components/LevelWiseTraining/Components/Lv2/components/Lv2Section/Lv2Section';
import Lv2Subhead from './components/LevelWiseTraining/Components/Lv2/components/Lv2Subhead/Lv2Subhead';
import Home from './components/Homepage/home';
import TenCycleTable from './components/TenCycle/TenCycle';
import Retraining from './components/Retraining/Retraining';
// import DashboardRedirect from './components/DashboardRedirect/DashboardRedirect';
import Level3 from './components/LevelWiseTraining/Components/Level3/Level3';
import Level1 from './components/LevelWiseTraining/Components/Level1/Level1';
import Level1Detailed from './components/LevelWiseTraining/Components/Level1/Level1Detailed/Level1Detailed';
import Level2Content from './components/LevelWiseTraining/Components/Lv2/components/Level2Content/Level2Content';
import Level2LessonDetails from './components/LevelWiseTraining/Components/Lv2/components/Level2LessonDetails/Level2LessonDetails';
import ArVrComponent from './components/ArVrComponent/ArVrComponent';
import AppNotification from './components/Notifications/notification';
import MasterTableSettings from './components/MasterTable/MastertableSettings/mastertableSettings';
import MachineAllocations from './components/MachineAllocation/MachineAllocations';
import Machines from './components/MachineAllocation/Machine';
import ApprovalList from './components/ApprovalList/aprrovallist';
import { Quiz } from './components/MCQ/Quiz';
import { questions } from './components/MCQ/questions';
// import TrainingOptionsPage from './components/TrainingOptionsPage/TrainingOptionsPage';
import { AuthLayout } from './components/Login/AuthLayout/AuthLayout';
import ProtectedLayout from './components/Login/ProtectedLayout/ProtectedLayout';
import CycleCheckSheet from './components/CycleCheckSheet/CycleCheckSheet';
import SearchBarWithQRScanner from './components/LevelWiseTraining/Components/ChromeSearchBar/ChromeSearchBar';
import RemoteQuiz from './components/Evaluation Test/RemoteQuiz';
import QuestionForm from './components/Evaluation Test/QuestionForm';
import AssignEmployees from './components/Evaluation Test/AssignEmployees';
import QuizResults from './components/Evaluation Test/QuizResults';
import TestEnded from './components/Evaluation Test/TestEnded';
import InstructionsPage from './components/Evaluation Test/InstructionsPage';
import SkillNavigationDemo from './components/SkillNavigationDemo/SkillNavigationDemo';
import SkillMatrixUpdates from './components/SkillMatrixUpdates/SkillMatrixUpdates';
import Allocation from './components/Multi-Skilling Module/Allocation/allocation';
import Scheduling from './components/Multi-Skilling Module/Scheduling/scheduling';
import Report from './components/Report/report';

import MainLayout from './components/Layout/MainLayout';
import Level4 from './components/LevelWiseTraining/Components/Level4/Level4';
import RefreshmentTraining from './components/LevelWiseTraining/Components/RefreshmentTraining/Refreshment';
import EmployeeHistorySearch from './components/EmployeeHistorySearch/EmployeeHistorySearch';

import Advanced from './components/AdvancedManPower/advanced';

import TermsAndConditions from './components/TermsAndConditions/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import PrivacyPolicyVersionControl from './components/PrivacyPolicyVersionControl/PrivacyPolicyVersionControl';
import DownloadFiles from './components/DownloadFiles/DownloadFiles';
import Level3TrainingOptionsPage from './components/LevelWiseTraining/Components/Level3/Levl3TrainingOptionsPage/TrainingOptionsPage';
import TrainingOptionsPage from './components/LevelWiseTraining/Components/Lv2/components/TrainingOptionsPage/TrainingOptionsPage';

import SDC from './components/SDC/sdc';

import Hanchou from './components/LevelWiseTraining/Components/Hanchou/hanchou';
import Shokuchou from './components/LevelWiseTraining/Components/Shokuchou/Shokuchou';
import Level0 from './components/LevelWiseTraining/Components/Level0/Level0';
import TempEmployeeSearch from './components/LevelWiseTraining/Components/Level0/components/TempEmployeeSearch/TempEmployeeSearch';
import PassedUsersTable from './components/LevelWiseTraining/Components/Level0/components/PassedUsersTable/PassedUsersTable';
import SkillMatrixPage from './components/Skillmatrix/pages/SkillMatrixPage';


// import Level3TrainingOptionsPage from './'




function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/" element={<LoginForm />} />
            </Route>
            <Route element={<ProtectedLayout />}>
              <Route element={<MainLayout />}>

              <Route path="/home" element={<Home />} />
              <Route path="/management" element={<Management />} />
              {/* <Route path="/advanced" element={<DashboardRedirect />} /> */}
              <Route path="/advance" element={<Advanced />} />
              <Route path="/skillmatrix" element={<SkillMatrixPage />} />
              <Route path="/form" element={<ContactForm />} />
              <Route path="/demo" element={<Demo2 />} />
              <Route path="/demo1" element={<MyForm />} />
              <Route path="/ObservationForm" element={<CustomizableTable />} />
              <Route path="/MESSummary" element={<MESSummary />} />
              <Route path="/WasteDetails" element={<WasteDetails />} />
              <Route path="/methodsettings" element={<Method />} />
              <Route path="/MasterTable" element={<MasterTable />} />
              <Route path="/training" element={<Training />} />
              {/* <Route path='/login' element={<LoginForm />} /> */}
              <Route path='/user' element={<AddUserForm />} />
              <Route path="/OperatorLogin" element={<OperatorLogin />} />
              <Route path="/OperatorDashboard" element={<OperatorDashboard />} />
              <Route path='/QuestionsList' element={<QuestionsList />} />
              <Route path='/EvaluationTable' element={<EvaluationTable />} />
              <Route path='/Evaluation' element={<Evaluation />} />
              <Route path='/ProcessDojo' element={<ProcessDojo />} />
              <Route path="/dojo/:name" element={<DojoDetail />} />

              <Route path="/level-training" element={<LevelWiseTraining />} />
              <Route path="/level-training/:level" element={<LevelTrainingPage />} />
              <Route path="/lesson-details/:id" element={<LessonDetailsPage />} />
              <Route path="/dojoTraining/" element={<DojoDetail />} />
              <Route path="/PersonnelObservanceSheet" element={<PersonnelObservanceSheet />} />
              <Route path="/EmployeeSkillTraining" element={<EmployeeSkillTraining />} />
              <Route path='/lvl2' element={<Lv2 />} />
              <Route path='/QRScannerPage' element={<QRScannerPage />} />
              <Route path="/lvl2/section/:sectionId" element={<Lv2Section />} />
              <Route path="/lvl2/section/:sectionId/subheading/:subheadingId" element={<Lv2Subhead />} />
              <Route path="/tencycle" element={<TenCycleTable />} />
              <Route path="/retrain" element={<Retraining />} />

              <Route path='/Level3' element={<Level3 />} />
              <Route path='/Level1' element={<Level1 />} />
              <Route path='/Level1/:id' element={<Level1Detailed />} />
              <Route path='/lvl2' element={<Lv2 />} />
              <Route path="/lvl2/subtopics/:topicId" element={<Lv2Subhead />} />
              <Route path="/lvl2/units/:text/:id" element={<Level2Content />} />
              <Route path="/level2/:id" element={<Level2LessonDetails />} />
              <Route path='/Hanchou' element={<Hanchou />} />
              <Route path='/Shokuchou' element={<Shokuchou />} />
              <Route path="/EmployeeSkillTraining" element={<EmployeeSkillTraining />} />
              <Route path="/ArVrComponent" element={<ArVrComponent />} />
              <Route path="/dojoTraining" element={<DojoDetail />} />
              <Route path="/notification" element={<AppNotification />} />
              <Route path="/uploadMasterTable" element={<MasterTableSettings />} />


              <Route path="/machines" element={<Machines />} />
              <Route path="/machine-allocations" element={<MachineAllocations />} />
              <Route path="/approvallist" element={<ApprovalList />} />
              <Route path="/quiz" element={<Quiz questions={questions} />} />

              <Route path='/SearchBar' element={<SearchBarWithQRScanner />} />
              {/* <Route path="/TrainingOptionsPage" element={<TrainingOptionsPage />} /> */}
              <Route path="/CycleCheckSheet" element={<CycleCheckSheet />} />

              <Route path="/allocation" element={<Allocation />} />
              <Route path="/scheduling" element={<Scheduling />} />


             <Route path="/remote" element={<RemoteQuiz />} />
             <Route path="/add-question" element={<QuestionForm />} />
             <Route path="/assign-remote" element={<AssignEmployees />} />
             <Route path="/quiz-results" element={<QuizResults />} />
             <Route path="/test-ended" element={<TestEnded />} />
             <Route path="/quiz-instructions" element={<InstructionsPage />} />
             <Route path="/skill-navigation-demo" element={<SkillNavigationDemo />} />
             <Route path="/skill-matrix-updates" element={<SkillMatrixUpdates />} />
             <Route path="/sdc" element={<SDC />} />

             <Route path="/report" element={<Report />} />
             <Route path="/refreshment" element={<RefreshmentTraining />} />
             <Route path='/Level4' element={<Level4 />} />
             <Route path="/EmployeeHistorySearch" element={<EmployeeHistorySearch />} />
              <Route path="/DownloadFiles" element={<DownloadFiles />} />
              <Route path='/TermsAndConditions' element={<TermsAndConditions />} />
              <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
              <Route path='/VersionControl' element={<PrivacyPolicyVersionControl />} />

              <Route path="/TrainingOptionsPage" element={<TrainingOptionsPage />} /> 
              <Route path="/Level3TrainingOptionsPage" element={<Level3TrainingOptionsPage />} />
              <Route path='/Level0' element={<Level0 />} />
              <Route path='/TempEmployeeSearch' element={<TempEmployeeSearch />} />
              <Route path='/PassedUsersTable' element={<PassedUsersTable />} />

            </Route>
            </Route>
          </Routes>

        </div>
      </Router>
    </Provider>
  );
}

export default App; 
