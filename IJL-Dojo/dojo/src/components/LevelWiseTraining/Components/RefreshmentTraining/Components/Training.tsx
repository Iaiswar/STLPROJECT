import React, { useState, useEffect } from 'react';
import { CheckCircle, UserX, Edit2, Save, X, Calendar, Play, BookOpen } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

interface TrainingCategory {
  id: number;
  name: string;
}

interface TrainingTopic {
  id: number;
  category: TrainingCategory;
  topic: string;
  description: string;
}

interface Trainer {
  id: number;
  name: string;
}

interface Venue {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
}

interface TrainingSession {
  id: number;
  training_category: TrainingCategory;
  training_name: TrainingTopic;
  trainer: Trainer;
  venue: Venue;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  date: string;
  time: string;
  employees: Employee[];
}

interface EmployeeStatus {
  id: number;
  schedule: number;
  employee: number;
  status: 'present' | 'absent' | 'rescheduled';
  notes?: string;
  reschedule_date?: string;
  reschedule_time?: string;
  reschedule_reason?: string;
  updated_at: string;
}

// NEW INTERFACE FOR EDITING STATE
type EditableEmployeeStatus = Omit<EmployeeStatus, 'status'> & {
  status: EmployeeStatus['status'] | ''; // Allow empty string for status
};

interface RescheduleLog {
  id: number;
  schedule: number;
  employee: number;
  original_date: string;
  original_time: string;
  new_date: string;
  new_time: string;
  reason: string;
  created_at: string;
}

interface TrainingProps {
  setActiveModule: (module: string) => void;
  setSelectedCategoryId: (categoryId: number | string | null) => void;
  setSelectedTopicId: (topicId: number | string | null) => void;
}

const Training: React.FC<TrainingProps> = ({
  setActiveModule,
  setSelectedCategoryId,
  setSelectedTopicId,
}) => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingCategories, setTrainingCategories] = useState<TrainingCategory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeStatuses, setEmployeeStatuses] = useState<EmployeeStatus[]>([]);
  const [rescheduleLogs, setRescheduleLogs] = useState<RescheduleLog[]>([]);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  // USE THE NEW EDITABLE INTERFACE HERE
  const [editingStatuses, setEditingStatuses] = useState<{ [key: string]: EditableEmployeeStatus }>({});
  const [showRescheduleForm, setShowRescheduleForm] = useState<string | null>(null);
  const [trainingTopics, setTrainingTopics] = useState<TrainingTopic[]>([]);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: '',
    reason: '',
  });

  // Fetch all data from backend
  useEffect(() => {
    fetchSessions();
    fetchCategories();
    fetchTopics();
    fetchEmployees();
    fetchEmployeeStatuses();
    fetchRescheduleLogs();
  }, []);

  const fetchSessions = async () => {
    const res = await fetch(`${API_BASE}/schedules/`);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setTrainingSessions(data);
    } else {
      console.error('Failed to fetch sessions:', res.status);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE}/training-categories/`);
    if (res.ok) setTrainingCategories(await res.json());
  };

  const fetchTopics = async () => {
    const res = await fetch(`${API_BASE}/curriculums/`);
    if (res.ok) setTrainingTopics(await res.json());
  };

  const fetchEmployees = async () => {
    const res = await fetch(`${API_BASE}/operators-master/`);
    if (res.ok) setEmployees(await res.json());
  };

  const fetchEmployeeStatuses = async () => {
    const res = await fetch(`${API_BASE}/attendances/`);
    if (res.ok) setEmployeeStatuses(await res.json());
  };

  const fetchRescheduleLogs = async () => {
    const res = await fetch(`${API_BASE}/reschedule-logs/`);
    if (res.ok) setRescheduleLogs(await res.json());
  };

  // Attendance helpers
  const getEmployeeStatus = (sessionId: number, employeeId: number): EmployeeStatus | undefined => {
    return employeeStatuses.find(
      status => status.schedule === sessionId && status.employee === employeeId
    );
  };

  const handleStatusUpdate = async (
    sessionId: number,
    employeeId: number,
    newStatus: EmployeeStatus['status'], // This should always be a valid status
    notes?: string
  ) => {
    const existing = getEmployeeStatus(sessionId, employeeId);
    const payload: any = { // Use 'any' for payload for flexibility with dynamic fields
      schedule: sessionId,
      employee: employeeId,
      status: newStatus,
      notes: notes || '',
    };

    // If rescheduled, add reschedule fields
    if (newStatus === 'rescheduled') {
      payload.reschedule_date = rescheduleForm.date;
      payload.reschedule_time = rescheduleForm.time;
      payload.reschedule_reason = rescheduleForm.reason;
    }

    const url = existing
      ? `${API_BASE}/attendances/${existing.id}/`
      : `${API_BASE}/attendances/`;
    const method = existing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchEmployeeStatuses();
      await fetchRescheduleLogs();
    } else {
      alert('Failed to update attendance');
    }
  };

  const handleReschedule = async (sessionId: number, employeeId: number) => {
    await handleStatusUpdate(sessionId, employeeId, 'rescheduled', rescheduleForm.reason);
    setShowRescheduleForm(null);
    setRescheduleForm({ date: '', time: '', reason: '' });
  };

  const startEditing = (sessionId: number, employeeId: number) => {
    const currentStatus = getEmployeeStatus(sessionId, employeeId);
    if (currentStatus) {
      setEditingStatuses(prev => ({
        ...prev,
        [`${sessionId}-${employeeId}`]: {
          ...currentStatus,
          status: currentStatus.status as EditableEmployeeStatus['status'] // Cast existing status to the broader type
        },
      }));
    } else {
      setEditingStatuses(prev => ({
        ...prev,
        [`${sessionId}-${employeeId}`]: {
          id: 0,
          schedule: sessionId,
          employee: employeeId,
          status: '', // Now this is allowed by EditableEmployeeStatus
          notes: '',
          updated_at: '',
        },
      }));
    }
  };

  const saveEdit = (sessionId: number, employeeId: number) => {
    const editKey = `${sessionId}-${employeeId}`;
    const editedStatus = editingStatuses[editKey];

    if (editedStatus) {
      // Ensure a status is selected before saving
      if (editedStatus.status === '') {
        alert('Please select a status for the employee.');
        return; // Prevent saving if status is empty
      }

      if (editedStatus.status === 'rescheduled') {
        setShowRescheduleForm(editKey);
      } else {
        // Cast editedStatus.status to EmployeeStatus['status'] as handleStatusUpdate expects it
        handleStatusUpdate(sessionId, employeeId, editedStatus.status as EmployeeStatus['status'], editedStatus.notes);
      }
    }
    setEditingStatuses(prev => {
      const newState = { ...prev };
      delete newState[editKey];
      return newState;
    });
  };

  const cancelEdit = (sessionId: number, employeeId: number) => {
    const editKey = `${sessionId}-${employeeId}`;
    setEditingStatuses(prev => {
      const newState = { ...prev };
      delete newState[editKey];
      return newState;
    });
  };

  const updateEditingStatus = (
    sessionId: number,
    employeeId: number,
    field: keyof EditableEmployeeStatus, // Use EditableEmployeeStatus keyof here
    value: any
  ) => {
    const editKey = `${sessionId}-${employeeId}`;
    setEditingStatuses(prev => ({
      ...prev,
      [editKey]: {
        ...prev[editKey],
        [field]: value,
      },
    }));
  };

  // Modified getStatusColor to handle empty string status
  const getStatusColor = (status: EmployeeStatus['status'] | '') => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '': // Handle empty string status for display
        return 'bg-gray-100 text-gray-400 border-gray-200'; // Neutral or placeholder color
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColors = (status: TrainingSession['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'; // Changed from green-100 to blue-100 for clarity
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Modified getStatusIcon to handle empty string status
  const getStatusIcon = (status: EmployeeStatus['status'] | '') => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <UserX className="w-4 h-4 text-red-600" />;
      case 'rescheduled':
        return <Calendar className="w-4 h-4 text-yellow-600" />;
      case '': // No icon for empty status
        return null;
      default:
        return null;
    }
  };


  const getSessionProgress = (session: TrainingSession) => {
    const statuses = session.employees.map(emp => getEmployeeStatus(session.id, emp.id));
    const present = statuses.filter(s => s && s.status === 'present').length;
    const absent = statuses.filter(s => s && s.status === 'absent').length;
    const rescheduled = statuses.filter(s => s && s.status === 'rescheduled').length;
    return { present, absent, rescheduled, total: session.employees.length };
  };

  // For navigation to Curriculum
  const handleStartTraining = (session: TrainingSession) => {
    setSelectedCategoryId(session.training_category.id);
    setSelectedTopicId(session.training_name.id);
    setActiveModule('curriculum');
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Training Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Sessions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Training Sessions</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {trainingSessions.map((session) => {
                const progress = getSessionProgress(session);
                return (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedSession?.id === session.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{session.training_name.topic}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColors(session.status)}`}>
                        {session.status}

                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <div>{session.training_category.name}</div>
                      <div>{session.trainer.name}</div>
                      <div>{session.date} • {session.time}</div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="text-green-600">✓ {progress.present}</div>
                      <div className="text-red-600">✗ {progress.absent}</div>
                      <div className="text-yellow-600">📅 {progress.rescheduled}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Management */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{selectedSession.training_name.topic}</h3>
                      <p className="text-sm text-gray-600">{selectedSession.training_category.name}</p>
                      <p className="text-sm text-gray-600">{selectedSession.trainer.name} • {selectedSession.venue.name}</p>
                      <p className="text-sm text-gray-600">{selectedSession.date} • {selectedSession.time}</p>
                    </div>
                    <button
                      onClick={() => handleStartTraining(selectedSession)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Training</span>
                    </button>
                  </div>
                  {/* Progress Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    {(() => {
                      const progress = getSessionProgress(selectedSession);
                      return (
                        <>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{progress.present}</div>
                            <div className="text-sm text-green-800">Present</div>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{progress.absent}</div>
                            <div className="text-sm text-red-800">Absent</div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{progress.rescheduled}</div>
                            <div className="text-sm text-yellow-800">Rescheduled</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {selectedSession.employees.map((employee) => {
                      const status = getEmployeeStatus(selectedSession.id, employee.id);
                      const editKey = `${selectedSession.id}-${employee.id}`;
                      const isEditing = editingStatuses[editKey];

                      return (
                        <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {/* Display icon for existing status, or null for empty */}
                              {getStatusIcon(status?.status || '')}
                              <div>
                                <h4 className="font-medium text-gray-800">{employee.full_name}</h4>
                                <p className="text-sm text-gray-600">Code: {employee.employee_code}</p>
                              </div>
                            </div>
                            {isEditing ? (
                              <div className="flex items-center space-x-2">
                                <select
                                  // Use isEditing.status (which can be empty string)
                                  value={isEditing.status}
                                  onChange={(e) => updateEditingStatus(selectedSession.id, employee.id, 'status', e.target.value)}
                                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                                >
                                  <option value="">-- Select Attendance --</option> {/* Added placeholder option */}
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                  <option value="rescheduled">Rescheduled</option>
                                </select>
                                <button
                                  // Disable save button if status is empty
                                  onClick={() => saveEdit(selectedSession.id, employee.id)}
                                  disabled={!isEditing.status}
                                  className={`text-green-600 hover:text-green-800 ${!isEditing.status ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => cancelEdit(selectedSession.id, employee.id)}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(status?.status || '')}`}>
                                  {status?.status || <span className="italic">Set Attendance</span>} {/* Display placeholder text if no status */}
                                </span>
                                <button
                                  onClick={() => startEditing(selectedSession.id, employee.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <div className="mt-3">
                              <textarea
                                value={isEditing.notes || ''}
                                onChange={(e) => updateEditingStatus(selectedSession.id, employee.id, 'notes', e.target.value)}
                                placeholder="Add notes..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                rows={2}
                              />
                            </div>
                          )}
                          {status?.notes && !isEditing && (
                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {status.notes}
                            </div>
                          )}
                          {/*  Rescheduled Card */}
                          {status?.status === 'rescheduled' && !isEditing && (
                            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-center mb-2">
                                <Calendar className="w-5 h-5 text-yellow-600 mr-2" />
                                <span className="font-semibold text-yellow-800">Rescheduled</span>
                              </div>
                              <div className="text-sm text-gray-700">
                                <div>
                                  <span className="font-medium">New Date:</span>{' '}
                                  {status.reschedule_date ? (
                                    <span>{status.reschedule_date}</span>
                                  ) : (
                                    <span className="italic text-gray-400">Not specified</span>
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium">New Time:</span>{' '}
                                  {status.reschedule_time ? (
                                    <span>{status.reschedule_time}</span>
                                  ) : (
                                    <span className="italic text-gray-400">Not specified</span>
                                  )}
                                </div>
                                <div>
                                  <span className="font-medium">Reason:</span>{' '}
                                  {status.reschedule_reason ? (
                                    <span>{status.reschedule_reason}</span>
                                  ) : (
                                    <span className="italic text-gray-400">Not specified</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Reschedule Form */}
                          {showRescheduleForm === `${selectedSession.id}-${employee.id}` && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <h5 className="font-medium text-yellow-800 mb-3">Reschedule Training</h5>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                                  <input
                                    type="date"
                                    value={rescheduleForm.date}
                                    onChange={(e) => setRescheduleForm(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                                  <input
                                    type="time"
                                    value={rescheduleForm.time}
                                    onChange={(e) => setRescheduleForm(prev => ({ ...prev, time: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  />
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea
                                  value={rescheduleForm.reason}
                                  onChange={(e) => setRescheduleForm(prev => ({ ...prev, reason: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                  rows={2}
                                  placeholder="Reason for rescheduling..."
                                />
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleReschedule(selectedSession.id, employee.id)}
                                  className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700"
                                >
                                  Confirm Reschedule
                                </button>
                                <button
                                  onClick={() => setShowRescheduleForm(null)}
                                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Training Selected</h3>
              <p className="text-gray-600">Select a training session from the left to manage participant status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Training;
