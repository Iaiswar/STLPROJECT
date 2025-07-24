import React from 'react';
import SkillPieChart from './SkillPiechart';
import { Users, Calendar, FileText } from 'lucide-react';
import { SkillMatrix, Operation, Section, MonthlySkill, Month } from '../api/types';
import MonthPieChart from './MonthPieChart';

interface SkillMatrixTableProps {
    skillMatrices: SkillMatrix[];
    selectedMatrix: SkillMatrix | null;
    employees: any[];
    operations: Operation[];
    sections: Section[];
    monthlySkills: MonthlySkill[];
    months: Month[];
    isLoading: boolean;
    error: string | null;
    onMatrixChange: (matrix: SkillMatrix) => void;
}

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({
    skillMatrices,
    selectedMatrix,
    employees,
    operations,
    sections,
    monthlySkills,
    months,
    isLoading,
    error,
    onMatrixChange,
}) => {
    const getDepartmentEmployees = (): any[] => {
        if (!selectedMatrix) return [];
        return employees.filter(emp => emp.department === selectedMatrix.department);
    };

    const getDepartmentOperations = (): Operation[] => {
        if (!selectedMatrix) return [];
        return operations.filter(op => op.matrix === selectedMatrix.id);
    };

    const getUniqueSections = (): Section[] => {
        const departmentOperations = getDepartmentOperations();
        const sectionIds = [...new Set(departmentOperations.map(op => op.section))];
        return sections.filter(section => sectionIds.includes(section.id));
    };

    const getEmployeeMonthlySkills = (employeeCode: string): MonthlySkill[] => {
        if (!selectedMatrix) return [];
        return monthlySkills.filter(ms =>
            ms.employee_code === employeeCode &&
            ms.department === selectedMatrix.department
        );
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB');
        } catch {
            return '-';
        }
    };

    const getEmployeeSection = (employee: any): string => {
        if (!employee) return selectedMatrix?.department || 'General';
        if (employee.section) {
            const section = sections.find(s => s.id === employee.section);
            return section?.name || selectedMatrix?.department || 'General';
        }
        return selectedMatrix?.department || 'General';
    };

    const getOperationColor = (department: string, operationNumber: number): string => {
        const colors = {
            'Assembly': {
                1: '#FFF200', 2: '#F8B87A', 3: '#006B76', 4: '#708238', 5: '#B1C4CC',
                6: '#4D3E6C', 7: '#475A93', 8: '#854B07', 9: '#FFD300', 10: '#D01F1F',
                11: '#00A651', 12: '#662D91', 13: '#002663', 14: '#00CFFF', 15: '#A3D55C',
                16: '#3A3A3A', 17: '#C6BDD6', 18: '#902734', 19: '#98C4D4', 20: '#D2DFAA'
            },
            'Quality': { 1: '#00A94E', 2: '#00B7F1', 3: '#782D91', 4: '#FFC100' },
            'Moulding': { 1: '#F47C26', 2: '#A8A8A8', 3: '#FFC400', 4: '#4A79C9', 5: '#4CAF50' },
            'Surface Treatment': { 1: '#4682B4', 2: '#5F9EA0', 3: '#B0C4DE', 4: '#ADD8E6', 5: '#87CEEB' },
        };
        return (colors as any)[department]?.[operationNumber] || '#E5E7EB';
    };

    const getContrastColor = (hexColor: string): string => {
        if (!hexColor) return '#000000';
        const r = parseInt(hexColor.substring(1, 3), 16);
        const g = parseInt(hexColor.substring(3, 5), 16);
        const b = parseInt(hexColor.substring(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    };

    const departmentEmployees = getDepartmentEmployees();
    const departmentOperations = getDepartmentOperations();
    const uniqueSections = getUniqueSections();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading skill matrix data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    if (!selectedMatrix) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">No skill matrix found. Please create one first.</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-16">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Header */}
                <div className="border-b-2 border-gray-200 p-6 flex justify-between items-center bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-800">Skill Matrix & Skill Upgradation Plan</h1>
                    <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">IJL</div>
                    </div>
                </div>

                {/* Legend */}
                <div className="p-2 border-t border-gray-200 bg-gray-50">
                    <div className="text-lg font-semibold mb-2">Legend</div>
                    <div className="mb-4">
                        <div className="text-sm font-semibold mb-2">Skill Level Scale:</div>
                        <div className="flex flex-wrap gap-x-2 gap-y-2 items-center">
                            <div className="text-sm font-semibold flex items-center space-x-2">
                                <SkillPieChart level={0} isRequired={false} />
                                <span>0 = Beginner (just started within last week),</span>
                            </div>
                            <div className="text-sm font-semibold flex items-center space-x-2">
                                <SkillPieChart level={1} isRequired={false} />
                                <span>1 = Learner (under training),</span>
                            </div>
                            <div className="text-sm font-semibold flex items-center space-x-2">
                                <SkillPieChart level={2} isRequired={false} />
                                <span>2 = Practitioner (works independently per SOP),</span>
                            </div>
                            <div className="text-sm font-semibold flex items-center space-x-2">
                                <SkillPieChart level={3} isRequired={false} />
                                <span>3 = Expert (works independently),</span>
                            </div>
                            <div className="text-sm font-semibold flex items-center space-x-2">
                                <SkillPieChart level={4} isRequired={false} />
                                <span>4 = Master (can train others)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Matrix Info */}
                <div className="border-b border-gray-200 p-4 grid grid-cols-5 gap-4 text-sm bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">Department:</span>
                        <select
                            value={selectedMatrix.id}
                            onChange={(e) => {
                                const matrix = skillMatrices.find(m => m.id === Number(e.target.value));
                                if (matrix) onMatrixChange(matrix);
                            }}
                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
                        >
                            {skillMatrices.map(matrix => (
                                <option key={matrix.id} value={matrix.id}>{matrix.department}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">Updated:</span>
                        <span>{formatDate(selectedMatrix.updated_on)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">Next Review:</span>
                        <span>{formatDate(selectedMatrix.next_review)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">Prepared By:</span>
                        <span>{selectedMatrix.prepared_by || 'Department Manager'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-semibold">Doc No:</span>
                        <span>{selectedMatrix.doc_no}</span>
                    </div>
                </div>

                {/* Employee Count */}
                <div className="px-4 py-2 bg-blue-50 text-sm text-blue-700">
                    <span className="font-semibold">{departmentEmployees.length} employees</span> found in {selectedMatrix.department} department
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 w-12 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Sl. No.</th>
                                <th className="border border-gray-300 p-2 w-16 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>CC No/EMP Code</th>
                                <th className="border border-gray-300 p-2 w-24 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Designation</th>
                                <th className="border border-gray-300 p-2 w-32 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Employee Name</th>
                                <th className="border border-gray-300 p-2 w-24 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>DOJ</th>
                                <th className="border border-gray-300 p-2 w-20 bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>Section</th>
                                <th
                                    className="border border-gray-300 p-2 text-center font-bold bg-blue-100"
                                    colSpan={departmentOperations.length}
                                >
                                    Training Points
                                </th>
                                <th
                                    className="border border-gray-300 p-2 text-center font-bold bg-green-100"
                                    colSpan={months.length}
                                >
                                    Skill Matrix & Skill Upgradation Plan
                                </th>
                                <th className="border border-gray-300 p-2 text-center font-bold bg-gray-100" rowSpan={selectedMatrix?.department === 'Assembly' ? 4 : 3}>
                                    Remarks
                                </th>
                            </tr>

                            {selectedMatrix?.department === 'Assembly' && (
                                <tr>
                                    {uniqueSections.map(section => {
                                        const sectionOps = departmentOperations.filter(op => op.section === section.id);
                                        return (
                                            <th key={section.id} className="border border-gray-300 p-2 text-center font-bold bg-blue-50"
                                                colSpan={sectionOps.length}>
                                                {section.name}
                                            </th>
                                        );
                                    })}
                                    {departmentOperations.length === 0 && (
                                        <th className="border border-gray-300 p-2 text-center font-bold bg-blue-50">
                                            No Operations
                                        </th>
                                    )}
                                    <th className="border border-gray-300 p-2 text-center font-bold bg-green-50" colSpan={months.length} rowSpan={2}>
                                        Monthly Plan
                                    </th>
                                </tr>
                            )}
                            <tr>
                                {departmentOperations.length > 0 &&
                                    departmentOperations.map(op => (
                                        <th
                                            key={op.id}
                                            className="border border-gray-300 p-1 text-center text-xs font-bold bg-yellow-100"
                                        >
                                            {op.number}
                                        </th>
                                    ))}
                                {selectedMatrix?.department !== 'Assembly' && (
                                    <th className="border border-gray-300 p-2 text-center font-bold bg-green-50" colSpan={months.length}>
                                        Monthly Plan
                                    </th>
                                )}
                            </tr>
                            <tr>
                                {departmentOperations.length > 0 ? (
                                    departmentOperations.map(op => (
                                        <th
                                            key={op.id}
                                            className="border border-gray-300 p-1 text-center text-xs font-bold h-20"
                                            style={{
                                                backgroundColor: getOperationColor(selectedMatrix.department, op.number),
                                                color: getContrastColor(getOperationColor(selectedMatrix.department, op.number))
                                            }}
                                        >
                                            <div className="flex flex-col items-center justify-center h-full">
                                                {op.name.split(' ').map((word, wordIndex) => (
                                                    <div key={wordIndex} className="leading-tight">{word}</div>
                                                ))}
                                            </div>
                                        </th>
                                    ))
                                ) : (
                                    <th className="border border-gray-300 p-1 text-center text-xs font-bold bg-gray-50 h-20">
                                        <div className="flex flex-col items-center justify-center h-full">
                                            No Operations
                                        </div>
                                    </th>
                                )}
                                {months.map(month => (
                                    <th
                                        key={month.id}
                                        className="border border-gray-300 p-1 text-center text-xs font-bold bg-green-50"
                                        style={{
                                            height: '80px',
                                            width: '24px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                writingMode: 'vertical-rl',
                                                transform: 'rotate(180deg)',
                                                textAlign: 'center',
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {month.displayName}
                                        </div>
                                    </th>
                                ))}
                            </tr>

                            <tr className="bg-gray-100">
                                <td className="border border-gray-300 p-2 text-center font-bold" colSpan={6}>Required Level</td>
                                {departmentOperations.length > 0 ? (
                                    departmentOperations.map(op => (
                                        <td key={op.id} className="border border-gray-300 p-1 text-center font-bold">
                                            <SkillPieChart level={op.minimum_skill_required} isRequired={true} />
                                        </td>
                                    ))
                                ) : (
                                    <td className="border border-gray-300 p-1 text-center font-bold">
                                        -
                                    </td>
                                )}
                                <td className="border border-gray-300 p-1 text-center font-bold bg-gray-100" colSpan={months.length + 1}>
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            {departmentEmployees.map((employee, index) => {
                                const employeeMonthlySkills = getEmployeeMonthlySkills(employee.employee_code);

                                return (
                                    <tr key={employee.employee_code} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                        <td className="border border-gray-300 p-2 text-center font-mono">{employee.employee_code || '-'}</td>
                                        <td className="border border-gray-300 p-2 text-center">{employee.designation || '-'}</td>
                                        <td className="border border-gray-300 p-2">{employee.full_name || '-'}</td>
                                        <td className="border border-gray-300 p-2 text-center">{formatDate(employee.date_of_join)}</td>
                                        <td className="border border-gray-300 p-2 text-center">{getEmployeeSection(employee)}</td>

                                        {departmentOperations.length > 0 ? (
                                            departmentOperations.map(op => {
                                                const monthlySkill = employeeMonthlySkills.find(ms =>
                                                    (ms.operation && op.id.toString() === ms.operation) ||
                                                    (ms.operation_number && ms.operation_number === op.number)
                                                );

                                                return (
                                                    <td key={op.id} className="border border-gray-300 p-1 text-center">
                                                        {monthlySkill ? (
                                                            <SkillPieChart
                                                                level={parseInt(monthlySkill.level) || 0}
                                                                isRequired={false} />
                                                        ) : (
                                                            <SkillPieChart level={0} isRequired={false} />
                                                        )}
                                                    </td>
                                                );
                                            })
                                        ) : (
                                            <td className="border border-gray-300 p-1 text-center">
                                                <SkillPieChart level={0} isRequired={false} />
                                            </td>
                                        )}

                                        {months.map(month => {
                                            const monthMonthlySkills = employeeMonthlySkills.filter(ms => {
                                                if (!ms.date) return false;
                                                try {
                                                    const msDate = new Date(ms.date);
                                                    return msDate.getMonth() + 1 === month.id &&
                                                        msDate.getFullYear() === month.year;
                                                } catch {
                                                    return false;
                                                }
                                            });

                                            return (
                                                <td
                                                    key={month.id}
                                                    className="border border-gray-300 p-1 text-center"
                                                    style={{ width: '24px' }}
                                                >
                                                    {monthMonthlySkills.length > 0 ? (
                                                        <div className="flex flex-col items-center justify-center h-full space-y-1">
                                                            {monthMonthlySkills.map(ms => {
                                                                const operation = operations.find(op =>
                                                                    op.id.toString() === ms.operation ||
                                                                    op.number === ms.operation_number
                                                                );
                                                                const operationNumber = operation?.number || ms.operation_number;
                                                                const department = ms.department || selectedMatrix?.department || 'Assembly';
                                                                const skillLevel = parseInt(ms.skill_level) || 0;

                                                                return (
                                                                    <div key={ms.id || `${ms.employee_code}-${ms.operation}-${ms.date}`}>
                                                                        <MonthPieChart
                                                                            operationNumber={operationNumber || 0}
                                                                            skillLevel={skillLevel}
                                                                            department={department}
                                                                            size={24}
                                                                            title={`${operation?.name || 'Unknown'} - Level ${skillLevel}`}
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-gray-400">-</div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="border border-gray-300 p-2 text-xs">
                                            {employeeMonthlySkills.length > 0
                                                ? employeeMonthlySkills[0].remarks || '-'
                                                : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default SkillMatrixTable;