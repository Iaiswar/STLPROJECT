import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Employee {
  id: number;
  full_name: string;
  department: string;
  employee_code: string
}


interface QuestionPaper {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  skill: string;
}

interface Level {
  id: number;
  name: string;
}

interface AssignmentDetails {
  employee_id: number | null;
  searchQuery?: string;
}

interface LocationState {
  questionPaperId?: number;
  skillId?: number;
  levelId?: number;
  skillName?: string;
  levelName?: string;
  fromNavigation?: boolean;
}

const AssignEmployees: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get navigation state
  const locationState = location.state as LocationState;
  const fromNavigation = locationState?.fromNavigation || false;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(
    locationState?.questionPaperId ?? null
  );

  const [skillIds, setSkillIds] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(
    locationState?.skillId ?? null
  );

  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(
    locationState?.levelId ?? null
  );



  // const [globalLevelId, setGlobalLevelId] = useState<number | null>(null);
  const [globalSkill, setGlobalSkill] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, AssignmentDetails>>({});
  const [remoteInputs, setRemoteInputs] = useState<string[]>([]);
  const [newRemote, setNewRemote] = useState('');
  const now = new Date();
  const formattedDate = now.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(',', '');

  const formattedTime = now.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const selectedPaperName = questionPapers.find(p => p.id === selectedPaperId)?.name || 'Test';
  const selectedSkillName = skillIds.find(p => p.id === selectedSkillId)?.skill || 'Skill';

  const testName = `${selectedPaperName} ${formattedDate} ${formattedTime}`;
  const skillName = `${selectedSkillName} ${formattedDate} ${formattedTime}`;
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (location.state && location.state.questionPaperId) {
      setSelectedPaperId(location.state.questionPaperId)
    }
  }, [location.state]);
  useEffect(() => {
    if (location.state && location.state.skillId) {
      setSelectedSkillId(location.state.skillId)
    }
  }, [location.state]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/operators-master/')
      .then(res => res.json())
      .then(setEmployees)
      .catch(() => setMessage('Failed to load employees'));

    fetch('http://127.0.0.1:8000/levels/')
      .then(res => res.json())
      .then(setLevels)
      .catch(() => setMessage('Failed to load levels'));

    fetch('http://127.0.0.1:8000/api/skills')
      .then(res => res.json())
      .then(setSkillIds)
      .catch(() => setMessage('Failed to load skills'));

    fetch('http://127.0.0.1:8000/api/question-papers/')
      .then(res => res.json())
      .then(setQuestionPapers)
      .catch(() => setMessage('Failed to load question papers'));
  }, []);

  // Display navigation context info
  useEffect(() => {
    if (fromNavigation) {
      setMessage(`Skill and level pre-filled from navigation context. Skill: ${locationState?.skillName || 'Unknown'}, Level: ${locationState?.levelName || 'Unknown'}`);
    }
  }, [fromNavigation, locationState]);

  const handleAddRemote = () => {
    const trimmed = newRemote.trim();
    if (trimmed && !remoteInputs.includes(trimmed)) {
      setRemoteInputs(prev => [...prev, trimmed]);
      setNewRemote('');
    }
  };

  const handleRemoveRemote = (remoteId: string) => {
    setRemoteInputs(prev => prev.filter(id => id !== remoteId));
    setAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[remoteId];
      return newAssignments;
    });
  };

  const handleAssignmentChange = (
    key_id: string,
    field: keyof AssignmentDetails,
    value: number | null
  ) => {
    setAssignments(prev => ({
      ...prev,
      [key_id]: {
        ...prev[key_id],
        [field]: value,
      },
    }));
  };

  const handleStartTest = async () => {
    if (!testName.trim()) {
      setMessage('Please enter a test name.');
      return;
    }

    if (!selectedPaperId) {
      setMessage('Please select a question paper.');
      return;
    }

    if (!selectedSkillId) {
      setMessage('Please select a skill.');
      return;
    }

    // Level is optional but recommended
    if (!fromNavigation && !selectedLevelId) {
      setMessage('Please select a level.');
      return;
    }

    for (const key_id of Object.keys(assignments)) {
      const a = assignments[key_id];
      if (!a.employee_id) {
        setMessage(`Please assign an employee for remote ${key_id}.`);
        return;
      }
    }

    const payload = {
      test_name: testName.trim(),
      paper_id: selectedPaperId,  // Use paper_id to match backend expectation
      skill_id: selectedSkillId,
      level_id: selectedLevelId,
      assignments: assignments,  // Send as dictionary, backend will handle conversion
    };

    try {
      setIsLoading(true);
      setMessage(null);

      const res = await fetch('http://127.0.0.1:8000/api/start-test/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate('/quiz-instructions', {
          state: {
            paperId: selectedPaperId,
            skillId: selectedSkillId,
            levelId: selectedLevelId
          }
        });
      }
      else {
        const errorData = await res.json();
        setMessage(`Failed to start test: ${JSON.stringify(errorData)}`);
      }
    } catch {
      setMessage('Network error while starting the test.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = testName.trim() && selectedPaperId && Object.keys(assignments).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          }
          .glass-input {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .glass-input:focus {
            background: rgba(255, 255, 255, 0.9);
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          }
          .remote-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease;
          }
          .remote-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in {
            animation: slideIn 0.5s ease-out;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .icon-glow {
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
          }
          .floating-shapes {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
          }
          .shape {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
            animation: float 20s infinite ease-in-out;
          }
          .shape:nth-child(1) {
            width: 300px;
            height: 300px;
            top: 10%;
            left: 10%;
            animation-delay: -2s;
          }
          .shape:nth-child(2) {
            width: 200px;
            height: 200px;
            top: 60%;
            right: 10%;
            animation-delay: -8s;
          }
          .shape:nth-child(3) {
            width: 150px;
            height: 150px;
            bottom: 20%;
            left: 50%;
            animation-delay: -15s;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(120deg); }
            66% { transform: translateY(20px) rotate(240deg); }
          }
          .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 3px;
            transition: width 0.3s ease;
          }
        `
      }} />

      {/* Background Shapes */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 icon-glow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
              Test Assignment Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Configure and assign employees to remote testing stations
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Setup Progress</span>
                <span className="text-sm font-medium text-blue-600">
                  {[testName.trim(), selectedPaperId].filter(Boolean).length}/2 Complete
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${([testName.trim(), selectedPaperId].filter(Boolean).length / 2) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="glass-card rounded-2xl p-8 animate-slide-in">
            <div className="space-y-8">
              {/* Test Configuration Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  Test Configuration
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Test Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium bg-gray-100 cursor-not-allowed"
                      value={testName}
                      readOnly
                    />
                  </div>

                  {/* Question Paper */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Paper
                    </label>
                    <p className="px-4 py-3 bg-gray-100 rounded-xl text-gray-700">
                      {questionPapers.find(p => p.id === selectedPaperId)?.name || 'N/A'}
                    </p>
                    <input type="hidden" name="question_paper_id" value={selectedPaperId ?? ''} />
                  </div> */}
                  {/* Skill */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skill {fromNavigation && <span className="text-green-600">(Pre-filled)</span>}
                    </label>
                    <select
                      className={`w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium ${fromNavigation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      value={selectedSkillId ?? ''}
                      onChange={(e) => setSelectedSkillId(Number(e.target.value))}
                      disabled={fromNavigation}
                    >
                      <option value="" disabled>Select a skill</option>
                      {skillIds.map(skill => (
                        <option key={skill.id} value={skill.id}>
                          {skill.skill}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level {fromNavigation && <span className="text-green-600">(Pre-filled)</span>}
                    </label>
                    <select
                      className={`w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium ${fromNavigation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      value={selectedLevelId ?? ''}
                      onChange={(e) => setSelectedLevelId(Number(e.target.value))}
                      disabled={fromNavigation}
                    >
                      <option value="" disabled>Select a level</option>
                      {levels.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Remote Management Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  Remote Stations
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Remote Station
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium placeholder-gray-500 focus:outline-none"
                      placeholder="Enter Remote ID or Scan QR"
                      value={newRemote}
                      onChange={(e) => setNewRemote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddRemote()}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddRemote}
                      disabled={!newRemote.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Remote</span>
                    </button>
                  </div>
                </div>

                {/* Remote Assignments */}
                {remoteInputs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No remote stations added yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add remote stations to assign employees</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remoteInputs.map((key_id, index) => {
                      const assign = assignments[key_id] || { employee_id: null };
                      const selectedEmployee = employees.find(e => e.id === assign.employee_id);

                      return (
                        <div
                          key={key_id}
                          className="remote-card rounded-xl p-6 animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{key_id}</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">Remote {key_id}</h3>
                                {selectedEmployee && (
                                  <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveRemote(key_id)}
                              className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                            >
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Assign Employee
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search employee by name or pay code"
                                className="w-full px-3 py-2 glass-input rounded-lg text-gray-800 font-medium focus:outline-none"
                                value={
                                  assign.employee_id
                                    ? employees.find(e => e.id === assign.employee_id)?.employee_code || ''
                                    : assignments[key_id]?.searchQuery || ''
                                }
                                onChange={(e) => {
                                  const input = e.target.value;
                                  handleAssignmentChange(key_id, 'employee_id', null); // Clear selection
                                  setAssignments(prev => ({
                                    ...prev,
                                    [key_id]: {
                                      ...prev[key_id],
                                      searchQuery: input,
                                    },
                                  }));
                                }}
                              />
                              {assignments[key_id]?.searchQuery?.trim() && (
                                <ul className="absolute left-0 right-0 bg-white shadow-xl rounded-lg mt-1 z-50 max-h-60 overflow-y-auto border border-gray-200">
                                  {employees
                                    .filter(emp => {
                                      const q = assignments[key_id]?.searchQuery?.toLowerCase() || '';
                                      const isAlreadyAssigned = Object.entries(assignments).some(
                                        ([otherKey, details]) =>
                                          otherKey !== key_id && details.employee_id === emp.id
                                      );
                                      return (
                                        !isAlreadyAssigned &&
                                        (emp.full_name.toLowerCase().includes(q) ||
                                          emp.employee_code.toLowerCase().includes(q))
                                      );
                                    })
                                    .map(emp => (
                                      <li
                                        key={emp.id}
                                        onClick={() => {
                                          handleAssignmentChange(key_id, 'employee_id', emp.id);
                                          setAssignments(prev => ({
                                            ...prev,
                                            [key_id]: {
                                              employee_id: emp.id,
                                              searchQuery: '', // Clear query after selection
                                            },
                                          }));
                                        }}
                                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                      >
                                        {emp.employee_code} - {emp.full_name}
                                      </li>
                                    ))}
                                  {employees.filter(emp => {
                                    const q = assignments[key_id]?.searchQuery?.toLowerCase() || '';
                                    const isAlreadyAssigned = Object.entries(assignments).some(
                                      ([otherKey, details]) =>
                                        otherKey !== key_id && details.employee_id === emp.id
                                    );
                                    return (
                                      !isAlreadyAssigned &&
                                      (emp.full_name.toLowerCase().includes(q) ||
                                        emp.employee_code.toLowerCase().includes(q))
                                    );
                                  }).length === 0 && (
                                      <li className="px-4 py-2 text-gray-500">No matches found</li>
                                    )}
                                </ul>
                              )}
                            </div>
                          </div>


                          {selectedEmployee && (
                            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-green-800">
                                  {selectedEmployee.full_name} assigned
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Message */}
              {message && (
                <div className="animate-fade-in">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 mb-1">Action Required</h3>
                      <p className="text-sm text-red-700">{message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartTest}
                  disabled={isLoading || !isFormValid}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Starting Test...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
                      </svg>
                      <span>Start Test</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignEmployees;