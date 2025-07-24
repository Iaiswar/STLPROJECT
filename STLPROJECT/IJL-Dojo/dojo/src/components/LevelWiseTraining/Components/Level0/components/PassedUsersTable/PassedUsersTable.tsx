import { useEffect, useState } from 'react';
import Level0Nav from '../Level0Nav/Level0Nav';
import { FaFilter, FaCalendarAlt } from 'react-icons/fa';

interface BodyCheck {
  id: number;
  temp_id: string;
  check_date: string;
  overall_status: 'pass' | 'fail';
  color_vision: string;
  eye_movement: string;
  fingers_functionality: string;
  hand_deformity: string;
  joint_mobility: string;
  hearing: string;
  bending_ability: string;
  additional_checks: any[];
  notes: string;
}

interface User {
  first_name: string;
  last_name: string;
  temp_id: string;
  email: string;
  phone_number: string;
  sex: string;
  created_at: string;
  is_active: boolean;
  body_checks: BodyCheck[];
}

const PassedUsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/user-body-checks/");
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();
    let filtered = [...users];

    // Filter by status first
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        const latestCheck = getLatestBodyCheck(user.body_checks);
        return latestCheck && latestCheck.overall_status === statusFilter;
      });
    }

    // Then filter by date
    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(user => {
          const latestCheck = getLatestBodyCheck(user.body_checks);
          if (!latestCheck) return false;
          const checkDate = new Date(latestCheck.check_date);
          return (
            checkDate.getDate() === now.getDate() &&
            checkDate.getMonth() === now.getMonth() &&
            checkDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = filtered.filter(user => {
          const latestCheck = getLatestBodyCheck(user.body_checks);
          if (!latestCheck) return false;
          const checkDate = new Date(latestCheck.check_date);
          return checkDate >= startOfWeek && checkDate <= now;
        });
        break;
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(user => {
          const latestCheck = getLatestBodyCheck(user.body_checks);
          if (!latestCheck) return false;
          const checkDate = new Date(latestCheck.check_date);
          return checkDate >= startOfMonth && checkDate <= now;
        });
        break;
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        filtered = filtered.filter(user => {
          const latestCheck = getLatestBodyCheck(user.body_checks);
          if (!latestCheck) return false;
          const checkDate = new Date(latestCheck.check_date);
          return checkDate >= startOfYear && checkDate <= now;
        });
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    setFilteredUsers(filtered);
  }, [dateFilter, statusFilter, users]);

  const getLatestBodyCheck = (bodyChecks: BodyCheck[]): BodyCheck | null => {
    if (!bodyChecks || bodyChecks.length === 0) return null;
    
    return bodyChecks.reduce((latest, current) => {
      const latestDate = new Date(latest.check_date);
      const currentDate = new Date(current.check_date);
      return currentDate > latestDate ? current : latest;
    });
  };

  const getStatusBadge = (status: string) => {
    const isPass = status.toLowerCase() === 'pass';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Level0Nav />
      <div className="overflow-x-auto shadow-md sm:rounded-lg h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Employee Details</h2>
          
          <div className="flex space-x-2">
            {/* Status Filter */}
            <div className="relative">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <FaFilter className="mr-2" />
                {statusFilter === 'all' ? 'All Status' : 
                 statusFilter === 'pass' ? 'Pass' : 'Fail'}
              </button>
              
              {showStatusDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setStatusFilter('all');
                        setShowStatusDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      All Status
                    </button>
                    <button 
                      onClick={() => {
                        setStatusFilter('pass');
                        setShowStatusDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Pass
                    </button>
                    <button 
                      onClick={() => {
                        setStatusFilter('fail');
                        setShowStatusDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Fail
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Date Filter */}
            <div className="relative">
              <button 
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <FaCalendarAlt className="mr-2" />
                {dateFilter === 'all' ? 'All Time' : 
                 dateFilter === 'today' ? 'Today' :
                 dateFilter === 'week' ? 'This Week' :
                 dateFilter === 'month' ? 'This Month' : 'This Year'}
              </button>
              
              {showDateDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setDateFilter('all');
                        setShowDateDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      All Time
                    </button>
                    <button 
                      onClick={() => {
                        setDateFilter('today');
                        setShowDateDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => {
                        setDateFilter('week');
                        setShowDateDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      This Week
                    </button>
                    <button 
                      onClick={() => {
                        setDateFilter('month');
                        setShowDateDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      This Month
                    </button>
                    <button 
                      onClick={() => {
                        setDateFilter('year');
                        setShowDateDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      This Year
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => {
              const latestCheck = getLatestBodyCheck(user.body_checks);
              return (
                <tr key={user.temp_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.temp_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                      {user.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href={`tel:${user.phone_number}`} className="hover:text-blue-600">
                      {user.phone_number}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {latestCheck ? (
                      <div>
                        <div>{formatDate(latestCheck.check_date)}</div>
                        <div className="text-xs text-gray-500">{formatTime(latestCheck.check_date)}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No checks</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{formatDate(user.created_at)}</div>
                      <div className="text-xs text-gray-500">{formatTime(user.created_at)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {latestCheck ? (
                      getStatusBadge(latestCheck.overall_status)
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No check
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="bg-white p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {users.length === 0 
                ? 'There are currently no users in the system.'
                : `No users match your current filters: ${statusFilter === 'all' ? 'All Status' : statusFilter} and ${dateFilter === 'all' ? 'All Time' : 
                   dateFilter === 'today' ? 'Today' :
                   dateFilter === 'week' ? 'This Week' :
                   dateFilter === 'month' ? 'This Month' : 'This Year'}`}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default PassedUsersTable;