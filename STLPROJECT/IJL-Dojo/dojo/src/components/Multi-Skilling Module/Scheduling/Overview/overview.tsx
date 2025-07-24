import { useState, useEffect } from 'react';
import { useSkillFilter } from './SkillFilterContext';

interface Skill {
  id: number;
  current_status: 'scheduled' | 'in-progress' | 'completed' | string;
}

interface EmployeeSkills {
  employee: number;
  skills: Skill[];
}

interface Stats {
  scheduled: number;
  in_progress: number;
  completed: number;
  total: number;
}

const Overview = () => {
  const {
    statusFilter,
    dateFilter,
    setStatusFilter,
    setDateFilter,
    stats,
    setStats,
  } = useSkillFilter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/scheduled-employees-skills/');
        if (!response.ok) throw new Error('Failed to fetch stats');

        const data: EmployeeSkills[] = await response.json();

        let scheduledCount = 0;
        let inProgressCount = 0;
        let completedCount = 0;
        let totalSkills = 0;

        data.forEach(employee => {
          if (employee.skills && Array.isArray(employee.skills)) {
            employee.skills.forEach(skill => {
              totalSkills++;
              switch (skill.current_status) {
                case 'scheduled':
                  scheduledCount++;
                  break;
                case 'in-progress':
                  inProgressCount++;
                  break;
                case 'completed':
                  completedCount++;
                  break;
                default:
                  break;
              }
            });
          }
        });

        setStats({
          scheduled: scheduledCount,
          in_progress: inProgressCount,
          completed: completedCount,
          total: totalSkills,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [setStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Skill Scheduling Overview</h1>
          <p className="text-gray-600 text-lg">
            Monitor and track skill development across your organization
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-full mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Filter & Search</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="status-filter"
                className="flex items-center text-sm font-semibold text-gray-700"
              >
                <svg
                  className="w-4 h-4 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Filter by Status
              </label>
              <select
                id="status-filter"
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium shadow-sm"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">🔍 All Status</option>
                <option value="scheduled">📅 Scheduled</option>
                <option value="in-progress">⚡ In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="date-filter"
                className="flex items-center text-sm font-semibold text-gray-700"
              >
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Filter by Date Range
              </label>
              <select
                id="date-filter"
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-300 font-medium shadow-sm"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
              >
                <option value="all-time">🕒 All Time</option>
                <option value="today">📍 Today</option>
                <option value="this-week">📊 This Week</option>
                <option value="this-month">📈 This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Scheduled Card */}
          <div className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-blue-700 text-xs font-semibold">PENDING</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Scheduled</h3>
            <p className="text-4xl font-bold text-blue-600 mb-3">{stats.scheduled}</p>
            <p className="text-sm text-gray-600">Skills waiting to be started</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                style={{ width: `${(stats.scheduled / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* In Progress Card */}
          <div className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-2xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="bg-yellow-50 px-3 py-1 rounded-full">
                <span className="text-yellow-700 text-xs font-semibold">ACTIVE</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">In Progress</h3>
            <p className="text-4xl font-bold text-yellow-600 mb-3">{stats.in_progress}</p>
            <p className="text-sm text-gray-600">Skills currently being worked on</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                style={{ width: `${(stats.in_progress / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Completed Card */}
          <div className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-green-700 text-xs font-semibold">DONE</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-600 mb-3">{stats.completed}</p>
            <p className="text-sm text-gray-600">Successfully finished skills</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Total Card */}
          <div className="group bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-2xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="bg-purple-50 px-3 py-1 rounded-full">
                <span className="text-purple-700 text-xs font-semibold">TOTAL</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Total Skills</h3>
            <p className="text-4xl font-bold text-purple-600 mb-3">{stats.total}</p>
            <p className="text-sm text-gray-600">All skills in the system</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
