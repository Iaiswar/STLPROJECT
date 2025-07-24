import React, { useState, useEffect } from 'react';

type OperatorStats = {
  id: number;
  level: number;
  operator_required: number;
  operator_available: number;
  factory: number;
  factory_name: string;
  department: number;
  department_name: string;
  month: string;
};

type Employee = {
  id: number;
  name: string;
  level: number;
  advancementDate?: string;
};

interface Props {
  factoryId: number | null;
  departmentId: number | null;
}

const OperatorStatsRedirect: React.FC<Props> = ({ factoryId, departmentId }) => {
  const [data, setData] = useState<OperatorStats[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OperatorStats | null>(null);

  useEffect(() => {
    if (!factoryId || !departmentId) return;

    const url = `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${factoryId}&department_id=${departmentId}`;
    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const operatorRequirements = json.operator_requirements || [];
        console.log("Filtered Operator Requirements:", operatorRequirements);
        setData(operatorRequirements);
      })
      .catch((err) => {
        console.error("Error fetching operator requirements:", err);
      })
      .finally(() => setLoading(false));
  }, [factoryId, departmentId]);

  const fetchEmployees = async (level: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/employees/?level=${level}`);
      const emps = await res.json();
      setEmployees(emps);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    }
  };

  const handleClick = (stat: OperatorStats) => {
    setSelected(stat);
    fetchEmployees(stat.level);
  };

  const getStatus = (available: number, required: number) => {
    if (available === required) {
      return { text: 'Optimal', color: '#12c53b' };         // Darker green
    }
    if (available > required) {
      return { text: 'Surplus', color: '#948dffff' };         // Darker lavender
    }
    if (available / required >= 0.95) {
      return { text: 'Near Optimal', color: '#e6e603' };    // Richer yellow-green
    }
    return { text: 'Shortage', color: '#ee583e' };          // Deeper red

  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="  min-h-[300px]  ">
      <h2 className=" sm:text-xl font-bold text-center text-gray-600 mb-4 sm:mb-6 bg-white p-2 sm:p-3 shadow">
        Operators Required Vs Available
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {data.map((stat) => {
          const status = getStatus(stat.operator_available, stat.operator_required);
          return (
            <div
              key={stat.id}
              className="flex gap-2 cursor-pointer justify-center"
              onClick={() => handleClick(stat)}
            >
              <div
                className="rounded-lg p-3 sm:p-4 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.2) flex-1 max-w-[150px]"
                style={{ backgroundColor: status.color }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white">{stat.operator_required}</h3>
                <p className="text-xs sm:text-sm text-white">L{stat.level} Required</p>
              </div>
              <div
                className="rounded-lg p-3 sm:p-4 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.2) flex-1 max-w-[150px]"
                style={{ backgroundColor: status.color }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white">{stat.operator_available}</h3>
                <p className="text-xs sm:text-sm text-white">L{stat.level} Available</p>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-2 right-4 text-xl">&times;</button>
            <h3 className="text-lg font-bold mb-2 text-center">
              L{selected.level} Operator Details
            </h3>

            <div className="flex justify-between mb-4">
              <div className="w-1/2 text-center shadow-xl rounded p-4">
                <p className="font-bold">{selected.operator_required}</p>
                <p className="text-sm">Required</p>
              </div>
              <div className="w-1/2 text-center shadow-xl rounded p-4">
                <p className="font-bold">{selected.operator_available}</p>
                <p className="text-sm">Available</p>
              </div>
            </div>

            <p className="text-center font-semibold mb-3">
              Status: {getStatus(selected.operator_available, selected.operator_required).text}
            </p>

            <h4 className="font-bold text-sm mb-2">Employees:</h4>
            <div className="space-y-2">
              {employees.length === 0 ? (
                <p className="text-sm text-center text-gray-500">No employees found</p>
              ) : (
                employees.map((emp) => (
                  <div key={emp.id} className="bg-gray-100 p-2 rounded">
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-xs text-gray-600">
                      {emp.advancementDate ? `Exam: ${emp.advancementDate}` : 'No exam date'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorStatsRedirect;