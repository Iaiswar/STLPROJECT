import React, { useState, useEffect } from 'react';

interface CheckpointConfig {
    id: number;
    name: string;
    description: string;
    maxScore: number;
    inputCount: number;
    hasAdditionalRow?: boolean;
}

interface FormData {
    name: string;
    ecode: string;
    department: string;
    dateJoinedDOJO: string;
    dateJoinedDepartment: string;
    line: string;
    station: string;
}

interface DayTotals {
    total_marks_out_of_180: number[];
    total_marks_out_of_200: number;
    percentage_score: number;
}

interface DailyObservation {
    date: string;
    day_number: number;
    checkpoint: number;
    scores: number[];
}

interface DailySummary {
    date: string;
    day_number: number;  // This is crucial for the backend to identify days
    total_marks_out_of_180: number;
    total_marks_out_of_200: number;
    percentage_score: number;
    reason_for_variance: string;
}
interface FinalEvaluation {
    overall_percentage: number;
    verdict: string;
}

interface ExportData {
    name: string;
    ecode: string;
    department: string;
    date_joined_dojo: string;
    date_joined_department: string;
    line: string;
    station: string;
    daily_observations: DailyObservation[];
    daily_summary: DailySummary[];
    final_evaluation: FinalEvaluation;
}

const Evaluation = () => {
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

    // State for variance reasons
    const [varianceReasons, setVarianceReasons] = useState<Record<number, string>>({
        1: '', 2: '', 3: '', 4: '', 5: '', 6: ''
    });

    // Current dates for each day
    const [datesToDays, setDatesToDays] = useState<Record<number, string>>({
        1: formatDate(new Date()),
        2: '', 3: '', 4: '', 5: '', 6: ''
    });

    // Initialize form data
    const [formData, setFormData] = useState<FormData>({
        name: '',
        ecode: '',
        department: '',
        dateJoinedDOJO: '',
        dateJoinedDepartment: '',
        line: '',
        station: ''
    });

    // Initialize scores state
    const [scores, setScores] = useState<Record<string, number[]>>(() => {
        const initialScores: Record<string, number[]> = {};
        for (let day = 1; day <= 6; day++) {
            for (const config of checkpointConfigs) {
                initialScores[`day${day}-checkpoint${config.id}`] = Array(config.inputCount).fill(0);
            }
        }
        return initialScores;
    });

    // Initialize day totals
    const [dayTotals, setDayTotals] = useState<Record<number, DayTotals>>(() => {
        const initialTotals: Record<number, DayTotals> = {};
        for (let day = 1; day <= 6; day++) {
            initialTotals[day] = {
                total_marks_out_of_180: Array(10).fill(0),
                total_marks_out_of_200: 0,
                percentage_score: 0
            };
        }
        return initialTotals;
    });

    // Cycle totals (user input)
    const [cycleTotals, setCycleTotals] = useState<Record<number, number>>({});

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [exportData, setExportData] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Format a date to YYYY-MM-DD
    function formatDate(date: Date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    // Handle date changes for each day
    const handleDayDateChange = (day: number, value: string) => {
        setDatesToDays(prev => ({
            ...prev,
            [day]: value
        }));
    };

    // Handle variance reason changes
    const handleVarianceReasonChange = (day: number, value: string) => {
        setVarianceReasons(prev => ({
            ...prev,
            [day]: value
        }));
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle score changes
    const handleScoreChange = (day: number, checkpoint: number, cycle: number, value: string) => {
        const numValue = parseInt(value) || 0;
        const config = checkpointConfigs.find(c => c.id === checkpoint);
        if (!config) return;

        const clampedValue = Math.max(0, Math.min(config.maxScore, numValue));

        setScores(prev => {
            const newScores = { ...prev };
            const key = `day${day}-checkpoint${checkpoint}`;
            newScores[key] = [...(newScores[key] || Array(config.inputCount).fill(0))];
            newScores[key][cycle - 1] = clampedValue;
            return newScores;
        });
    };
    // Handle cycle total changes
    const handleCycleTotalChange = (day: number, value: string) => {
        const numValue = parseInt(value) || 0;
        setCycleTotals(prev => ({ ...prev, [day]: numValue }));
    };

    // Calculate totals whenever scores change
    useEffect(() => {
        const calculateTotals = () => {
            const newDayTotals: Record<number, DayTotals> = {};

            for (let day = 1; day <= 6; day++) {
                const cycleScores: number[] = Array(10).fill(0);
                let dayTotal = 0;
                let maxPossible = 0;

                checkpointConfigs.forEach(config => {
                    const key = `day${day}-checkpoint${config.id}`;
                    const checkpointScores = scores[key] || Array(config.inputCount).fill(0);

                    // Add to cycle totals
                    checkpointScores.forEach((score, index) => {
                        if (index < 10) {
                            cycleScores[index] += score;
                        }
                    });

                    // Add to day total
                    dayTotal += checkpointScores.reduce((sum, score) => sum + score, 0);

                    // Calculate max possible score
                    maxPossible += config.maxScore * config.inputCount;
                });

                newDayTotals[day] = {
                    total_marks_out_of_180: cycleScores,
                    total_marks_out_of_200: dayTotal,
                    percentage_score: maxPossible > 0 ? Math.round((dayTotal / maxPossible) * 100) : 0
                };
            }

            setDayTotals(newDayTotals);
        };

        calculateTotals();
    }, [scores]); // Add checkpointConfigs to dependencies

    // Calculate overall percentage
    const calculateOverallPercentage = () => {
        let totalScore = 0;
        let totalPossible = 0;

        for (let day = 1; day <= 6; day++) {
            totalScore += dayTotals[day]?.total_marks_out_of_200 || 0;

            checkpointConfigs.forEach(config => {
                totalPossible += config.maxScore * config.inputCount;
            });
        }

        return totalPossible > 0 ? parseFloat((totalScore / totalPossible * 100).toFixed(1)) : 0;
    };


    // Fetch employee data from API
    const fetchEmployeeData = async (ecode: string) => {
        if (!ecode) return false;
        setIsLoading(true);

        try {
            const response = await fetch(`http://127.0.0.1:8000/operator-evaluation/${ecode}/`);
            if (response.ok) {
                const data = await response.json();

                // Update form data
                setFormData(prev => ({
                    ...prev,
                    name: data.name || '',
                    ecode: ecode,
                    department: data.department || '',
                    dateJoinedDOJO: data.date_joined_dojo || '',
                    dateJoinedDepartment: data.date_joined_department || '',
                    line: data.line || '',
                    station: data.station || ''
                }));

                // Initialize scores with all days first
                const newScores: Record<string, number[]> = {};
                for (let day = 1; day <= 6; day++) {
                    for (const config of checkpointConfigs) {
                        const key = `day${day}-checkpoint${config.id}`;
                        newScores[key] = Array(config.inputCount).fill(0);
                    }
                }

                // Merge with fetched data if it exists
                if (data.daily_observations) {
                    data.daily_observations.forEach((observation: DailyObservation) => {
                        const key = `day${observation.day_number}-checkpoint${observation.checkpoint}`;
                        if (newScores[key] && observation.scores) {
                            // Only update the scores that exist in the observation
                            newScores[key] = observation.scores.map((score, index) =>
                                index < newScores[key].length ? score : 0
                            );
                        }
                    });
                }

                setScores(newScores);

                // Update dates
                if (data.daily_summary) {
                    const newDates: Record<number, string> = { ...datesToDays };
                    data.daily_summary.forEach((summary: DailySummary) => {
                        const day = summary.day_number;
                        if (summary.date) {
                            newDates[day] = summary.date;
                        }
                    });
                    setDatesToDays(newDates);
                }

                // Update variance reasons
                if (data.daily_summary) {
                    const newVarianceReasons: Record<number, string> = { ...varianceReasons };
                    data.daily_summary.forEach((summary: DailySummary) => {
                        const day = summary.day_number;
                        if (summary.reason_for_variance) {
                            newVarianceReasons[day] = summary.reason_for_variance;
                        }
                    });
                    setVarianceReasons(newVarianceReasons);
                }

                setIsLoading(false);
                return true;
            } else {
                // Handle new employee case
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
            return false;
        }
    };
    // Format and export data
    // Format and export data
    const exportFormattedData = async () => {
        if (!formData.ecode) {
            alert('Please enter an employee code');
            return;
        }

        setIsLoading(true);

        try {
            // Prepare data from current state - include ALL days with data
            const dailyObservations: DailyObservation[] = [];
            const dailySummaries: DailySummary[] = [];

            // Collect data for ALL 6 days
            for (let day = 1; day <= 6; day++) {
                let hasScores = false;
                const dayObservations: DailyObservation[] = [];

                // Check all checkpoints for this day to see if there are any scores
                for (const config of checkpointConfigs) {
                    const key = `day${day}-checkpoint${config.id}`;
                    const dayScores = scores[key] || [];

                    if (dayScores.some(score => score > 0)) {
                        hasScores = true;
                        dayObservations.push({
                            date: datesToDays[day] || "", // Fix: Use empty string instead of null
                            day_number: day,
                            checkpoint: config.id,
                            scores: [...dayScores]
                        });
                    }
                }

                // Include day if it has scores OR variance reason OR a date is set
                if (hasScores || varianceReasons[day] || datesToDays[day]) {
                    // Add all observations for this day (only if there are scores)
                    if (hasScores) {
                        dailyObservations.push(...dayObservations);
                    }

                    // Calculate day totals
                    const dayTotal = Object.entries(scores)
                        .filter(([key]) => key.startsWith(`day${day}-`))
                        .reduce((sum, [, checkpointScores]) =>
                            sum + checkpointScores.reduce((s, score) => s + score, 0), 0);

                    // Add daily summary (include even if no scores but has date/variance reason)
                    dailySummaries.push({
                        date: datesToDays[day] || "", // Fix: Use empty string instead of null
                        day_number: day,
                        total_marks_out_of_180: cycleTotals[day] || 0,
                        total_marks_out_of_200: dayTotal,
                        percentage_score: dayTotals[day]?.percentage_score || 0,
                        reason_for_variance: varianceReasons[day] || ""
                    });
                }
            }

            // Calculate overall percentage
            const overallTotal = dailySummaries.reduce((sum, day) => sum + day.total_marks_out_of_200, 0);
            const maxPossible = checkpointConfigs.reduce((sum, config) =>
                sum + (config.maxScore * config.inputCount * 6), 0);
            const overallPercentage = maxPossible > 0 ? parseFloat(((overallTotal / maxPossible) * 100).toFixed(1)) : 0;

            // Determine verdict
            let verdict = "Fail";
            if (overallPercentage >= 60) {
                const lastThreeDays = dailySummaries
                    .filter(day => day.day_number >= 4)
                    .every(day => {
                        const qualityKey = `day${day.day_number}-checkpoint4`;
                        const sopKey = `day${day.day_number}-checkpoint3`;
                        const qualityScore = scores[qualityKey]?.reduce((sum, s) => sum + s, 0) || 0;
                        const sopScore = scores[sopKey]?.reduce((sum, s) => sum + s, 0) || 0;
                        const maxQualityScore = checkpointConfigs[3].maxScore * checkpointConfigs[3].inputCount;
                        const maxSopScore = checkpointConfigs[2].maxScore * checkpointConfigs[2].inputCount;
                        return qualityScore >= maxQualityScore && sopScore >= maxSopScore;
                    });

                if (lastThreeDays) verdict = "Pass";
            }

            // Prepare final data
            const formattedData: ExportData = {
                name: formData.name,
                ecode: formData.ecode,
                department: formData.department,
                date_joined_dojo: formData.dateJoinedDOJO,
                date_joined_department: formData.dateJoinedDepartment,
                line: formData.line,
                station: formData.station,
                daily_observations: dailyObservations,
                daily_summary: dailySummaries,
                final_evaluation: {
                    overall_percentage: overallPercentage,
                    verdict: verdict
                }
            };

            // Debug: Log the data being sent
            console.log('Data being sent:', JSON.stringify(formattedData, null, 2));

            // Determine if this is an update or create
            const isUpdate = dailyObservations.length > 0 || dailySummaries.length > 0;
            const endpoint = isUpdate
                ? `http://127.0.0.1:8000/operator/update/${formData.ecode}/`
                : 'http://127.0.0.1:8000/operator-evaluation/';

            const method = isUpdate ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} record`);
            }

            alert(`Data ${isUpdate ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    // Reset all data
    const resetData = () => {
        if (window.confirm('Are you sure you want to reset all data?')) {
            setFormData({
                name: '',
                ecode: '',
                department: '',
                dateJoinedDOJO: '',
                dateJoinedDepartment: '',
                line: '',
                station: ''
            });

            const resetScores: Record<string, number[]> = {};
            for (let day = 1; day <= 6; day++) {
                for (const config of checkpointConfigs) {
                    resetScores[`day${day}-checkpoint${config.id}`] = Array(config.inputCount).fill(0);
                }
            }
            setScores(resetScores);

            const resetTotals: Record<number, DayTotals> = {};
            for (let day = 1; day <= 6; day++) {
                resetTotals[day] = {
                    total_marks_out_of_180: Array(10).fill(0),
                    total_marks_out_of_200: 0,
                    percentage_score: 0
                };
            }
            setDayTotals(resetTotals);
            setCycleTotals({});
            setVarianceReasons({
                1: '', 2: '', 3: '', 4: '', 5: '', 6: ''
            });
            setDatesToDays({
                1: formatDate(new Date()),
                2: '', 3: '', 4: '', 5: '', 6: ''
            });
        }
    };

    // Render day headers
    const renderDayHeaders = () => {
        return Array.from({ length: 6 }, (_, dayIndex) => {
            const day = dayIndex + 1;
            return (
                <th key={`day-header-${day}`} colSpan={10} className="border border-gray-400 bg-gray-100 text-center py-2">
                    <div>Day {day}</div>
                    <input
                        type="date"
                        value={datesToDays[day] || ''}
                        onChange={(e) => handleDayDateChange(day, e.target.value)}
                        className="w-full text-center text-xs bg-transparent"
                    />
                </th>
            );
        });
    };

    // Render cycle number headers
    const renderCycleHeaders = () => {
        return Array.from({ length: 6 }, (_, dayIndex) => (
            <React.Fragment key={`day-cycle-headers-${dayIndex + 1}`}>
                {Array.from({ length: 10 }, (_, cycleIndex) => (
                    <th key={`day${dayIndex + 1}-cycle${cycleIndex + 1}`} className="w-6 h-6 border border-gray-400 bg-gray-100 text-center text-xs">
                        {cycleIndex + 1}
                    </th>
                ))}
            </React.Fragment>
        ));
    };

    // Render input cells for a checkpoint
    const renderCheckpointInputs = (config: CheckpointConfig) => {
        return Array.from({ length: 6 }, (_, dayIndex) => {
            const day = dayIndex + 1;
            const colWidth = config.inputCount === 1 ? 10 :
                config.inputCount === 2 ? 5 : 1;

            return (
                <React.Fragment key={`day-inputs-${day}-${config.id}`}>
                    {Array.from({ length: config.inputCount }, (_, cycleIndex) => {
                        const key = `day${day}-checkpoint${config.id}`;
                        const value = scores[key]?.[cycleIndex] ?? 0; // Use nullish coalescing for safety

                        return (
                            <td
                                key={`input-${day}-${config.id}-${cycleIndex + 1}`}
                                className="border border-gray-400 bg-white text-center p-0"
                                colSpan={colWidth}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    max={config.maxScore}
                                    value={value}
                                    onChange={(e) => handleScoreChange(day, config.id, cycleIndex + 1, e.target.value)}
                                    className="w-full h-full text-center text-xs no-spinner"
                                />
                            </td>
                        );
                    })}
                </React.Fragment>
            );
        });
    };

    return (
        <div className="bg-white p-4 max-w-full overflow-x-auto">
            {/* Loading overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <p>Loading...</p>
                    </div>
                </div>
            )}

            {/* Header Section */}
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
            <div className="flex w-full text-center h-[65px]">
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
                        onBlur={(e) => fetchEmployeeData(e.target.value)}
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
                <div className="border-none p-2 w-[9.375%] text-[12px]">
                    Pass - More than 60%<br />
                    & 100% marks in Quality<br />
                    & SOP adherence points<br />
                    in last 3 days
                </div>
                <div className="border-none p-2 w-[9.375%] text-[12px]">
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
                <div className="border-none p-2 w-[9.375%]"></div>
                <div className="border-none p-2 w-[9.375%]"></div>
                <div className="border border-black p-2 w-[3.125%]"></div>
                <div className="border border-black p-2 w-[15.625%]"></div>
            </div>



            {/* Evaluation Table */}
            <table className="border-collapse w-full mt-4">
                <thead>
                    <tr>
                        <th colSpan={3} className="border border-gray-400 bg-gray-100 text-center py-2">
                            Shift- A / B / C
                        </th>
                        <th className="border border-gray-400 bg-gray-100 text-center py-2 px-2 w-12">
                            Max. Score
                        </th>
                        {renderDayHeaders()}
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
                        {renderCycleHeaders()}
                    </tr>
                </thead>
                <tbody>
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
                                {renderCheckpointInputs(config)}
                            </tr>
                            {config.hasAdditionalRow && (
                                <tr>
                                    <td className="border border-gray-400 bg-white py-2 px-2" colSpan={1}>
                                        Score
                                    </td>
                                    <td className="border border-gray-400 bg-white text-center py-2">
                                        {config.maxScore}
                                    </td>
                                    {renderCheckpointInputs(config)}
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
                            <td key={`variance-day-${i + 1}`} colSpan={10} className="border border-gray-400 bg-white">
                                <input
                                    type="text"
                                    value={varianceReasons[i + 1] || ''}
                                    onChange={(e) => handleVarianceReasonChange(i + 1, e.target.value)}
                                    className="w-full h-full border-none outline-none p-1 text-sm"
                                    placeholder="Enter reason for variance"
                                />
                            </td>
                        ))}
                    </tr>

                    {/* Total Marks Out of 180 */}
                    <tr>
                        <td colSpan={4} className="border border-gray-400 bg-gray-100 text-center py-2 font-medium">
                            Total Marks Out of 180 (of each cycle)
                        </td>
                        {Array.from({ length: 6 }, (_, dayIndex) => (
                            <td key={`total-180-day-${dayIndex + 1}`} colSpan={10} className="border border-gray-400 bg-gray-100 text-center">
                                <input
                                    type="number"
                                    min={0}
                                    max={180}
                                    value={cycleTotals[dayIndex + 1] || ''}
                                    onChange={(e) => handleCycleTotalChange(dayIndex + 1, e.target.value)}
                                    className="w-full h-full text-center text-xs no-spinner bg-transparent"
                                />
                            </td>
                        ))}
                    </tr>

                    {/* Total Marks Out of 200 */}
                    <tr>
                        <td colSpan={4} className="border border-gray-400 bg-gray-100 text-center py-2 font-medium">
                            Total Marks Out of 200 (of the day)
                        </td>
                        {Array.from({ length: 6 }, (_, i) => (
                            <td key={`total-200-day-${i + 1}`} colSpan={10} className="border border-gray-400 bg-gray-100 text-center">
                                {dayTotals[i + 1]?.total_marks_out_of_200 || 0}
                            </td>
                        ))}
                    </tr>

                    {/* % Score */}
                    <tr>
                        <td colSpan={4} className="border border-gray-400 bg-gray-100 text-center py-2 font-medium">
                            % Score (of the day)
                        </td>
                        {Array.from({ length: 6 }, (_, i) => (
                            <td key={`percent-day-${i + 1}`} colSpan={10} className="border border-gray-400 bg-gray-100 text-center">
                                {dayTotals[i + 1]?.percentage_score || 0}%
                            </td>
                        ))}
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4} className="border border-gray-400 bg-gray-100 text-center py-2 font-medium">
                            Overall % Score (of 6 days) = {calculateOverallPercentage()}%
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

            {/* Action Buttons */}
            <div className="mt-4 flex justify-center gap-4">
                <button
                    onClick={exportFormattedData}
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : 'Submit Data'}
                </button>
                <button
                    onClick={resetData}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    Reset All
                </button>
            </div>

            {/* Modal for showing exported data */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Evaluation Data</h2>
                        <p className="mb-4 text-red-500">
                            Failed to submit data automatically. Please copy this data and submit manually.
                        </p>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                            {exportData}
                        </pre>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(exportData);
                                    alert('Data copied to clipboard!');
                                }}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Copy to Clipboard
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Evaluation;