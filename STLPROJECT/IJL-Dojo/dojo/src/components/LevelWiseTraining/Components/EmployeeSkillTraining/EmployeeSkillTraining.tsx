import React, { useState, ChangeEvent, useEffect, useRef } from 'react';

const EmployeeSkillTraining = () => {
  // Array of days for confirmation period
  const days = [15, 16, 17, 18, 19, 20, 21];

  // Interface for form data
  interface FormData {
    operator_name: string;
    operator_employee_code: string;
    doj: string;
    trainer_name: string;
    process_name: string;
    line_name_or_no: string;
    document_number: string;
    revision_number_and_date: string;
    effective_date: string;
    retention_period_years: string;
    prepared_by: string;
    checked_by: string;
    approved_by: string;
  }

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    operator_name: '',
    operator_employee_code: '',
    doj: '',
    trainer_name: '',
    process_name: '',
    line_name_or_no: '',
    document_number: '',
    revision_number_and_date: '',
    effective_date: '',
    retention_period_years: '',
    prepared_by: '',
    checked_by: '',
    approved_by: ''
  });

  // Interface for assessment item
  interface AssessmentItem {
    id: number;
    description: string;
    details: string;
    standard: string;
    dayResults: { [key: string]: string };
    remarks: string;
  }

  // Assessment items with descriptions
  const initialAssessmentItems: AssessmentItem[] = [
    {
      id: 18,
      description: "Does operator aware about the safety precautions.?",
      details: "Like: About emergency switch uses, Safety sensors purpose, Two hand operating, etc.",
      standard: "Defined procedures & Verbal Viva",
      dayResults: {},
      remarks: ''
    },
    {
      id: 19,
      description: "Does operator know the machine startup process.?",
      details: "Like: M/c ON/OFF procedure, Pressure gauge reading awareness, Other equipment condition confirmation awareness, etc.",
      standard: "Defined procedures & Verbal Viva",
      dayResults: {},
      remarks: ''
    },
    {
      id: 20,
      description: "Does operator know about the masters/ Poka-yoke & their checking method.?",
      details: "Like: Storage Location of masters, Masters confirmation method, Poka-yoke verification (If applicable), etc.",
      standard: "Defined procedures & Verbal Viva",
      dayResults: {},
      remarks: ''
    },
    {
      id: 21,
      description: "Does operator follow the standard procedure.?",
      details: "Like: Follow the pick & place locations, Operations sequences, Loading & unloading as per decided rules, etc.",
      standard: "Defined procedures & Verbal Viva",
      dayResults: {},
      remarks: ''
    },
    {
      id: 22,
      description: "Does operator aware about the process critical points.?",
      details: "Like: awareness of critical quality parameters, Data & dimension check sheet filling method, Defect matrix, etc.",
      standard: "Defined procedures & Verbal Viva",
      dayResults: {},
      remarks: ''
    },
    {
      id: 23,
      description: "Does operator know the abnormality handling rules.?",
      details: "Like: Product and equipment abnormal handling flow & rule, 'Stop→Call→Wait' procedure, etc.",
      standard: "Defined procedures & Verbal Viva",
      dayResults: {},
      remarks: ''
    },
    {
      id: 24,
      description: "Does operator know the FIFO management system and Drop part management system.?",
      details: "Like: First IN first OUT flow system, Handling of drop parts which founds at m/c or floor, etc.",
      standard: "Defined procedures & Verbal Viva",
      dayResults: {},
      remarks: ''
    },
    {
      id: 25,
      description: "Does operator producing the good quality products.?",
      details: "[Due to operator mistake]",
      standard: "Zero defects in produced Qty.",
      dayResults: {},
      remarks: ''
    },
    {
      id: 26,
      description: "Does operator achieving the standard cycle time of Operation.?",
      details: "",
      standard: "…………Sec.",
      dayResults: {},
      remarks: ''
    }
  ];

  const [assessmentItems, setAssessmentItems] = useState<AssessmentItem[]>(initialAssessmentItems);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExistingEmployee, setIsExistingEmployee] = useState(false);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch employee data when employee code changes
  const fetchEmployeeData = async (employeeCode: string) => {
    if (!employeeCode.trim()) {
      // Reset form if employee code is empty
      setFormData({
        operator_name: '',
        operator_employee_code: employeeCode,
        doj: '',
        trainer_name: '',
        process_name: '',
        line_name_or_no: '',
        document_number: '',
        revision_number_and_date: '',
        effective_date: '',
        retention_period_years: '',
        prepared_by: '',
        checked_by: '',
        approved_by: ''
      });
      setAssessmentItems(initialAssessmentItems);
      setIsExistingEmployee(false);
      setEmployeeId(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/employees/${employeeCode}`);
      
      if (response.ok) {
        const employeeData = await response.json();
        
        // Fill form with fetched data
        setFormData({
          operator_name: employeeData.operator_name || '',
          operator_employee_code: employeeCode,
          doj: employeeData.doj || '',
          trainer_name: employeeData.trainer_name || '',
          process_name: employeeData.process_name || '',
          line_name_or_no: employeeData.line_name_or_no || '',
          document_number: employeeData.document_number || '',
          revision_number_and_date: employeeData.revision_number_and_date || '',
          effective_date: employeeData.effective_date || '',
          retention_period_years: employeeData.retention_period_years?.toString() || '',
          prepared_by: employeeData.prepared_by || '',
          checked_by: employeeData.checked_by || '',
          approved_by: employeeData.approved_by || ''
        });

        // Update assessment items with fetched activities
        if (employeeData.activities && employeeData.activities.length > 0) {
          const updatedItems = assessmentItems.map(item => {
            const activity = employeeData.activities.find((act: any) => act.activity_no === item.id);
            if (activity) {
              return {
                ...item,
                dayResults: {
                  day_15: activity.day_15_result || '',
                  day_16: activity.day_16_result || '',
                  day_17: activity.day_17_result || '',
                  day_18: activity.day_18_result || '',
                  day_19: activity.day_19_result || '',
                  day_20: activity.day_20_result || '',
                  day_21: activity.day_21_result || ''
                },
                remarks: activity.remarks || ''
              };
            }
            return item;
          });
          setAssessmentItems(updatedItems);
        }

        setIsExistingEmployee(true);
        setEmployeeId(employeeData.id);
        
      } else if (response.status === 404) {
        // Employee not found - keep the employee code but reset other fields
        setFormData(prev => ({
          ...prev,
          operator_employee_code: employeeCode
        }));
        setIsExistingEmployee(false);
        setEmployeeId(null);
      } else {
        console.error('Failed to fetch employee data');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.operator_name.trim()) {
      newErrors.operator_name = 'Operator name is required';
    }
    
    if (!formData.operator_employee_code.trim()) {
      newErrors.operator_employee_code = 'Employee code is required';
    }
    
    if (!formData.doj.trim()) {
      newErrors.doj = 'Date of joining is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.doj)) {
      newErrors.doj = 'Date must be in YYYY-MM-DD format';
    }
    
    if (!formData.effective_date.trim()) {
      newErrors.effective_date = 'Effective date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.effective_date)) {
      newErrors.effective_date = 'Date must be in YYYY-MM-DD format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)


const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
  const { name, value } = e.target;

  if (name === 'operator_employee_code') {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchEmployeeData(value);
    }, 500);
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

  // Handle select changes for day results
  const handleDayResultChange = (itemId: number, day: number, value: string) => {
    setAssessmentItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              dayResults: { 
                ...item.dayResults, 
                [`day_${day}`]: value 
              } 
            } 
          : item
      )
    );
  };

  // Handle remarks change
  const handleRemarksChange = (itemId: number, value: string) => {
    setAssessmentItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, remarks: value } 
          : item
      )
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      operator_name: formData.operator_name,
      operator_employee_code: formData.operator_employee_code,
      doj: formData.doj,
      trainer_name: formData.trainer_name,
      process_name: formData.process_name,
      line_name_or_no: formData.line_name_or_no,
      document_number: formData.document_number,
      revision_number_and_date: formData.revision_number_and_date,
      effective_date: formData.effective_date,
      retention_period_years: parseInt(formData.retention_period_years) || 0,
      prepared_by: formData.prepared_by,
      checked_by: formData.checked_by,
      approved_by: formData.approved_by,
      activities: assessmentItems.map(item => ({
        activity_no: item.id,
        activity_content: item.description,
        observance_standard: item.standard,
        day_15_result: item.dayResults['day_15'] || '',
        day_16_result: item.dayResults['day_16'] || '',
        day_17_result: item.dayResults['day_17'] || '',
        day_18_result: item.dayResults['day_18'] || '',
        day_19_result: item.dayResults['day_19'] || '',
        day_20_result: item.dayResults['day_20'] || '',
        day_21_result: item.dayResults['day_21'] || '',
        remarks: item.remarks
      }))
    };

    try {
      let response;
      
      if (isExistingEmployee && employeeId) {
        // Use PUT request for existing employee
        response = await fetch(`http://127.0.0.1:8000/employees/${employeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
      } else {
        // Use POST request for new employee
        response = await fetch('http://127.0.0.1:8000/employees/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to save data');
      }

      const responseData = await response.json();
      console.log('Success:', responseData);
      alert(`Data ${isExistingEmployee ? 'updated' : 'saved'} successfully!`);
      
      // If it was a new employee, now it becomes an existing one
      if (!isExistingEmployee) {
        setIsExistingEmployee(true);
        setEmployeeId(responseData.id);
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="mx-auto bg-white text-sm p-4">
      {/* Loading indicator */}
      {isLoading && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          Loading employee data...
        </div>
      )}

      {/* Status indicator */}
      {formData.operator_employee_code && (
        <div className={`mb-4 p-2 rounded ${isExistingEmployee ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isExistingEmployee ? '✓ Existing employee data loaded' : '+ New employee - data will be created'}
        </div>
      )}

      {/* First table - Header and Employee Info */}
      <div className="w-full">
        <table className="table-fixed border-collapse border border-black w-full text-center text-sm">
          <tbody>
            {/* Row 1 */}
            <tr>
              <td colSpan={9} rowSpan={2} className="border border-black">EMPLOYEE SKILL TRAINING & MONITORING [LEVEL-3]
                [ON THE JOB TRAINING & EFFECTIVENESS CONFIRMATION]</td>
              <td rowSpan={1} className="border border-black">Document No</td>
              <td colSpan={2} rowSpan={1} className="border border-black">
                <input
                  type="text"
                  name="document_number"
                  value={formData.document_number}
                  onChange={handleInputChange}
                  className="w-full border-none text-center"
                />
              </td>
            </tr>

            {/* Row 2 */}
            <tr>
              <td className="border border-black">Rev. No / Date</td>
              <td colSpan={2} className="border border-black">
                <input
                  type="text"
                  name="revision_number_and_date"
                  value={formData.revision_number_and_date}
                  onChange={handleInputChange}
                  className="w-full border-none text-center"
                />
              </td>
            </tr>

            {/* Row 3 */}
            <tr>
              <td className="border border-black">Employee Name :</td>
              <td colSpan={2} className="border border-black">
                <input
                  type="text"
                  name="operator_name"
                  value={formData.operator_name}
                  onChange={handleInputChange}
                  className={`w-full border-none text-center ${errors.operator_name ? 'border-red-500' : ''}`}
                />
                {errors.operator_name && <div className="text-red-500 text-xs">{errors.operator_name}</div>}
              </td>

              <td className="border border-black">Emp. Code :</td>
              <td colSpan={2} className="border border-black">
                <input
                  type="text"
                  name="operator_employee_code"
                  value={formData.operator_employee_code}
                  onChange={handleInputChange}
                  placeholder="Enter employee code to fetch data"
                  className={`w-full border-none text-center ${errors.operator_employee_code ? 'border-red-500' : ''}`}
                />
                {errors.operator_employee_code && <div className="text-red-500 text-xs">{errors.operator_employee_code}</div>}
              </td>
              <td className="border border-black">DOJ: </td>
              <td colSpan={2} className="border border-black">
                <input
                  type="date"
                  name="doj"
                  value={formData.doj}
                  onChange={handleInputChange}
                  className={`w-full border-none text-center ${errors.doj ? 'border-red-500' : ''}`}
                />
                {errors.doj && <div className="text-red-500 text-xs">{errors.doj}</div>}
              </td>
              <td className="border border-black">Effective Date</td>
              <td colSpan={2} className="border border-black">
                <input
                  type="date"
                  name="effective_date"
                  value={formData.effective_date}
                  onChange={handleInputChange}
                  className={`w-full border-none text-center ${errors.effective_date ? 'border-red-500' : ''}`}
                />
                {errors.effective_date && <div className="text-red-500 text-xs">{errors.effective_date}</div>}
              </td>
            </tr>

            {/* Row 4 */}
            <tr>
              <td className="border border-black">Trainer Name :</td>
              <td colSpan={2} className="border border-black">
                <input
                  type="text"
                  name="trainer_name"
                  value={formData.trainer_name}
                  onChange={handleInputChange}
                  className="w-full border-none text-center"
                />
              </td>

              <td className="border border-black">Process Name :</td>
              <td colSpan={2} className="border border-black">
                <input
                  type="text"
                  name="process_name"
                  value={formData.process_name}
                  onChange={handleInputChange}
                  className="w-full border-none text-center"
                />
              </td>
              <td className="border border-black">Line Name/N0.</td>
              <td colSpan={2} className="border border-black">
                <input
                  type="text"
                  name="line_name_or_no"
                  value={formData.line_name_or_no}
                  onChange={handleInputChange}
                  className="w-full border-none text-center"
                />
              </td>
              <td className="border border-black">Retention Period</td>
              <td colSpan={2} className="border border-black">
                <input
                  type="text"
                  name="retention_period_years"
                  value={formData.retention_period_years}
                  onChange={handleInputChange}
                  className="w-full border-none text-center"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Second table - Confirmation Table */}
      <div className="w-full">
        <table className="w-full border border-gray-400 border-collapse table-fixed">
          <thead>
            {/* Confirmation Period Header */}
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-2 py-2 text-center w-12" rowSpan={2}>S.No</th>
              <th className="border border-gray-400 px-2 py-2 text-center w-[400px]" rowSpan={2}>Activity Check Contents</th>
              <th className="border border-gray-400 px-2 py-2 text-center w-32" rowSpan={2}>
                Observance Standard/Method
              </th>
              <th colSpan={days.length} className="border border-gray-400 px-2 py-2 text-center">
                CONFIRMATION PERIOD
              </th>
              <th className="border border-gray-400 px-2 py-2 text-center w-28" rowSpan={2}>
                Remarks [Any observation]
              </th>
            </tr>

            {/* Days row */}
            <tr>
              {days.map(day => (
                <th key={day} className="border border-gray-400 px-1 py-1 text-center w-16 bg-gray-50">
                  Day {day}<br />
                  Result [O/Δ]
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Assessment Items */}
            {assessmentItems.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-400 px-2 py-1 text-center align-top">{item.id}</td>
                <td className="border border-gray-400 px-2 py-1 align-top w-[100px] md:w-[300px]">
                  {item.description}
                  <br />
                  <span className="font-semibold">Like:</span> {item.details}
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center align-middle">{item.standard}</td>
                {days.map((day) => (
                  <td key={`${item.id}-${day}`} className="border border-gray-400 p-0 text-center min-w-[20px]">
                    <select 
                      className="w-full h-10 focus:outline-none focus:ring focus:border-blue-300 bg-white"
                      value={item.dayResults[`day_${day}`] || ''}
                      onChange={(e) => handleDayResultChange(item.id, day, e.target.value)}
                    >
                      <option value=""></option>
                      <option value="O">O</option>
                      <option value="Δ">Δ</option>
                    </select>
                  </td>
                ))}
                <td className="border border-gray-400 p-0">
                  <input
                    type="text"
                    className="w-full h-10 p-1 focus:outline-none focus:ring focus:border-blue-300"
                    value={item.remarks}
                    onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}

            {/* Empty rows for additional items */}
            {[...Array(3)].map((_, idx) => (
              <tr key={`empty-row-${idx}`}>
                {idx === 0 && (
                  <td
                    className="border border-gray-400 px-2 py-4"
                    colSpan={2}
                    rowSpan={3}
                  >※ Important Points :
                    ・Consider for the mass production if operator performed the satisfactory performance continue.
                    ・Operating Cycle time confirmation to consider for manual process only. [Rest processes to be judge by loading & unloading CT]</td>
                )}
                <td className="border border-gray-400"></td>
                {days.map((day, dayIdx) => (
                  <td key={`empty-cell-${idx}-${dayIdx}`} className="border border-gray-400"></td>
                ))}
                <td className="border border-gray-400"></td>
              </tr>
            ))}
            <tr>
              <td className='h-10' colSpan={11}>Ø If observe the any improvement point, then plan for the Re-Training of operator on required topics.</td>
            </tr>
            <td colSpan={11} className="border border-black px-2 py-1 text-sm">
              <div className="flex justify-between">
                <span><strong>Result & Judgement criteria:</strong></span>
                <span>[O] - Satisfactory (If all related contents are clear)</span>
                <span>[△] - Need to Retrained (If related contents are not clear)</span>
              </div>
            </td>
            <tr>
              <td colSpan={11} className="border border-black px-2 py-1 text-sm">
                <div className="flex justify-between items-center">
                  <label>
                    Prepared By
                    <input 
                      type="text" 
                      name="prepared_by"
                      value={formData.prepared_by}
                      onChange={handleInputChange}
                      className="border-none outline-none ml-1" 
                    />
                  </label>
                  <label>
                    Checked By
                    <input 
                      type="text" 
                      name="checked_by"
                      value={formData.checked_by}
                      onChange={handleInputChange}
                      className="border-none outline-none ml-1" 
                    />
                  </label>
                  <label>
                    Approved By
                    <input 
                      type="text" 
                      name="approved_by"
                      value={formData.approved_by}
                      onChange={handleInputChange}
                      className="border-none outline-none ml-1" 
                    />
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSubmit}
          className={`font-bold py-2 px-4 rounded ${
            isExistingEmployee 
              ? 'bg-green-500 hover:bg-green-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          {isExistingEmployee ? 'Update Employee Data' : 'Create New Employee'}
        </button>
      </div>
    </div>
  );
};

export default EmployeeSkillTraining;