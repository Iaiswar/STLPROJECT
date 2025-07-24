import React, { useState } from 'react';
import axios from 'axios';

interface Operator {
  id: number;
  emp_code: string;
  name: string;
  department: string;
}

interface EvaluationFormData {
  operator: Operator | null;
  operatorName: string;
  operatorEmpCode: string;
  handoverProcess: string;
  evaluationPeriod: string;
  evaluationDate: string;
  department: string;
  docNo: string;
  revNoDate: string;
  effeDate: string;
  retainingPeriod: string;
  preparedBy: string;
  checkedBy: string;
  approvedBy: string;
  trainingCycles: Array<{
    cycleNumber: number;
    stdCycleTime: string;
    confirmation: string;
    day8: string;
    day9: string;
    day10: string;
    day11: string;
    day12: string;
    day13: string;
    day14: string;
  }>;
  judgementCriteria: Array<{
    srNo: number;
    parameter: string;
    contents: string;
    judgement: string;
    remarks: string;
  }>;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

const TenCycleTable: React.FC = () => {
  const [searchEmpCode, setSearchEmpCode] = useState('');
  const [searching, setSearching] = useState(false);
  const [operatorNotFound, setOperatorNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState<EvaluationFormData>({
    operator: null,
    operatorName: '',
    operatorEmpCode: '',
    handoverProcess: '',
    evaluationPeriod: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    department: '',
    docNo: '',
    revNoDate: '',
    effeDate: '',
    retainingPeriod: '',
    preparedBy: 'Dona',
    checkedBy: 'Anuj',
    approvedBy: 'Vikrant',
    trainingCycles: Array(10).fill(0).map((_, i) => ({
      cycleNumber: i + 1,
      stdCycleTime: '',
      confirmation: '',
      day8: '',
      day9: '',
      day10: '',
      day11: '',
      day12: '',
      day13: '',
      day14: '',
    })),
    judgementCriteria: [
      {
        srNo: 1,
        parameter: 'Work Manner',
        contents: 'Working as per Work Instruction & Operation standard',
        judgement: '',
        remarks: '',
      },
      {
        srNo: 1,
        parameter: 'Work Manner',
        contents: 'Proper doing the measurement of parts.',
        judgement: '',
        remarks: '',
      },
      {
        srNo: 1,
        parameter: 'Work Manner',
        contents: 'Proper Filling all the check sheet like Machine check, Lot Control Sheet, DPR,etc.',
        judgement: '',
        remarks: '',
      },
      {
        srNo: 1,
        parameter: 'Work Manner',
        contents: 'Proper handling of parts.',
        judgement: '',
        remarks: '',
      },
      {
        srNo: 2,
        parameter: '5S',
        contents: 'All 5S maintain',
        judgement: '',
        remarks: '',
      },
      {
        srNo: 2,
        parameter: '5S',
        contents: 'Proper filling 5S checksheet',
        judgement: '',
        remarks: '',
      },
    ],
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmpCode) return;

    setSearching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/operator-evaluation/${searchEmpCode}/`);

      if (response.data) {
        const operator = response.data;
        setFormData(prev => ({
          ...prev,
          operator,
          operatorName: operator.name,
          operatorEmpCode: operator.emp_code,
          department: operator.department || '',
        }));
        setOperatorNotFound(false);
        setShowForm(true);
      } else {
        setOperatorNotFound(true);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error fetching operator:', error);
      setOperatorNotFound(true);
      setShowForm(false);
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTrainingCycleChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newCycles = [...prev.trainingCycles];
      newCycles[index] = { ...newCycles[index], [field]: value };
      return { ...prev, trainingCycles: newCycles };
    });
  };

  const handleJudgementCriteriaChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newCriteria = [...prev.judgementCriteria];
      newCriteria[index] = { ...newCriteria[index], [field]: value };
      return { ...prev, judgementCriteria: newCriteria };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First, create the general evaluation
      const evaluationResponse = await axios.post(`${API_BASE_URL}/general-evaluations/`, {
        operator_name: formData.operatorName,
        operator_emp_code: formData.operatorEmpCode,
        handover_process: formData.handoverProcess,
        evaluation_period: formData.evaluationPeriod,
        evaluation_date: formData.evaluationDate,
        department: formData.department,
        doc_no: formData.docNo,
        rev_no_date: formData.revNoDate,
        effe_date: formData.effeDate,
        retaining_period: formData.retainingPeriod,
        prepared_by: formData.preparedBy,
        checked_by: formData.checkedBy,
        approved_by: formData.approvedBy,
      });

      // Then create the operator performance evaluation
      const operatorEvalResponse = await axios.post(`${API_BASE_URL}/operator-evaluations/`, {
        general_evaluation: evaluationResponse.data.id,
      });

      // Create training cycles
      await Promise.all(
        formData.trainingCycles.map(cycle =>
          axios.post(`${API_BASE_URL}/training-cycles/`, {
            operator_evaluation: operatorEvalResponse.data.id,
            cycle_number: cycle.cycleNumber,
            std_cycle_time: cycle.stdCycleTime,
            confirmation: cycle.confirmation,
            day_8: cycle.day8,
            day_9: cycle.day9,
            day_10: cycle.day10,
            day_11: cycle.day11,
            day_12: cycle.day12,
            day_13: cycle.day13,
            day_14: cycle.day14,
          })
        )
      );

      // Create judgement criteria
      await Promise.all(
        formData.judgementCriteria.map(criteria =>
          axios.post(`${API_BASE_URL}/judgement-criteria/`, {
            operator_evaluation: operatorEvalResponse.data.id,
            sr_no: criteria.srNo,
            parameter: criteria.parameter,
            contents: criteria.contents,
            judgement: criteria.judgement,
            remarks: criteria.remarks,
          })
        )
      );

      alert('Evaluation submitted successfully!');
      // Reset form after successful submission
      setSearchEmpCode('');
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  if (!showForm) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Operator Evaluation</h1>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="empCode" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Employee Code
              </label>
              <input
                type="text"
                id="empCode"
                value={searchEmpCode}
                onChange={(e) => setSearchEmpCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Scan or enter employee code"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
            {operatorNotFound && (
              <div className="text-red-500 text-sm text-center mt-2">
                Operator not found. Please check the employee code and try again.
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-bold text-lg mb-2">Operator Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Name:</span> {formData.operatorName}
          </div>
          <div>
            <span className="font-medium">Employee Code:</span> {formData.operatorEmpCode}
          </div>
          <div>
            <span className="font-medium">Department:</span> {formData.department}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <form onSubmit={handleSubmit}>
          <table className="w-full border-collapse border-2 border-gray-400">
            <tbody>
              {/* Row 1 */}
              <tr>
                <td colSpan={12} className="border border-gray-400 p-2 text-center bg-gray-100 font-medium">
                  Operator Performance Evaluation Sheet
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td colSpan={3} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Operator Name:</span>
                    <input
                      type="text"
                      name="operatorName"
                      value={formData.operatorName}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                      required
                    />
                  </div>
                </td>
                <td colSpan={2} rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">
                  Prepared By
                  <input
                    type="text"
                    name="preparedBy"
                    value={formData.preparedBy}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-1 w-full mt-1"
                    required
                  />
                </td>
                <td colSpan={2} rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">
                  Checked By
                  <input
                    type="text"
                    name="checkedBy"
                    value={formData.checkedBy}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-1 w-full mt-1"
                    required
                  />
                </td>
                <td colSpan={2} rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">
                  Approved By
                  <input
                    type="text"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-1 w-full mt-1"
                    required
                  />
                </td>
                <td colSpan={2} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Doc.No.</span>
                    <input
                      type="text"
                      name="docNo"
                      value={formData.docNo}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                    />
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td colSpan={3} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Operator Emp code:</span>
                    <input
                      type="text"
                      name="operatorEmpCode"
                      value={formData.operatorEmpCode}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                      required
                    />
                  </div>
                </td>
                <td colSpan={2} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Rev. No. / Date</span>
                    <input
                      type="text"
                      name="revNoDate"
                      value={formData.revNoDate}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                    />
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr>
                <td colSpan={3} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Handover Process:</span>
                    <input
                      type="text"
                      name="handoverProcess"
                      value={formData.handoverProcess}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                    />
                  </div>
                </td>
                <td colSpan={2} rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">
                  {formData.preparedBy}
                </td>
                <td colSpan={2} rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">
                  {formData.checkedBy}
                </td>
                <td colSpan={2} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Effe. Date</span>
                    <input
                      type="text"
                      name="effeDate"
                      value={formData.effeDate}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                    />
                  </div>
                </td>
              </tr>

              {/* Row 5 */}
              <tr>
                <td colSpan={3} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Evaluation Period (Date):</span>
                    <input
                      type="text"
                      name="evaluationPeriod"
                      value={formData.evaluationPeriod}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                      required
                    />
                  </div>
                </td>
                <td colSpan={2} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Retaining Period:</span>
                    <input
                      type="text"
                      name="retainingPeriod"
                      value={formData.retainingPeriod}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                    />
                  </div>
                </td>
              </tr>

              {/* Row 6 */}
              <tr>
                <td colSpan={3} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Evaluation Date:</span>
                    <input
                      type="date"
                      name="evaluationDate"
                      value={formData.evaluationDate}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                      required
                    />
                  </div>
                </td>
                <td colSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100"></td>
                <td colSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100"></td>
                <td colSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100"></td>
                <td colSpan={2} className="border border-gray-400 p-2 bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-2">Department:</span>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-1 flex-1"
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan={12} className="border border-gray-400 p-2 text-center bg-gray-100 font-medium">
                  Operator Training Judgement
                </td>
              </tr>

              {/* Training Cycles Header */}
              <tr>
                <td colSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">Objective</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">STD. Cycle Time (In Sec)</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Confirmation of 10 Cycle</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Day-8</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Day-9</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Day-10</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Day-11</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Day-12</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Day-13</td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Day-14</td>
              </tr>

              {/* Training Cycles Rows */}
              {formData.trainingCycles.map((cycle, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td colSpan={2} rowSpan={10} className="border border-gray-400 p-2 text-center bg-gray-100">
                      10 Cycle confirmation
                    </td>
                  )}
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.stdCycleTime}
                      onChange={(e) => handleTrainingCycleChange(index, 'stdCycleTime', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.confirmation}
                      onChange={(e) => handleTrainingCycleChange(index, 'confirmation', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.day8}
                      onChange={(e) => handleTrainingCycleChange(index, 'day8', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.day9}
                      onChange={(e) => handleTrainingCycleChange(index, 'day9', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.day10}
                      onChange={(e) => handleTrainingCycleChange(index, 'day10', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.day11}
                      onChange={(e) => handleTrainingCycleChange(index, 'day11', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.day12}
                      onChange={(e) => handleTrainingCycleChange(index, 'day12', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.day13}
                      onChange={(e) => handleTrainingCycleChange(index, 'day13', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={cycle.day14}
                      onChange={(e) => handleTrainingCycleChange(index, 'day14', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                </tr>
              ))}

              {/* Judgement Criteria Rows */}
              <tr>
                <td colSpan={12} className="border border-gray-400 p-2 text-center bg-gray-100">
                  Operator Judgement Criteria
                </td>
              </tr>

              <tr>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">Sr. No.</td>
                <td colSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">Parameter</td>
                <td colSpan={4} className="border border-gray-400 p-2 text-center bg-gray-100">Contents</td>
                <td colSpan={3} className="border border-gray-400 p-2 text-center bg-gray-100">Judgement</td>
                <td colSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">Remarks</td>
              </tr>

              {formData.judgementCriteria.map((criteria, index) => (
                <tr key={index}>
                  {criteria.contents === 'Working as per Work Instruction & Operation standard' && (
                    <td rowSpan={4} className="border border-gray-400 p-2 text-center bg-gray-100">
                      {criteria.srNo}
                    </td>
                  )}
                  {criteria.contents === 'Working as per Work Instruction & Operation standard' && (
                    <td colSpan={2} rowSpan={4} className="border border-gray-400 p-2 text-center bg-gray-100">
                      {criteria.parameter}
                    </td>
                  )}
                  {criteria.contents === 'All 5S maintain' && (
                    <td rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">
                      {criteria.srNo}
                    </td>
                  )}
                  {criteria.contents === 'All 5S maintain' && (
                    <td colSpan={2} rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">
                      {criteria.parameter}
                    </td>
                  )}
                  <td colSpan={4} className="border border-gray-400 p-2 bg-gray-100">
                    {criteria.contents}
                  </td>
                  <td colSpan={3} className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={criteria.judgement}
                      onChange={(e) => handleJudgementCriteriaChange(index, 'judgement', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                  <td colSpan={2} className="border border-gray-400 p-2">
                    <input
                      type="text"
                      value={criteria.remarks}
                      onChange={(e) => handleJudgementCriteriaChange(index, 'remarks', e.target.value)}
                      className="border border-gray-300 p-1 w-full"
                    />
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={12} className="border border-gray-400 p-2 text-center bg-gray-100">
                  Judgement Criteria: Use "o" Mark if answer is clear, Use "Δ" Mark if answer is unclear.
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenCycleTable;