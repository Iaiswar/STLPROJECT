import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';

interface DailyObservation {
  date: string;
  day_number: number;
  checkpoint: number;
  scores: number[];
}

interface DayTotals {
  total_marks_out_of_180: number[];
  total_marks_out_of_200: number;
  percentage_score: number;
}

// Configuration for number of inputs per checkpoint
interface CheckpointConfig {
  id: number;
  name: string;
  description: string;
  maxScore: number;
  inputCount: number; // Number of inputs to display
  hasAdditionalRow?: boolean; // For checkpoints that have a second row
}

const renderTotalMarksRow = (dayTotals: { [day: number]: { total_marks_out_of_200: number } }) => {
  return (
    <tr>
      <td
        colSpan={4}
        className="border border-gray-400 bg-gray-100 text-center py-2 font-medium"
      >
        Total Marks Out of 200 (of the day)
      </td>
      {Array.from({ length: 6 }, (_, i) => {
        const dayTotal = dayTotals[i + 1];
        return (
          <td
            key={`total-200-day-${i + 1}`}
            colSpan={10}
            className="border border-gray-400 bg-gray-100 text-center"
          >
            {dayTotal?.total_marks_out_of_200 || 0}
          </td>
        );
      })}
    </tr>
  );
};


export default function EvaluationTable() {

   const [checkpoints, setCheckpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/checkpoints/')
      .then(response => {
        setCheckpoints(response.data);
        console.log(response)
      })
      .catch(error => {
        console.error('Error fetching checkpoints:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);



  // State to track all observations
  const [dailyObservations, setDailyObservations] = useState<DailyObservation[]>([]);
  const [dayTotals, setDayTotals] = useState<Record<number, DayTotals>>({});

  const [cycleTotals, setCycleTotals] = useState<{ [day: number]: number }>({});

  const handleCycleTotalChange = (day: number, value: number) => {
    setCycleTotals((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  // Define checkpoint configurations
  const checkpointConfigs: CheckpointConfig[] = [
    { id: 1, name: "Part Handling", description: "Check method of Handling parts", maxScore: 2, inputCount: 10 },
    { id: 2, name: "Input Quality", description: "Check Quality of Input Material", maxScore: 2, inputCount: 1 },
    { id: 3, name: "Work as per SOP/ Work Instruction", description: "Check understanding & Adherence of SOP / Work Instruction", maxScore: 2, inputCount: 1 },
    { id: 4, name: "Output Quality", description: "Check Quality of Output Part", maxScore: 2, inputCount: 1 },
    { id: 5, name: "Cycle Time", description: "Check as per SOP / Work Instruction", maxScore: 2, inputCount: 2, hasAdditionalRow: true },
    { id: 6, name: "Awareness", description: "a. Purpose of the work\nb. Impact to the customer", maxScore: 2, inputCount: 1 },
    { id: 7, name: "Safety", description: "Check PPEs as per Process requirement", maxScore: 2, inputCount: 1 },
    { id: 8, name: "Following Covid-19 Norms", description: "Mask, Face Shield, Social Distancing", maxScore: 2, inputCount: 1 },
    { id: 9, name: "Discipline", description: "ID Card / Uniform / Shoes / Cap", maxScore: 2, inputCount: 1 },
    { id: 10, name: "Production", description: "Desired/Actual", maxScore: 2, inputCount: 2, hasAdditionalRow: true },
  ];

  const [formData, setFormData] = useState({
    name: '',
    ecode: '',
    department: '',
    dateJoinedDOJO: '',
    dateJoinedDepartment: '',
    line: '',
    station: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // console.log(formData)

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Initialize scores state based on checkpoint configurations
  const [scores, setScores] = useState<Record<string, number[]>>(() => {
    const initialScores: Record<string, number[]> = {};
    for (let day = 1; day <= 6; day++) {
      for (const config of checkpointConfigs) {
        initialScores[`day${day}-checkpoint${config.id}`] = Array(config.inputCount).fill(0);
      }
    }
    return initialScores;
  });

  // Update a specific score
  const updateScore = (day: number, checkpoint: number, cycle: number, value: number) => {
    const key = `day${day}-checkpoint${checkpoint}`;
    setScores(prev => {
      const newScores = [...prev[key]];
      newScores[cycle - 1] = isNaN(value) ? 0 : Math.max(0, Math.min(2, value)); // Ensure value is between 0-2
      return {
        ...prev,
        [key]: newScores
      };
    });
  };

  // Convert scores to the desired observation format
  const convertToObservations = () => {
    const observations: DailyObservation[] = [];
    const currentDate = getCurrentDate();

    for (let day = 1; day <= 6; day++) {
      for (const config of checkpointConfigs) {
        const key = `day${day}-checkpoint${config.id}`;
        const checkpointScores = scores[key] || Array(config.inputCount).fill(0);

        // Only include if at least one score is non-zero
        if (checkpointScores.some(score => score > 0)) {
          observations.push({
            date: currentDate,
            day_number: day,
            checkpoint: config.id,
            scores: [...checkpointScores] // Copy the array
          });
        }
      }
    }

    return observations;
  };

  // Save observations
  const saveObservations = () => {
    const observations = convertToObservations();
    setDailyObservations(observations);
    console.log("Saved observations:", observations);
  };

  // Calculate day totals whenever scores change
  useMemo(() => {
    const newDayTotals: Record<number, DayTotals> = {};

    // Initialize day totals
    for (let day = 1; day <= 6; day++) {
      const maxCycles = Math.max(...checkpointConfigs.map(config => config.inputCount));
      newDayTotals[day] = {
        total_marks_out_of_180: Array(maxCycles).fill(0),
        total_marks_out_of_200: 0,
        percentage_score: 0
      };
    }

    // Calculate totals for each cycle
    for (let day = 1; day <= 6; day++) {
      // Count how many inputs we have for each cycle across all checkpoints
      const cycleInputCounts = Array(10).fill(0);

      for (const config of checkpointConfigs) {
        for (let cycle = 1; cycle <= config.inputCount; cycle++) {
          // Only count cycles that exist for this checkpoint
          if (cycle <= config.inputCount) {
            cycleInputCounts[cycle - 1]++;

            const key = `day${day}-checkpoint${config.id}`;
            const score = scores[key]?.[cycle - 1] || 0;
            newDayTotals[day].total_marks_out_of_180[cycle - 1] += score;
          }
        }
      }

      // Calculate day totals and percentages
      const sum = newDayTotals[day].total_marks_out_of_180.reduce((a, b) => a + b, 0);
      // Calculate maximum possible score based on number of inputs
      const maxPossibleScore = checkpointConfigs.reduce((total, config) =>
        total + (config.maxScore * config.inputCount), 0);

      newDayTotals[day].total_marks_out_of_200 = sum;
      newDayTotals[day].percentage_score = maxPossibleScore > 0 ?
        Math.round((sum / maxPossibleScore) * 100) : 0;
    }

    setDayTotals(newDayTotals);
  }, [scores]);

  // Calculate total score
  const calculateTotalScore = (): number => {
    let totalScore = 0;
    let totalPossibleScore = 0;

    for (let day = 1; day <= 6; day++) {
      for (const config of checkpointConfigs) {
        const key = `day${day}-checkpoint${config.id}`;
        const checkpointScores = scores[key] || [];

        totalScore += checkpointScores.reduce((sum, score) => sum + score, 0);
        totalPossibleScore += config.maxScore * config.inputCount;
      }
    }

    return totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
  };

  // Function to render day headers for all days
  const renderDayColumnsForAllDays = () => {
    return Array.from({ length: 6 }, (_, dayIndex) => (
      <th key={`day-header-${dayIndex + 1}`} colSpan={10} className="border border-gray-400 bg-gray-100 text-center py-2">
        Day {dayIndex + 1}
      </th>
    ));
  };

  // Function to render input field for a specific cycle
  const renderInputCell = (day: number, checkpoint: number, cycle: number, width: number = 1) => {
    const key = `day${day}-checkpoint${checkpoint}`;
    const value = scores[key]?.[cycle - 1] || 0;

    return (
      <td
        key={`input-${day}-${checkpoint}-${cycle}`}
        className="border border-gray-400 bg-white text-center p-0"
        colSpan={width}
      >
        <div className="w-full h-full">
          <input
            type="number"
            min="0"
            max="2"
            value={value || ''}
            className="w-full h-full text-center text-xs no-spinner"
            onChange={(e) => {
              const value = parseInt(e.target.value);
              updateScore(day, checkpoint, cycle, value);
            }}
          />
        </div>
      </td>

    );
  };

  // Function to render inputs for a day based on checkpoint configuration
  const renderDayColumnsForCheckpoint = (config: CheckpointConfig) => {
    return Array.from({ length: 6 }, (_, dayIndex) => {
      const day = dayIndex + 1;

      // Calculate column width based on input count
      const colWidth = config.inputCount === 1 ? 10 :
        config.inputCount === 2 ? 5 : 1;

      return (
        <React.Fragment key={`day-inputs-${day}-${config.id}`}>
          {Array.from({ length: config.inputCount }, (_, i) =>
            renderInputCell(day, config.id, i + 1, colWidth)
          )}
        </React.Fragment>
      );
    });
  };

  const renderPercentageScoreRow = (
    dayTotals: { [day: number]: { percentage_score: number } }
  ) => {
    return (
      <tr>
        <td
          colSpan={4}
          className="border border-gray-400 bg-gray-100 text-center py-2 font-medium"
        >
          % Score (of the day)
        </td>
        {Array.from({ length: 6 }, (_, i) => {
          const dayTotal = dayTotals[i + 1];
          return (
            <td
              key={`percent-day-${i + 1}`}
              colSpan={10}
              className="border border-gray-400 bg-gray-100 text-center"
            >
              {dayTotal?.percentage_score || 0}%
            </td>
          );
        })}
      </tr>
    );
  };


  return (
    <div className="bg-white p-4 max-w-full overflow-x-auto">
      {/* Evaluation Table */}
      <div className="flex w-full text-lg text-center font-medium bg-gray-200">
        <div className="border border-black p-2" style={{ width: '25%' }}>
          New Joinee Operator Name
        </div>
        <div className="border border-black p-2" style={{ width: '12.5%' }}>
          E.Code
        </div>
        <div className="border border-black p-2" style={{ width: '12.5%' }}>
          Department
        </div>
        <div className="border border-black p-2" style={{ width: '12.5%' }}>
          Date of Joining in DOJO
        </div>
        <div className="border border-black p-2" style={{ width: '18.75%' }}>
          Evaluation Criteria:
        </div>
        <div className="border border-black p-2" style={{ width: '18.75%' }}>
          Marking Criteria:
        </div>
      </div>
      {/* Row 1 */}
      <div className="flex w-full h-10 text-center h-[65px] ">
        <div className="border border-black p-2 w-[25%]">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="New Joinee Operator Name"
            className="w-full h-full border-none outline-none p-0 text-center"
          />
        </div>
        <div className="border border-black p-2 w-[12.5%]">
          <input
            type="text"
            name="ecode"
            value={formData.ecode}
            onChange={handleInputChange}
            placeholder="E.Code"
            className="w-full h-full border-none outline-none p-0 text-center"
          />
        </div>
        <div className="border border-black p-2 w-[12.5%]">
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="Department"
            className="w-full h-full border-none outline-none p-0 text-center"
          />
        </div>
        <div className="border border-black p-2 w-[12.5%]">
          <input
            type="date"
            name="dateJoinedDOJO"
            value={formData.dateJoinedDOJO}
            onChange={handleInputChange}
            className="w-full h-full border-none outline-none p-0 text-center"
          />
        </div>
        <div className="border-none p-2 w-[9.375%] size-2 row-span-3">
          Pass - More than 60%<br />
          & 100% marks in Quality<br />
          & SOP adherence points<br />
          in last 3 days
        </div>
        <div className="border-none p-2 w-[9.375%] row-span-3">
          Fail - Less than 60%<br />
          or Less than 100% marks<br />
          in Quality & SOP adherence<br />
          points in last 3 days
        </div>
        <div className="border border-black p-2 w-[3.125%]"></div>
        <div className="border border-black p-2 w-[15.625%]"></div>
      </div>

      {/* Row 2 */}
      <div className="flex w-full text-center">
        <div className="border border-black p-2 w-[9.375%]">Line Name</div>
        <div className="border border-black p-2 w-[12.5%]">
          <input
            type="text"
            name="line"
            value={formData.line}
            onChange={handleInputChange}
            placeholder="Line Name"
            className="w-full h-full border-none outline-none p-0 text-center"
          />
        </div>
        <div className="border border-black p-2 w-[6.25%]">Station Name</div>
        <div className="border border-black p-2 w-[9.375%]">
          <input
            type="text"
            name="station"
            value={formData.station}
            onChange={handleInputChange}
            placeholder="Station Name"
            className="w-full h-full border-none outline-none p-0 text-center"
          />
        </div>
        <div className="border border-black p-2 w-[12.5%]">Date of Joining in Department</div>
        <div className="border border-black p-2 w-[12.5%]">
          <input
            type="date"
            name="dateJoinedDepartment"
            value={formData.dateJoinedDepartment}
            onChange={handleInputChange}
            className="w-full h-full border-none outline-none p-0 text-center"
          />
        </div>
        <div className="border-none p-2 w-[9.375%] row-span-3"></div>
        <div className="border-none p-2 w-[9.375%] row-span-3"></div>
        <div className="border border-black p-2 w-[3.125%]"></div>
        <div className="border border-black p-2 w-[15.625%]"></div>
      </div>

      {/* Worker Observation Table */}
      <table className="border-collapse w-full mt-4">
        <thead>
          <tr>
            <th colSpan={3} className="border border-gray-400 bg-gray-100 text-center py-2">
              Shift- A / B / C
            </th>
            <th className="border border-gray-400 bg-gray-100 text-center py-2 px-2 w-12">
              Max. Score
            </th>
            {renderDayColumnsForAllDays()}
          </tr>
          <tr>
            <th className="border border-gray-400 bg-gray-100 text-center py-2">S.No.</th>
            <th colSpan={2} className="border border-gray-400 bg-gray-100 text-center py-2 relative">
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 pl-2 pt-1">Check-points</div>
                <div className="absolute bottom-0 right-0 pr-2 pb-1">Cycle (part)</div>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <div className="absolute top-0 right-0 bottom-0 left-0 transform rotate-[-15deg] translate-x-4 border-b-2 border-black"></div>
                </div>
              </div>
            </th>
            <th className="border border-gray-400 bg-gray-100 text-center py-2">Max. Score</th>
            {Array.from({ length: 6 }, (_, dayIndex) => (
              <React.Fragment key={`day-cols-${dayIndex + 1}`}>
                {Array.from({ length: 10 }, (_, colIndex) => (
                  <th key={`day${dayIndex + 1}-col${colIndex + 1}`} className="w-6 h-6 border border-gray-400 bg-gray-100 text-center text-xs">
                    {colIndex + 1}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Generate rows based on checkpointConfigs */}
          {checkpointConfigs.map((config) => (
            <React.Fragment key={`checkpoint-${config.id}`}>
              <tr>
                <td className="border border-gray-400 bg-white text-center py-2" rowSpan={config.hasAdditionalRow ? 2 : 1}>
                  {config.id}
                </td>
                <td className="border border-gray-400 bg-white py-2 px-2" rowSpan={config.hasAdditionalRow ? 2 : 1}>
                  {config.name}
                </td>
                <td className="border border-gray-400 bg-white py-2 px-2">
                  <div dangerouslySetInnerHTML={{ __html: config.description.replace(/\n/g, '<br/>') }} />
                </td>
                <td className="border border-gray-400 bg-white text-center py-2">
                  {config.hasAdditionalRow ? (config.id === 5 ? "sec." : "No.") : config.maxScore}
                </td>
                {renderDayColumnsForCheckpoint(config)}
              </tr>
              {config.hasAdditionalRow && (
                <tr>
                  <td className="border border-gray-400 bg-white py-2 px-2" colSpan={1}>
                    Score
                  </td>
                  <td className="border border-gray-400 bg-white text-center py-2">
                    {config.maxScore}
                  </td>
                  {renderDayColumnsForCheckpoint(config)}
                </tr>
              )}
            </React.Fragment>
          ))}

          {/* Reason for Variance */}
          <tr>
            <td colSpan={4} className="border border-gray-400 bg-white text-center py-2 font-medium">
              Reason For Variance
            </td>
            {Array.from({ length: 6 }, (_, i) => (
              <td
                key={`variance-day-${i + 1}`}
                colSpan={10}
                className="border border-gray-400 bg-white"
              ></td>
            ))}
          </tr>

          {/* Total Marks Out of 18 */}
          <tr>
            <td
              colSpan={4}
              className="border border-gray-400 bg-gray-100 text-center py-2 font-medium"
            >
              Total Marks Out of 180 (of each cycle)
            </td>
            {Array.from({ length: 6 }, (_, dayIndex) => {
              const day = dayIndex + 1;
              return (
                <td
                  key={`total-180-day${day}`}
                  colSpan={10}
                  className="border border-gray-400 bg-gray-100 h-8 text-center p-0"
                >
                  <input
                    type="number"
                    min={0}
                    max={180}
                    value={cycleTotals[day] || ''}
                    onChange={(e) => handleCycleTotalChange(day, parseInt(e.target.value))}
                    className="w-full h-full text-center text-xs no-spinner bg-transparent"
                  />
                </td>
              );
            })}
          </tr>


          {/* Total Marks Out of 200 */}
          {renderTotalMarksRow(dayTotals)}

          {/* % Score */}
          {renderPercentageScoreRow(dayTotals)}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="border border-gray-400 bg-gray-100 text-center py-2 font-medium">
              Overall % Score (of 6 days) = {calculateTotalScore()}%
            </td>
            <td colSpan={30} className="border border-gray-400 bg-gray-100"></td>
            <td colSpan={15} className="border border-gray-400 bg-gray-100 text-center font-medium">
              Final Verdict ( Tick Mark)
            </td>
            <td colSpan={8} className="border border-gray-400 bg-gray-100 text-center font-medium">
              Pass
            </td>
            <td colSpan={7} className="border border-gray-400 bg-gray-100 text-center font-medium">
              Fail
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-4 flex justify-center">
        <button
          onClick={saveObservations}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Evaluation Data
        </button>
      </div>
      <div className="mt-4 hidden">
        <pre>{JSON.stringify(dailyObservations, null, 2)}</pre>
      </div>
    </div>
  );
}