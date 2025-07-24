import { useState, useEffect } from "react";
import axios from "axios";
// import Nav from '../HomeNav/nav';

interface OperatorMaster {
    id: number;
    sr_no: number;
    employee_code: string;
    full_name: string;
    date_of_join: string | null;
    employee_pattern_category: string;
    designation: string;
    department: string | null;
    department_code: string | null;
}

const MasterTable = () => {
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [searchTerm, setSearchTerm] = useState("");
    const [operators, setOperators] = useState<OperatorMaster[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/operators-master/");
                console.log(response.data)
                setOperators(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch operator data");
                setLoading(false);
                console.error(err);
            }
        };

        fetchOperators();
    }, []);

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartment(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    // Extract unique department names for the dropdown
    const departmentOptions = ["All Departments", ...Array.from(new Set(operators
        .map((op) => op.department || '')
        .filter(department => department !== '' && department !== null)))];

    // Filter operators based on selected department and search term
    const filteredOperators = operators.filter(op => {
        const matchesDepartment = selectedDepartment === "All Departments" || op.department === selectedDepartment;
        const matchesSearch = 
            op.employee_code.toLowerCase().includes(searchTerm) ||
            op.full_name.toLowerCase().includes(searchTerm) ||
            op.designation.toLowerCase().includes(searchTerm) ||
            (op.department && op.department.toLowerCase().includes(searchTerm)) ||
            (op.department_code && op.department_code.toLowerCase().includes(searchTerm));
        
        return matchesDepartment && matchesSearch;
    });

    if (loading) return <div className="p-5">Loading...</div>;
    if (error) return <div className="p-5 text-red-500">{error}</div>;

    return (
        <div className="w-full min-h-screen box-border bg-gray-50">
        <div className="w-full mx-auto flex flex-col">
          <div className="bg-black mb-4 md:mb-6">
            <h4 className="text-2xl md:text-3xl font-bold text-white py-5 text-center">
              Operator Master Table
            </h4>
          </div>
            <div className="px-5">
            {/* Filters */}
            <div className="flex justify-between mb-4">
                <div className="w-1/2">
                    <input
                        type="text"
                        placeholder="Search by code, name, designation, or department..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-96 py-2 px-3 rounded border border-gray-300 bg-white text-sm outline-none shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="flex space-x-2">
                    <select 
                        id="departmentSelect" 
                        value={selectedDepartment} 
                        onChange={handleDepartmentChange}
                        className="py-2 px-3 rounded border border-gray-300 bg-white text-sm min-w-32 outline-none shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                        {departmentOptions.map((department) => (
                            <option key={department} value={department}>{department}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="mt-4 w-full">
                <table className="w-full border-collapse font-sans">
                    <thead>
                        <tr className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                            <th className="border border-gray-300 p-2 text-center text-sm font-bold">Sr. No</th>
                            <th className="border border-gray-300 p-2 text-center text-sm font-bold">Employee Code</th>
                            <th className="border border-gray-300 p-2 text-center text-sm font-bold">Full Name</th>
                            <th className="border border-gray-300 p-2 text-center text-sm font-bold">Date of Join</th>
                            <th className="border border-gray-300 p-2 text-center text-sm font-bold">Pattern Category</th>
                            <th className="border border-gray-300 p-2 text-center text-sm font-bold">Designation</th>
                            <th className="border border-gray-300 p-2 text-center text-sm font-bold">Department</th>
                            <th className="border border-gray-300 p-2 text-center text-sm font-bold">Department Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOperators.length > 0 ? (
                            filteredOperators.map((op, index) => (
                                <tr key={op.employee_code} className={index % 2 === 1 ? "bg-amber-50" : ""}>
                                    <td className="border border-gray-300 p-2 text-center text-sm">{op.sr_no}</td>
                                    <td className="border border-gray-300 p-2 text-center text-sm">{op.employee_code}</td>
                                    <td className="border border-gray-300 p-2 text-center text-sm">{op.full_name}</td>
                                    <td className="border border-gray-300 p-2 text-center text-sm">
                                        {op.date_of_join ? new Date(op.date_of_join).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center text-sm">{op.employee_pattern_category}</td>
                                    <td className="border border-gray-300 p-2 text-center text-sm">{op.designation}</td>
                                    <td className="border border-gray-300 p-2 text-center text-sm">{op.department || '-'}</td>
                                    <td className="border border-gray-300 p-2 text-center text-sm">{op.department_code || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="border border-gray-300 p-4 text-center text-sm text-gray-500">
                                    No operators found matching your criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        </div>
    );
};

export default MasterTable; 