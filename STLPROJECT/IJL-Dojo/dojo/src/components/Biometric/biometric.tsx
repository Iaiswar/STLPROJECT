import { useEffect, useState } from 'react';
import Nav from '../HomeNav/nav';

interface BiometricAttendance {
  id: number;
  sr_no: number;
  pay_code: string;
  card_no: string;
  employee_name: string;
  department: string;
  designation: string;
  shift: string;
  start: string;
  in_time: string;
  out_time: string;
  hrs_works: string | null;
  status: string;
  early_arrival: string | null;
  late_arrival: string | null;
  shift_early: string | null;
  excess_lunch: string | null;
  ot: string | null;
  ot_amount: string | null;
  manual: string | null;
}

const BiometricTable = () => {
  const [attendanceData, setAttendanceData] = useState<BiometricAttendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/biometric-attendance/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <><Nav /><div className="container mx-auto px-4 py-8 pt-20">
          <h1 className="text-3xl font-bold mb-6 text-gray-800  text-center">Biometric Attendance</h1>

          <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No.</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PayCode</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card No</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hrs Works</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Early Arriv.</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Arriv.</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Early</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excess Lunch</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OT</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OT Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manual</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.sr_no}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.pay_code}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.card_no}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employee_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.department}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.designation}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.shift}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.start}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.in_time}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.out_time}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.hrs_works || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${record.status.toLowerCase() === 'present' ? 'bg-green-100 text-green-800' :
                                          record.status.toLowerCase() === 'absent' ? 'bg-red-100 text-red-800' :
                                              'bg-yellow-100 text-yellow-800'}`}>
                                      {record.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.early_arrival || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.late_arrival || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.shift_early || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.excess_lunch || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.ot || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.ot_amount || '-'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.manual || '-'}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div></>
  );
};

export default BiometricTable;