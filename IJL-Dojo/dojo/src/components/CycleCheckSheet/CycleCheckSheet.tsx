import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

const dayOptions = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];

const getScoreOptions = (maxScore: number) => {
  if (maxScore === 2) {
    return [
      { value: "0", label: '0 - Not Following standard' },
      { value: "1", label: '1 - Following Partially' },
      { value: "2", label: '2 - Following Properly' }
    ];
  } else if (maxScore === 10) {
    return [
      { value: "0", label: '0 - Not Following standard' },
      { value: "5", label: '5 - Following Partially' },
      { value: "10", label: '10 - Following Properly' }
    ];
  }
  return [];
};

const defaultTopics = [
  { id: 1, slno: 1, cycle_topics: "Initial Quality check", sub_topic: "Quality & Checking of product", points: ["Quality & Checking of product", "Handling"], score_required: 2 },
  { id: 2, slno: 2, cycle_topics: "Work as per SOP", sub_topic: "Adherence of SOP", points: ["Adherence of SOP", "Understand of SOP"], score_required: 2 },
  { id: 3, slno: 3, cycle_topics: "Output Quality check", sub_topic: "Air blow", points: ["Air blow", "in proper sequence"], score_required: 2 },
  { id: 4, slno: 4, cycle_topics: "Cycle Time", sub_topic: "", points: ["", ""], score_required: 10 },
  { id: 5, slno: 5, cycle_topics: "Knowledge", sub_topic: "1. Purpose of the work", points: ["1. Purpose of the work", "2. Impact at the customer end"], score_required: 2 },
  { id: 6, slno: 6, cycle_topics: "Safety", sub_topic: "Wearing PPE", points: ["Wearing PPE", "-Gloves"], score_required: 2 },
  { id: 7, slno: 7, cycle_topics: "Discipline", sub_topic: "Uniform / Shoe", points: ["Uniform / Shoe", "ID Card / Cap"], score_required: 2 }
];

interface Topic {
  id: number;
  slno: number;
  cycle_topics: string;
  sub_topic: string;
  points: string[];
  score_required: number;
}

interface EvaluationData {
  evaluations: any[];
  per_day_results: { day: string; score: number; status: string }[];
  final_status: string;
}

const initialFormData = (location: any) => {
  const { operatorId, lineName, operationName, sectionTitle } = location.state || {};
  return {
    line: sectionTitle || lineName || '',
    processName: operationName || lineName || '',
    operationNo: '',
    name: '',
    ccNo: operatorId || '',
    department: '',
    dateOfJoin: '',
    dateOfRetraining: '',
    shift: '',
    date: '',
    preparedBy: '',
    checkedBy: '',
    approvedBy: ''
  };
};

const CycleCheckSheet: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormData(location));
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedDay, setSelectedDay] = useState(dayOptions[0]);
  const [evaluationScores, setEvaluationScores] = useState<{ [key: string]: string }>({});
  const [existingData, setExistingData] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [performanceId, setPerformanceId] = useState<number | null>(null);
  const [dayEvaluationId, setDayEvaluationId] = useState<number | null>(null);
  const [operatorMasterId, setOperatorMasterId] = useState<number | null>(null);
  const [enabledDays, setEnabledDays] = useState<string[]>([dayOptions[0]]);
  const [perDayResults, setPerDayResults] = useState<EvaluationData['per_day_results']>([]);
  const [finalStatus, setFinalStatus] = useState<string>('Not Evaluated');
  const [allDaysCompleted, setAllDaysCompleted] = useState(false);



  // Load topics on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/topics/`);
        if (!res.ok) throw new Error('Failed to fetch topics');
        const data = await res.json();
        setTopics(data.length > 0 ? data : defaultTopics);
      } catch (error) {
        setTopics(defaultTopics);
      }
    };
    fetchTopics();
  }, []);

  // Fetch operator and evaluation data by CC No
  useEffect(() => {
    const { operatorId } = location.state || {};
    if (operatorId) {
      handleCCNoChange(operatorId);
    }
    // eslint-disable-next-line
  }, [location.state?.operatorId]);

  // Fetch operator and evaluation data
  const handleCCNoChange = async (ccNo: string) => {
    setFormData(prev => ({ ...prev, ccNo }));

    if (!ccNo.trim()) return;

    setLoading(true);
    try {
      // Fetch employee details
      const empRes = await fetch(`${API_BASE_URL}/operators-master/by-employee-code/${ccNo}/`);
      if (!empRes.ok) throw new Error('Employee not found');
      const employee = await empRes.json();
      setOperatorMasterId(employee.id);
      setFormData(prev => ({
        ...prev,
        name: employee.full_name || '',
        ccNo: employee.employee_code || '',
        department: employee.department || '',
        dateOfJoin: employee.date_of_join || '',
        // Do NOT reset line or processName here!
        operationNo: '',
        dateOfRetraining: '',
        shift: '',
        date: '',
        preparedBy: '',
        checkedBy: '',
        approvedBy: '',
      }));

      // Fetch evaluation data for employee
      const evalRes = await fetch(`${API_BASE_URL}/evaluation-topic-marks/by-employee-code/${ccNo}/`);
      if (!evalRes.ok) throw new Error('Evaluation data not found');
      const data: EvaluationData = await evalRes.json();
      setExistingData(data);

      // Update enabledDays based on completed days + next day
     const completedDays = data.per_day_results.map(d => d.day);
const lastCompletedIndex = dayOptions.findIndex(day => day === completedDays[completedDays.length - 1]);
let newEnabledDays = dayOptions.slice(0, lastCompletedIndex + 2);
if (newEnabledDays.length === 0) newEnabledDays = [dayOptions[0]];

setEnabledDays(newEnabledDays);

const newDay = newEnabledDays[newEnabledDays.length - 1];
setSelectedDay(newDay);


      setPerDayResults(data.per_day_results);
      setFinalStatus(data.final_status);

      // If all days are completed, mark as such
      setAllDaysCompleted(newEnabledDays.length === 6 && completedDays.length === 6);

      // Load scores and info for selected day
      const dayEvaluations = data.evaluations.filter(e => e.days?.day === newDay) || [];
      loadScoresAndInfoForDay(dayEvaluations);

      if (dayEvaluations.length > 0) {
        setPerformanceId(dayEvaluations[0].employee?.id || null);
        setDayEvaluationId(dayEvaluations[0].days?.id || null);
      } else {
        setPerformanceId(null);
        setDayEvaluationId(null);
      }
    } catch (error) {
      setExistingData(null);
      setEvaluationScores({});
      setPerformanceId(null);
      setDayEvaluationId(null);
      setEnabledDays([dayOptions[0]]);
      setPerDayResults([]);
      setFinalStatus('Not Evaluated');
      setAllDaysCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  // Load evaluation scores and info for a day
  const loadScoresAndInfoForDay = (evaluations: any[]) => {
    const newScores: { [key: string]: string } = {};
    let infoSet = false;
    let info: any = {};
    evaluations.forEach(evaluation => {
      const topicId = evaluation.topic_name?.id || evaluation.topic_name;
      for (let i = 1; i <= 10; i++) {
        const markKey = `mark_${i}`;
        const scoreKey = `${topicId}-${i - 1}`;
        if (evaluation[markKey] !== null && evaluation[markKey] !== undefined) {
          newScores[scoreKey] = evaluation[markKey].toString();
        } else {
          newScores[scoreKey] = '';
        }
      }
      // Set info fields from first evaluation (all have same info for the day)
      if (!infoSet && evaluation.employee) {
        info = {
          operationNo: evaluation.employee.operation_no || '',
          date: evaluation.employee.date || '',
          dateOfRetraining: evaluation.employee.date_of_retraining_completed || '',
          shift: evaluation.employee.shift || '',
          preparedBy: evaluation.employee.prepared_by || '',
          checkedBy: evaluation.employee.checked_by || '',
          approvedBy: evaluation.employee.approved_by || ''
        };
        infoSet = true;
      }
    });
    setEvaluationScores(newScores);

    if (infoSet) {
      setFormData(prev => ({
        ...prev,
        operationNo: info.operationNo,
        date: info.date,
        dateOfRetraining: info.dateOfRetraining,
        shift: info.shift,
        preparedBy: info.preparedBy,
        checkedBy: info.checkedBy,
        approvedBy: info.approvedBy
      }));
    } else {
      // Reset info fields for a new (not yet submitted) day
      setFormData(prev => ({
        ...prev,
        operationNo: '',
        date: '',
        dateOfRetraining: '',
        shift: '',
        preparedBy: '',
        checkedBy: '',
        approvedBy: ''
      }));
    }
  };

  // Handle day change, only allow if day enabled
  const handleDayChange = (day: string) => {
    setSelectedDay(day);

    if (existingData) {
      const dayEvaluations = existingData.evaluations.filter(e => e.days?.day === day) || [];
      loadScoresAndInfoForDay(dayEvaluations);
      if (dayEvaluations.length > 0) {
        setDayEvaluationId(dayEvaluations[0].days?.id || null);
        setPerformanceId(dayEvaluations[0].employee?.id || null);
      } else {
        setDayEvaluationId(null);
        setPerformanceId(null);
        setEvaluationScores({});
        setFormData(prev => ({
          ...prev,
          operationNo: '',
          date: '',
          dateOfRetraining: '',
          shift: '',
          preparedBy: '',
          checkedBy: '',
          approvedBy: ''
        }));
      }
    }
  };

  // Only current editable day is editable
  const currentEditableDay = enabledDays[enabledDays.length - 1];
  const isEditable = selectedDay === currentEditableDay && !allDaysCompleted && (!perDayResults.find(d => d.day === selectedDay && d.status === 'Completed'));

  // Store string values for dropdowns
  const handleScoreChange = (topicId: number, cycleIndex: number, value: string) => {
    if (!isEditable) return;
    setEvaluationScores(prev => ({
      ...prev,
      [`${topicId}-${cycleIndex}`]: value
    }));
  };

  // Calculate total for each cycle (1-10)
  const calculateTotalForCycle = (cycleIndex: number) => {
    return topics.reduce((sum, topic) => {
      const scoreStr = evaluationScores[`${topic.id || topic.slno}-${cycleIndex}`];
      const score = scoreStr !== undefined && scoreStr !== '' ? parseInt(scoreStr) : 0;
      return sum + score;
    }, 0);
  };

  // Handle input changes for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ccNo.trim()) {
      alert('CC No is required');
      return;
    }
    if (!formData.date) {
      alert('Date is required');
      return;
    }

    const numTopics = topics.length;
  const numCycles = 10;
  let allFilled = true;
  for (let t = 0; t < numTopics; t++) {
    const topicId = topics[t].id || topics[t].slno;
    for (let c = 0; c < numCycles; c++) {
      const key = `${topicId}-${c}`;
      if (
        evaluationScores[key] === undefined ||
        evaluationScores[key] === '' ||
        isNaN(Number(evaluationScores[key]))
      ) {
        allFilled = false;
        break;
      }
    }
    if (!allFilled) break;
  }
  if (!allFilled) {
    alert('Please select a score for every cycle of every topic before submitting.');
    return;
  }


    setLoading(true);
    try {
      // Create or update performance evaluation
      const performanceData = {
        cc_no: operatorMasterId,
        date: formData.date,
        shift: formData.shift,
        line: formData.line,
        process_name: formData.processName,
        operation_no: formData.operationNo,
        department: formData.department,
        date_of_retraining_completed: formData.dateOfRetraining || null,
        prepared_by: formData.preparedBy,
        checked_by: formData.checkedBy,
        approved_by: formData.approvedBy,
      };

      let response;
      if (performanceId) {
        response = await fetch(`${API_BASE_URL}/operator-performance/${performanceId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(performanceData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/operator-performance/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(performanceData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save performance evaluation');
      }

      const perfData = await response.json();
      setPerformanceId(perfData.id);

      // Create or get day evaluation
      let dayEvalId = dayEvaluationId;
      if (!dayEvalId) {
        const dayEvalRes = await fetch(`${API_BASE_URL}/operator-evaluation/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day: selectedDay }),
        });
        if (!dayEvalRes.ok) throw new Error('Failed to create day evaluation');
        const dayEvalData = await dayEvalRes.json();
        dayEvalId = dayEvalData.id;
        setDayEvaluationId(dayEvalId);
      }

      // Save marks for each topic (POST only, no PUT)
      await Promise.all(
        topics.map(async (topic) => {
          const topicId = topic.id || topic.slno;
          const marksData = {
            employee: perfData.id,
            topic_name: topicId,
            days: dayEvalId,
            mark_1: evaluationScores[`${topicId}-0`] !== undefined && evaluationScores[`${topicId}-0`] !== ''
              ? parseInt(evaluationScores[`${topicId}-0`]) : null,
            mark_2: evaluationScores[`${topicId}-1`] !== undefined && evaluationScores[`${topicId}-1`] !== ''
              ? parseInt(evaluationScores[`${topicId}-1`]) : null,
            mark_3: evaluationScores[`${topicId}-2`] !== undefined && evaluationScores[`${topicId}-2`] !== ''
              ? parseInt(evaluationScores[`${topicId}-2`]) : null,
            mark_4: evaluationScores[`${topicId}-3`] !== undefined && evaluationScores[`${topicId}-3`] !== ''
              ? parseInt(evaluationScores[`${topicId}-3`]) : null,
            mark_5: evaluationScores[`${topicId}-4`] !== undefined && evaluationScores[`${topicId}-4`] !== ''
              ? parseInt(evaluationScores[`${topicId}-4`]) : null,
            mark_6: evaluationScores[`${topicId}-5`] !== undefined && evaluationScores[`${topicId}-5`] !== ''
              ? parseInt(evaluationScores[`${topicId}-5`]) : null,
            mark_7: evaluationScores[`${topicId}-6`] !== undefined && evaluationScores[`${topicId}-6`] !== ''
              ? parseInt(evaluationScores[`${topicId}-6`]) : null,
            mark_8: evaluationScores[`${topicId}-7`] !== undefined && evaluationScores[`${topicId}-7`] !== ''
              ? parseInt(evaluationScores[`${topicId}-7`]) : null,
            mark_9: evaluationScores[`${topicId}-8`] !== undefined && evaluationScores[`${topicId}-8`] !== ''
              ? parseInt(evaluationScores[`${topicId}-8`]) : null,
            mark_10: evaluationScores[`${topicId}-9`] !== undefined && evaluationScores[`${topicId}-9`] !== ''
              ? parseInt(evaluationScores[`${topicId}-9`]) : null,
          };

          // Only POST, never PUT (do not update after creation)
          const existingEval = existingData?.evaluations?.find(
            (e) => (e.topic_name?.id || e.topic_name) === topicId && e.days?.id === dayEvalId
          );
          if (!existingEval) {
            const res = await fetch(`${API_BASE_URL}/evaluation-topic-marks/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(marksData),
            });
            if (!res.ok) throw new Error(`Failed to save marks for topic ${topicId}`);
          }
        })
      );

      alert(`${selectedDay} evaluation saved successfully!`);

      // Enable next day for submission
      const currentIndex = dayOptions.indexOf(selectedDay);
      if (currentIndex < dayOptions.length - 1) {
        setEnabledDays((prev) => {
          const nextDay = dayOptions[currentIndex + 1];
          if (!prev.includes(nextDay)) return [...prev, nextDay];
          return prev;
        });
      }

      // Reset date for next day (and info fields)
      setFormData(prev => ({
        ...prev,
        date: '',
        operationNo: '',
        dateOfRetraining: '',
        shift: '',
        preparedBy: '',
        checkedBy: '',
        approvedBy: ''
      }));

      // Refresh data for current CC No to update UI
      await handleCCNoChange(formData.ccNo);
    } catch (error: any) {
      alert(`Error saving evaluation: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Final total calculation for all days
  const grandTotal = perDayResults.reduce((sum, d) => sum + (d.score || 0), 0);
  const passStatus = finalStatus?.toLowerCase().includes('pass');

  const selectedDayResult = perDayResults.find(r => r.day === selectedDay) || null;


  if (loading) {
    return <div className="p-4">Loading operator data...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="border border-black text-xs">
          {/* Main Header */}
          <div className="flex items-center border-b border-black">
            <div className="w-32 p-2 border-r border-black font-bold text-center">IJL-BAWAL</div>
            <div className="flex-grow p-2 border-r border-black text-center font-bold">
              10 Cycle Evaluation Check Fields - Level 2
            </div>
            <div className="w-48 p-2">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Date :</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-1 py-0.5 text-xs focus:outline-none focus:border-blue-500"
                  required
                  readOnly={!isEditable}
                />
              </div>
            </div>
          </div>

          {/* Information Row 1 */}
          <div className="flex border-b border-black">
            <div className="w-44 p-2 border-r border-black">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Line :</span>
                <input
                  type="text"
                  name="line"
                  value={formData.line}
                  readOnly
                  className="w-full border border-gray-300 px-1 py-0.5 text-xs bg-gray-100"
                  required
                />
              </div>
            </div>
            <div className="w-50 p-2 border-r border-black">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Process Name :</span>
                <input
                  type="text"
                  name="processName"
                  value={formData.processName}
                  readOnly
                  className="w-full border border-gray-300 px-1 py-0.5 text-xs bg-gray-100"
                  required
                />
              </div>
            </div>
            <div className="w-50 p-2 border-r border-black">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Operation No. :</span>
                <input
                  type="text"
                  name="operationNo"
                  value={formData.operationNo}
                  onChange={handleInputChange}
                  className={`w-full border border-gray-300 px-1 py-0.5 text-xs ${isEditable ? 'focus:outline-none focus:border-blue-500' : 'bg-gray-100'}`}
                  readOnly={!isEditable}
                />
              </div>
            </div>
            <div className="w-50 p-2 border-r border-black">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Name :</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  readOnly
                  className="w-full border border-gray-300 px-1 py-0.5 text-xs bg-gray-100"
                  required
                />
              </div>
            </div>
            <div className="w-64 p-2">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Employee Code :</span>
                <input
                  type="text"
                  name="ccNo"
                  value={formData.ccNo}
                  readOnly
                  className="w-full border border-gray-300 px-1 py-0.5 text-xs bg-gray-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Information Row 2 */}
          <div className="flex border-b border-black">
            <div className="w-44 p-2 border-r border-black">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Department :</span>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  readOnly
                  className="w-full border border-gray-300 px-1 py-0.5 text-xs bg-gray-100"
                  required
                />
              </div>
            </div>
            <div className="w-50 p-2 border-r border-black">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Date of Join :</span>
                <input
                  type="date"
                  name="dateOfJoin"
                  value={formData.dateOfJoin}
                  readOnly
                  className="w-full border border-gray-300 px-1 py-0.5 text-xs bg-gray-100"
                  required
                />
              </div>
            </div>
            <div className="w-50 p-2 border-r border-black">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Date of Re-training completed :</span>
                <input
                  type="date"
                  name="dateOfRetraining"
                  value={formData.dateOfRetraining}
                  onChange={handleInputChange}
                  className={`w-full border border-gray-300 px-1 py-0.5 text-xs ${isEditable ? 'focus:outline-none focus:border-blue-500' : 'bg-gray-100'}`}
                  readOnly={!isEditable}
                />
              </div>
            </div>
          </div>

          {/* Date/Shift Row with Day Selection */}
          <div className="flex border-b border-black">
            <div className="w-44 p-2 border-r border-black">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap">Shift :</span>
                <input
                  type="text"
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className={`w-full border border-gray-300 px-1 py-0.5 text-xs ${isEditable ? 'focus:outline-none focus:border-blue-500' : 'bg-gray-100'}`}
                  readOnly={!isEditable}
                />
              </div>
            </div>
            <div className="flex-grow p-2 flex items-center justify-center">
              <span className="font-medium mr-2">Day:</span>
              <select
                value={selectedDay}
                onChange={(e) => handleDayChange(e.target.value)}
                className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
              >
                {dayOptions.map(day => (
                  <option
                    key={day}
                    value={day}
                    disabled={!enabledDays.includes(day)}
                    style={{ color: enabledDays.includes(day) ? 'black' : 'grey' }}
                  >
                    {day}
                  </option>
                ))}
              </select>
              <span className="ml-4 font-bold">{selectedDay}</span>
            </div>
          </div>

          {/* Column Headers */}
          <div className="flex border-b border-black bg-gray-100">
            <div className="w-12 p-1 border-r border-black text-center font-medium">S.No.</div>
            <div className="w-64 p-1 border-r border-black text-center font-medium">Cycle</div>
            <div className="w-24 p-1 border-r border-black text-center font-medium">Score</div>
            {[...Array(10)].map((_, i) => (
              <div
                key={`cycle-${i}`}
                className="flex-1 p-1 border-r border-black text-center font-medium"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Evaluation Topics */}
          {topics.map((topic, index) => (
            <div key={index} className="flex border-b border-black min-h-16">
              {/* S.No. */}
              <div className="w-12 p-1 border-r border-black text-center flex items-center justify-center">
                {topic.slno || topic.id || index + 1}
              </div>
              {/* Cycle Column (with two sub-columns) */}
              <div className="w-64 border-r border-black flex">
                <div className="w-1/2 p-1 border-r border-black flex items-center">
                  {topic.cycle_topics}
                </div>
                <div className="w-1/2 p-1 flex items-center text-xs">
                  {topic.sub_topic}
                </div>
              </div>
              {/* Score */}
              <div className="w-24 p-1 border-r border-black text-center flex items-center justify-center">
                {topic.score_required}
              </div>
              {/* Cycle Scores */}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`cycle-${i}-topic-${topic.id || topic.slno || index}`}
                  className="flex-1 p-1 border-r border-black flex items-center justify-center"
                >
                  <select
                    disabled={!isEditable}
                    value={evaluationScores[`${topic.id || topic.slno}-${i}`] ?? ''}
                    onChange={(e) => handleScoreChange(topic.id || topic.slno, i, e.target.value)}
                    className="w-full h-8 text-center border-0 bg-transparent text-xs focus:outline-none focus:bg-gray-50"
                  >
                    <option value="">-</option>
                    {getScoreOptions(topic.score_required).map(option => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}

          {/* Total Marks Row */}
          <div className="flex border-b border-black h-12">
            <div className="w-12 p-1 border-r border-black flex items-center justify-center"></div>
            <div className="w-64 border-r border-black flex">
              <div className="w-1/2 p-1 border-r border-black flex items-center">
                <div className="font-medium">Marks</div>
              </div>
              <div className="w-1/2 p-1 flex items-center text-xs">
                <div>Out of 22</div>
              </div>
            </div>
            <div className="w-24 p-1 border-r border-black flex items-center justify-center"></div>
            {[...Array(10)].map((_, i) => {
              const total = calculateTotalForCycle(i);
              const isPass = total >= 13.2; // 60% of 22

              return (          
                <div
                  key={`total-${i}`}
                  className={`flex-1 p-1 border-r border-black flex items-center justify-center font-medium ${
  (total === 0 || !isPass) ? 'text-red-600' : 'text-green-600'
}`}

                >
                  {total === 0 ? 0 : total || ''}

                </div>
              );
            })}
          </div>

          <div className="text-left p-1 border-b border-black text-xs">
            HR-FM-62 Rev. No. -02(w.e.f. 01.06.2019)
          </div>

          {/* Signature Section */}
          <div className="flex">
            <div className="flex-1 p-2 border-r border-black">
              <div className="font-medium text-xs mb-1">Prepared By - SDC Trainer</div>
              <input
                type="text"
                name="preparedBy"
                value={formData.preparedBy}
                onChange={handleInputChange}
                className={`w-full border border-gray-300 px-1 py-0.5 text-xs ${isEditable ? 'focus:outline-none focus:border-blue-500' : 'bg-gray-100'}`}
                placeholder="Enter name"
                readOnly={!isEditable}
              />
            </div>
            <div className="flex-1 p-2 border-r border-black">
              <div className="font-medium text-xs mb-1">Checked By - TL / Production / Quality</div>
              <input
                type="text"
                name="checkedBy"
                value={formData.checkedBy}
                onChange={handleInputChange}
                className={`w-full border border-gray-300 px-1 py-0.5 text-xs ${isEditable ? 'focus:outline-none focus:border-blue-500' : 'bg-gray-100'}`}
                placeholder="Enter name"
                readOnly={!isEditable}
              />
            </div>
            <div className="flex-1 p-2">
              <div className="font-medium text-xs mb-1">Approved By - SDC Manager</div>
              <input
                type="text"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleInputChange}
                className={`w-full border border-gray-300 px-1 py-0.5 text-xs ${isEditable ? 'focus:outline-none focus:border-blue-500' : 'bg-gray-100'}`}
                placeholder="Enter name"
                readOnly={!isEditable}
              />
            </div>
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex-1 border border-black p-2">
            <div className="font-bold text-center mb-2">Evaluation Criteria (Score 2):</div>
            <div>0 - Not Following standard</div>
            <div>1 - Following standard Partially</div>
            <div>2 - Following standard Properly</div>
          </div>
          <div className="flex-1 border border-black p-2">
            <div className="font-bold text-center mb-2">Cycle Time Criteria (Score 10):</div>
            <div>0 - Not Following standard</div>
            <div>5 - Following cycle time Partially</div>
            <div>10 - Following cycle time Properly</div>
          </div>
          <div className="flex-1 border border-black p-2">
            <div className="font-bold text-center mb-2">Passing Criteria:</div>
            <div>More than 60% - Pass</div>
            <div>Less than 60% - Fail</div>
            <div>Fail - Re-training Required</div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4 text-center">
          <button
            type="submit"
            disabled={loading || !formData.ccNo || !formData.date || !isEditable}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : `Submit ${selectedDay} Evaluation`}
          </button>
        </div>
      </form>

     {perDayResults.length > 0 && (
      
    // <div className="mt-4 text-sm flex flex-row gap-16 items-start">
    <div style={{ display: 'flex', flexDirection: 'row', gap: '550px', alignItems: 'flex-start' }}>
    {/* Per-Day Result Table */}
    <div>
      <h4 className="font-bold mb-2">Result</h4>
      <table className="min-w-max border border-gray-400 rounded text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Day</th>
            <th className="border px-2 py-1">Marks</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {selectedDayResult && (
            <tr>
              <td className="border px-2 py-1">{selectedDayResult.day}</td>
              <td className={`border px-2 py-1 font-semibold ${selectedDayResult.score >= 132 ? 'text-green-700' : 'text-red-700'}`}>
                {selectedDayResult.score}
              </td>
              <td className={`border px-2 py-1 font-semibold ${
                selectedDayResult.status.toLowerCase().includes('pass') ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedDayResult.status}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="text-xs text-gray-500 mt-1">
        <span className="text-green-700 font-bold">Pass:</span> Marks ≥ 132 per day, Grand Total ≥ 792.
        <span className="ml-4 text-red-700 font-bold">Fail:</span> Marks &lt; 132 per day or Grand Total &lt; 792.
      </div>
    </div>

    {/* Grand Total & Final Status Table */}
    {perDayResults.length === 6 && (
      <div>
        <h4 className="font-bold mb-2">Summary</h4>
        <table className="min-w-max border border-gray-400 rounded text-center">
          <tbody>
            <tr className="bg-gray-50 font-bold">
              <td className="border px-2 py-1">Grand Total</td>
              <td className="border px-2 py-1">{grandTotal}</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">Final Status</td>
              <td className="border px-2 py-1">
                <span className={passStatus ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                  {finalStatus}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )}
  </div>
)}







    </div>
  );
};

export default CycleCheckSheet;







