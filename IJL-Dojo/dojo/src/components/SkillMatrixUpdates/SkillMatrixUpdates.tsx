import React, { useEffect, useState } from 'react';
import { User, Award, Clock, TrendingUp } from 'lucide-react';

interface SkillMatrixUpdate {
  employee_name: string;
  employee_code: string;
  skill_name: string;
  test_level: number;
  current_skill_level: number;
  test_date: string;
  test_percentage: number;
  test_name: string;
}

interface EmployeeSkillMatrix {
  employee_name: string;
  employee_code: string;
  skill_name: string;
  current_level: number;
  department: string;
  last_updated: string;
}

const SkillMatrixUpdates: React.FC = () => {
  const [recentUpdates, setRecentUpdates] = useState<SkillMatrixUpdate[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [employeeSkills, setEmployeeSkills] = useState<EmployeeSkillMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentUpdates();
  }, []);

  const fetchRecentUpdates = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/recent-skill-updates/');
      if (!response.ok) throw new Error('Failed to fetch recent updates');
      const data = await response.json();
      setRecentUpdates(data);
    } catch (err) {
      setError('Failed to load recent skill matrix updates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeSkills = async (employeeId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/employee-skill-matrix/${employeeId}/`);
      if (!response.ok) throw new Error('Failed to fetch employee skills');
      const data = await response.json();
      setEmployeeSkills(data);
    } catch (err) {
      setError('Failed to load employee skill matrix');
      console.error(err);
    }
  };

  const handleEmployeeSelect = (employeeCode: string) => {
    setSelectedEmployee(employeeCode);
    // Find employee ID from recent updates (you might want to create a separate endpoint for this)
    const employee = recentUpdates.find(update => update.employee_code === employeeCode);
    if (employee) {
      // For demo purposes, we'll use employee code as ID
      // In production, you'd want to fetch the actual employee ID
      fetchEmployeeSkills(employeeCode);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-green-100 text-green-800';
      case 4: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Skill Matrix Updates
        </h1>
        <p className="text-gray-600">
          View automatic skill matrix updates from quiz completions
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Recent Updates Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Recent Skill Matrix Updates
        </h2>
        
        {recentUpdates.length === 0 ? (
          <p className="text-gray-500">No recent skill matrix updates found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Employee</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Skill</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Test Level</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Current Level</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Score</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUpdates.map((update, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">{update.employee_name}</div>
                          <div className="text-sm text-gray-500">{update.employee_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{update.skill_name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(update.test_level)}`}>
                        Level {update.test_level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(update.current_skill_level)}`}>
                        Level {update.current_skill_level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1 text-green-500" />
                        <span className="text-sm font-medium text-green-600">{update.test_percentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(update.test_date)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEmployeeSelect(update.employee_code)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Skill Matrix Details */}
      {selectedEmployee && employeeSkills.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Skill Matrix for {employeeSkills[0]?.employee_name} ({selectedEmployee})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employeeSkills.map((skill, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{skill.skill_name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Level:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.current_level)}`}>
                      Level {skill.current_level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Department:</span>
                    <span className="text-sm text-gray-900">{skill.department}</span>
                  </div>
                  {skill.last_updated && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Updated:</span>
                      <span className="text-sm text-gray-900">{formatDate(skill.last_updated)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillMatrixUpdates;
