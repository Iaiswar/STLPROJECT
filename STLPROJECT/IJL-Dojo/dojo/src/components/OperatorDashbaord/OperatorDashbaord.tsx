import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from 'axios';
import SubjectStatusCard from '../Training/Components/SubjectStatusCard/SubjectStatusCard';
import RefresherTrainingCard from '../Training/Components/RefresherTrainingCard/RefresherTrainingCard';
import PdfViewerCard from '../Training/Components/PdfViewerCard/PdfViewerCard';
import YouTubeVideoList from '../Training/Components/YouTubeVideoCard/YouTubeVideoCard';
import Statistics from '../Training/Components/AttendanceStatistics/statistics';
import { RootState } from '../../store/store';
import OperatorTestsViewer from './components/OperatorTestsViewer/OperatorTestsViewer';
// import TestCard from '../EmployeeDashboard/Training/TestCard/TestCard'; // Uncomment if needed



interface Training {
  id: number;
  group: number;
  plant: number;
  department: number;
  day: number;
  skill: number;
  training_name: string;
  video: string | null;
  pdf_attachment: string | null;
}

interface OperatorTraining {
  id: number;
  operator: number;
  training: Training;
  assigned_date: string;
}


interface OperatorTest {
  id: number;
  test: {
    id: number;
    title: string;
    description: string;
  };
  assigned_date: string;
}


const OperatorDashboard = () => {

  const [operatorTrainings, setOperatorTrainings] = useState<OperatorTraining[]>([]);


  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Access Redux store
  const operatorLogin = useSelector((state: any) => state.operatorLoginData);
  const sessionId = operatorLogin?.sessionId;
  console.log(sessionId)
  const employeeName = location.state?.employeeName;
  const [selectedProfile, setSelectedProfile] = useState(employeeName || 'Amit Sharma');

  useEffect(() => {
    if (employeeName) {
      setSelectedProfile(employeeName);
    }
  }, [employeeName]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/OperatorLogin');
  };


  axios.get('http://127.0.0.1:8000/operators/')
  .then(response => {
    console.log('Operators:', response.data);
  })
  .catch(error => {
    console.error('Error fetching operators:', error);
  });


  useEffect(() => {
    axios.get('http://127.0.0.1:8000/operator/trainings/', {
      headers: {
        'Session-Id': sessionId,
      },
    })
      .then(res => {
        console.log('Operator trainings:', res.data);
        setOperatorTrainings(res.data.results);
        // Do something with the data, e.g. set in state
      })
      .catch(err => {
        console.error('Error fetching operator trainings:', err);
      });
  }, []);

  // Dummy data (you can replace with dynamic API data if needed)
  const subjectsData = [
    { siNo: 1, subject: 'Know your Company', status: 'Completed', date: '2025-03-30' },
    { siNo: 2, subject: 'Safety Dojo', status: 'Completed', date: '2025-03-29' },
    { siNo: 3, subject: 'Senses Dojo', status: 'Upcoming', date: '2025-03-31' },
  ];

  const trainingsData = [
    { siNo: 1, topic: 'Know your Company', status: 'Upcoming', date: '2025-09-30' },
    { siNo: 2, topic: 'Safety Dojo', status: 'Upcoming', date: '2025-10-01' },
    { siNo: 3, topic: 'Senses Dojo', status: 'Pending', date: 'Not Fixed' },
  ];

  const pdfs = [
    { name: '1) Know your Company', url: '/pdf/1 Know your Company.pdf' },
    { name: '2) Safety Dojo', url: '/pdf/2 Safety Dojo.pdf' },
    { name: '3) Senses Dojo', url: '/pdf/3 Senses Dojo.pdf' },
    { name: '4) Product Dojo', url: '/pdf/4 Product Dojo.pdf' },
    { name: '5) Production Rule Dojo', url: '/pdf/5 Production Rule Dojo.pdf' },
    { name: '6) Process Dojo', url: '/pdf/6 Process Dojo.pdf' },
    { name: '7) Quality Dojo', url: '/pdf/7 Quality Dojo.pdf' },
    { name: '8) Maintenance Dojo', url: '/pdf/8 Maintenance Dojo.pdf' },
  ];

  const arVrVideos = [
    { videoId: 'rh4wLduNMwM', title: 'Fire Safety Training' },
    { videoId: '9zRnA28CRIU', title: 'CNC Milling' },
    { videoId: 'jNduP2Xm4_o', title: 'Machine Simulation' },
    { videoId: 'y3iMtPGC3dA', title: 'Training of CNC Machine' },
  ];

  const trainingVideos = [
    { videoId: 'ONSgr0l8Hac', title: 'React Tutorial' },
    { videoId: 'bHEdQWEtyKY', title: 'Modern React' },
    { videoId: 'XcUpTPbY4Wg', title: 'Next js' },
  ];


  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const operator = useSelector((state: RootState) => state.operatorLoginData);

  useEffect(() => {
    if (!operator.sessionId) return;

    axios.get('http://127.0.0.1:8000/operator/tests/', {
      headers: {
        'Session-Id': operator.sessionId, // ✅ custom header
      },
    })
      .then((res) => {
        setTests(res.data.results); // use `.results` if using DRF pagination
        setLoading(false);
        console.log('tests ...',res.data.results)
      })
      .catch((err) => {
        console.error('Failed to fetch operator tests:', err);
        setLoading(false);
      });
  }, [operator.sessionId]);

  const videoBaseURL = 'http://127.0.0.1:8000'; // Assuming you're running the backend locally
  return (
    <div className="flex flex-col p-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-5">
        <div className="flex items-center text-left text-lg font-bold uppercase tracking-wider bg-gradient-to-br from-gray-800 to-gray-700 p-3 rounded-tl-lg rounded-br-lg shadow-lg text-white mr-5 flex-1">
          <div>NL TECHNOLOGIES</div>
          <h1 className="text-lg ml-24">Operator Dashboard</h1>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-700 text-white border-none py-2 px-4 rounded cursor-pointer text-sm hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex flex-col gap-5 flex-1">
        {/* Row 1 */}
        <div className="flex justify-between gap-5">
          <SubjectStatusCard subjects={subjectsData} />
          <RefresherTrainingCard trainings={trainingsData} />
          {/* <TestCard selectedProfile={selectedProfile} /> */}
        </div>

        {/* Row 2 */}
        {/* <div className="flex justify-between gap-5">
          <PdfViewerCard pdfFiles={pdfs} />
          <YouTubeVideoList header="AR/VR Videos" videos={arVrVideos} />
          <YouTubeVideoList header="Training Videos" videos={trainingVideos} />
        </div> */}

        {/* Row 3 */}
        <div className="flex justify-between gap-5">
          <Statistics selectedProfile={selectedProfile} />

          <div className="flex-1 min-w-[200px] p-5 rounded-lg shadow-md bg-white">
            <OperatorTestsViewer />
          </div>

          <div className="flex-1 min-w-[200px] p-5 rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-bold mb-3">Notifications</h3>
            <p className="text-gray-600">Recent system notifications and alerts would appear here.</p>
          </div>


        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operatorTrainings.map((training: OperatorTraining) => (
            <div key={training.id} className="bg-gray-100 p-4 rounded shadow-lg">
              <h3 className="text-lg font-semibold">{training.training.training_name}</h3>
              <div className="mt-2">
                {/* Check if the video URL exists */}
                {training.training.video ? (
                  // Render video if URL is valid and ends with ".mp4"
                  training.training.video.endsWith('.mp4') ? (
                    <video width="100%" controls>
                      <source
                        src={`${videoBaseURL}${training.training.video}`} // Prepend base URL
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className="text-red-600">Unsupported video format</p> // Inform user if format is unsupported
                  )
                ) : (
                  <p className="text-gray-500">No video available</p> // Inform user if there's no video
                )}
              </div>
            </div>
          ))}
        </div>                                                                          

      </div>
    </div>
  );
};

export default OperatorDashboard;
