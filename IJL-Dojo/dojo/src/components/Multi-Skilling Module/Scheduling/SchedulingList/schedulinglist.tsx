import React, { useEffect, useState } from 'react';
import { User, Calendar, Award, AlertTriangle } from 'lucide-react';

// Utility: Format skill level for display
const formatSkillLevel = (level: string) => (level ? level.replace(/_/g, ' ') : '');

// Utility: Format date for display
const formatDate = (dateString: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

const MultiSkillingList: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Group all MultiSkilling rows (regardless of status) by employee
  const groupByEmployee = (
    multiSkillingData: any[],
    operatorsMap: any,
    skillMatricesMap: any,
    sectionsMap: any,
    operationsMap: any
  ) => {
    const grouped: Record<number, any> = {};

    multiSkillingData.forEach((skill) => {
      const employeeObj = operatorsMap[skill.employee];
      const departmentObj = skillMatricesMap[skill.department];
      const sectionObj = skill.section ? sectionsMap[skill.section] : null;
      const operationObj = operationsMap[skill.operation];

      if (!employeeObj) return;
      const empId = skill.employee;
      if (!grouped[empId]) {
        grouped[empId] = {
          employee_id: empId,
          name: skill.full_name || employeeObj?.full_name || `Employee ${empId}`,
          card_no: skill.employee_code || employeeObj?.employee_code || 'N/A',
          pay_code: skill.designation || employeeObj?.designation || 'N/A',
          department: departmentObj?.department || employeeObj?.department || 'Unknown Department',
          section: sectionObj?.name || 'Unknown Section',
          joining_date: skill.date_of_join 
            ? formatDate(skill.date_of_join) 
            : (employeeObj?.date_of_join ? formatDate(employeeObj.date_of_join) : ''),
          employment_pattern: employeeObj?.employment_pattern_category ?? '',
          department_code: employeeObj?.department_code ?? '',
          sr_no: employeeObj?.sr_no ?? '',
          skills: [],
        };
      }
      grouped[empId].skills.push({
        station: operationObj?.name || `Operation (${skill.operation})`,
        skill_level: skill.skill_level || 'basic',
        start_date: skill.date ? formatDate(skill.date) : 'N/A',
        end_date: skill.date ? formatDate(skill.date) : 'N/A',
        status: skill.status || 'active',
        station_number: operationObj?.number ?? '',
        notes: skill.remarks || '',
        minimum_skill_required: operationObj?.minimum_skill_required ?? '',
        section_name: sectionObj?.name || '',
        department_name: departmentObj?.department || '',
        // All model fields
        model_data: {
          id: skill.id,
          employee: skill.employee,
          employee_code: skill.employee_code,
          full_name: skill.full_name,
          date_of_join: skill.date_of_join,
          designation: skill.designation,
          department: skill.department,
          section: skill.section,
          operation: skill.operation,
          skill_level: skill.skill_level,
          date: skill.date,
          remarks: skill.remarks,
          status: skill.status,
          created_at: skill.created_at,
          updated_at: skill.updated_at,
        }
      });
    });

    return Object.values(grouped);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [
          operatorsRes,
          skillMatricesRes,
          sectionsRes,
          operationsRes,
          multiSkillingRes,
        ] = await Promise.all([
          fetch('http://127.0.0.1:8000/operators-master/'),
          fetch('http://127.0.0.1:8000/skill-matrix/'),
          fetch('http://127.0.0.1:8000/sections/'),
          fetch('http://127.0.0.1:8000/operationlist/'),
          fetch('http://127.0.0.1:8000/multiskilling/'),
        ]);

        if (
          !operatorsRes.ok ||
          !skillMatricesRes.ok ||
          !sectionsRes.ok ||
          !operationsRes.ok ||
          !multiSkillingRes.ok
        ) {
          throw new Error('Failed to fetch one or more endpoints.');
        }
        const [
          operators,
          skillMatrices,
          sections,
          operations,
          multiSkilling,
        ] = await Promise.all([
          operatorsRes.json(),
          skillMatricesRes.json(),
          sectionsRes.json(),
          operationsRes.json(),
          multiSkillingRes.json(),
        ]);

        const operatorsMap: Record<number, any> = {};
        const skillMatricesMap: Record<number, any> = {};
        const sectionsMap: Record<number, any> = {};
        const operationsMap: Record<number, any> = {};
        operators.forEach((op: any) => (operatorsMap[op.id] = op));
        skillMatrices.forEach((sm: any) => (skillMatricesMap[sm.id] = sm));
        sections.forEach((sec: any) => (sectionsMap[sec.id] = sec));
        operations.forEach((op: any) => (operationsMap[op.id] = op));

        const groupedData = groupByEmployee(
          multiSkilling,
          operatorsMap,
          skillMatricesMap,
          sectionsMap,
          operationsMap
        );
        setEmployees(groupedData);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Multi-Skilling Allocations (All Statuses)
            </h1>
          </div>
          <p className="text-gray-600 ml-14">
            Schedule, track, and view skill assignments for all employees (<span className="font-semibold">all statuses</span>).
          </p>
          <p className="text-gray-600 ml-14">
            Total employees: {employees.length} | Total skills: {employees.reduce((sum, emp) => sum + emp.skills.length, 0)}
          </p>
        </div>

        {/* Employee Cards */}
        <div className="space-y-6">
          {employees.map((employee) => (
            <div
              key={employee.employee_id}
              className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Employee Header */}
              <div className="bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    {/* Employee Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{employee.name}</h3>
                      <div className="flex items-center gap-4 mb-1">
                        <p className="text-sm text-gray-500">Card No: {employee.card_no}</p>
                        <span className="text-gray-300">|</span>
                        <p className="text-sm text-gray-500">Pay Code: {employee.pay_code}</p>
                        <span className="text-gray-300">|</span>
                        <p className="text-sm text-gray-500">Sr. No: {employee.sr_no}</p>
                        <span className="text-gray-300">|</span>
                        <p className="text-sm text-gray-500">ID: {employee.employee_id}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {employee.department}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{employee.section}</span>
                        {employee.department_code && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">Code: {employee.department_code}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-500">Joined: {employee.joining_date}</span>
                        </div>
                        {employee.employment_pattern && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500">Pattern: {employee.employment_pattern}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Skills Section */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-gray-500" />
                  <h4 className="font-semibold text-gray-800">All Skills (by Status)</h4>
                  <span className="text-sm text-gray-500">({employee.skills.length})</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2"></div>
                </div>
                {employee.skills?.length ? (
                  <div className="grid gap-4">
                    {employee.skills.map((skill: any, index: number) => {
                      let cardBgColor = 'bg-gray-50';
                      let cardBorderColor = 'border-gray-200';
                      if (skill.status) {
                        switch (skill.status.toLowerCase()) {
                          case 'completed':
                            cardBgColor = 'bg-green-50';
                            cardBorderColor = 'border-green-200';
                            break;
                          case 'inprogress':
                            cardBgColor = 'bg-blue-50';
                            cardBorderColor = 'border-blue-200';
                            break;
                          case 'scheduled':
                            cardBgColor = 'bg-yellow-50';
                            cardBorderColor = 'border-yellow-200';
                            break;
                          case 'active':
                            cardBgColor = 'bg-purple-50';
                            cardBorderColor = 'border-purple-200';
                            break;
                          case 'inactive':
                            cardBgColor = 'bg-red-50';
                            cardBorderColor = 'border-red-200';
                            break;
                          case 'rescheduled':
                            cardBgColor = 'bg-orange-50';
                            cardBorderColor = 'border-orange-200';
                            break;
                        }
                      }
                      return (
                        <div
                          key={index}
                          className={`relative p-4 rounded-xl border-2 ${cardBorderColor} ${cardBgColor} transition-all duration-200 hover:shadow-md`}
                        >
                          <div className="flex flex-col gap-4">
                            {/* Skill/operation, level, status */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <span className="font-semibold text-gray-800">
                                  {skill.station}
                                </span>
                                <p className="text-xs text-gray-500">ID: {skill.model_data.operation}</p>
                              </div>
                              {skill.status && (
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    skill.status.toLowerCase() === 'completed'
                                      ? 'bg-green-100 text-green-800 border border-green-200'
                                      : skill.status.toLowerCase() === 'inprogress'
                                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                      : skill.status.toLowerCase() === 'scheduled'
                                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                      : skill.status.toLowerCase() === 'active'
                                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                      : skill.status.toLowerCase() === 'inactive'
                                      ? 'bg-red-100 text-red-800 border border-red-200'
                                      : skill.status.toLowerCase() === 'rescheduled'
                                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                                  }`}
                                >
                                  {skill.status}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span>Employee ID: {skill.model_data.employee}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-gray-500" />
                                  <span>Skill Level: {formatSkillLevel(skill.model_data.skill_level)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  <span>Department ID: {skill.model_data.department}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                  <span>Section ID: {skill.model_data.section || 'N/A'}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500" />
                                  <span>Date: {skill.start_date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <span>Designation: {skill.model_data.designation}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>Join Date: {skill.model_data.date_of_join ? formatDate(skill.model_data.date_of_join) : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span>Record ID: {skill.model_data.id}</span>
                                </div>
                              </div>
                            </div>

                            {skill.model_data.remarks && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                <h4 className="text-xs font-semibold text-gray-500 mb-1">Remarks:</h4>
                                <p className="text-sm text-gray-700">{skill.model_data.remarks}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No multi-skills found for this employee
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiSkillingList;