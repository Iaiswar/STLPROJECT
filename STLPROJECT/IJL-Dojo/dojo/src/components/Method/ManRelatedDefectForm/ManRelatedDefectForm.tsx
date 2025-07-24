import React, { useState, useEffect } from 'react';

// Define types to fix TypeScript errors
type Source = 'MSIL' | 'Tier-1' | 'Internal';
type DefectField = 'total_defects' | 'ctq_defects';

// Define the data structure for API responses
interface DefectItem {
    source: Source;
    total_defects: number;
    ctq_defects: number;
}

interface StatsType {
    MSIL: { total_defects: number; ctq_defects: number };
    'Tier-1': { total_defects: number; ctq_defects: number };
    Internal: { total_defects: number; ctq_defects: number };
}

interface EditingType {
    MSIL: { total_defects: boolean; ctq_defects: boolean };
    'Tier-1': { total_defects: boolean; ctq_defects: boolean };
    Internal: { total_defects: boolean; ctq_defects: boolean };
}

const ManRelatedDefectDashboard: React.FC = () => {
    const [stats, setStats] = useState<StatsType>({
        MSIL: { total_defects: 0, ctq_defects: 0 },
        'Tier-1': { total_defects: 0, ctq_defects: 0 },
        Internal: { total_defects: 0, ctq_defects: 0 },
    });

    const [isEditing, setIsEditing] = useState<EditingType>({
        MSIL: { total_defects: false, ctq_defects: false },
        'Tier-1': { total_defects: false, ctq_defects: false },
        Internal: { total_defects: false, ctq_defects: false },
    });

    const [editedValue, setEditedValue] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/man-defects/');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                processData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Process data from API
    const processData = (data: DefectItem[]) => {
        // Assuming the API returns an array of objects with source, total_defects, and ctq_defects
        const processedStats = {
            MSIL: { total_defects: 0, ctq_defects: 0 },
            'Tier-1': { total_defects: 0, ctq_defects: 0 },
            Internal: { total_defects: 0, ctq_defects: 0 },
        };

        // Process each item in the data
        data.forEach(item => {
            if (item.source in processedStats) {
                processedStats[item.source as Source].total_defects = item.total_defects;
                processedStats[item.source as Source].ctq_defects = item.ctq_defects;
            }
        });

        setStats(processedStats);
    };

    const handleEditToggle = (source: Source, field: DefectField) => {
        setIsEditing(prev => ({
            ...prev,
            [source]: {
                ...prev[source],
                [field]: !prev[source][field]
            }
        }));

        // Set the edited value to the current value when entering edit mode
        setEditedValue(stats[source][field]);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numValue = Number(e.target.value);
        setEditedValue(numValue);
    };

    const handleInputBlur = (source: Source, field: DefectField) => {
        // Update the local stats
        const newStats = {
            ...stats,
            [source]: {
                ...stats[source],
                [field]: editedValue
            }
        };

        setStats(newStats);
        setHasUnsavedChanges(true);

        // Turn off editing mode
        setIsEditing(prev => ({
            ...prev,
            [source]: {
                ...prev[source],
                [field]: false
            }
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent, source: Source, field: DefectField) => {
        if (e.key === 'Enter') {
            handleInputBlur(source, field);
        }
    };

    const saveAllChanges = async () => {
        try {
            setMessage('Saving changes...');

            // Prepare data for all sources
            const updates: DefectItem[] = Object.keys(stats).map(source => ({
                source: source as Source,
                total_defects: stats[source as Source].total_defects,
                ctq_defects: stats[source as Source].ctq_defects
            }));

            // Send each update
            for (const update of updates) {
                const response = await fetch('http://127.0.0.1:8000/man-defects/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(update)
                });

                if (!response.ok) {
                    throw new Error(`Failed to save ${update.source} data. Status: ${response.status}`);
                }
            }

            setMessage('All changes saved successfully!');
            setHasUnsavedChanges(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save changes:', error);
            setMessage('Failed to save changes. Please try again.');
            setTimeout(() => setMessage(''), 5000);
        }
    };

    // Styling for the defect boxes
    const msilBoxStyle = "bg-blue-800 text-white p-4 rounded shadow";
    const tier1BoxStyle = "bg-green-600 text-white p-4 rounded shadow";
    const internalBoxStyle = "bg-purple-800 text-white p-4 rounded shadow";

    // Function to render an editable value box
    const renderEditableValue = (source: Source, field: DefectField, boxStyle: string) => {
        return (
            <div className={boxStyle}>
                <div className="text-4xl font-bold text-center">
                    {isEditing[source][field] ? (
                        <input
                            type="number"
                            className="w-20  text-black p-1 rounded border-none bg-inherit text-white outline-none text-center"
                            value={editedValue}
                            onChange={handleValueChange}
                            onBlur={() => handleInputBlur(source, field)}
                            onKeyDown={(e) => handleKeyDown(e, source, field)}
                            autoFocus
                            min={0}
                        />
                    ) : (
                        <span onClick={() => handleEditToggle(source, field)} className="cursor-pointer">
                            {stats[source][field]}
                        </span>
                    )}
                </div>
                <div className="text-center mt-2">
                    {field === 'total_defects'
                        ? `Total Defects at ${source === 'Internal' ? 'Internal Rejection' : source}`
                        : `CTQ Defects at ${source === 'Internal' ? 'Internal Rejection' : source}`}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <div className="text-xl">Loading defect data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Man Related Defect Dashboard</h1>

            {message && (
                <div className={`border px-4 py-2 rounded mb-4 ${message.includes('Failed')
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : 'bg-green-100 border-green-400 text-green-700'
                    }`}>
                    {message}
                </div>
            )}

            {/* Stats Boxes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* MSIL Stats */}
                {renderEditableValue('MSIL', 'total_defects', msilBoxStyle)}
                {renderEditableValue('MSIL', 'ctq_defects', msilBoxStyle)}

                {/* Tier-1 Stats */}
                {renderEditableValue('Tier-1', 'total_defects', tier1BoxStyle)}
                {renderEditableValue('Tier-1', 'ctq_defects', tier1BoxStyle)}

                {/* Internal Stats */}
                {renderEditableValue('Internal', 'total_defects', internalBoxStyle)}
                {renderEditableValue('Internal', 'ctq_defects', internalBoxStyle)}
            </div>

            {/* Save Button */}
            <div className="text-center mt-6">
                <button
                    onClick={saveAllChanges}
                    disabled={!hasUnsavedChanges}
                    className={`px-6 py-2 rounded text-white font-semibold transition-all duration-200 ${hasUnsavedChanges
                            ? 'bg-green-600 hover:bg-green-700 shadow-md'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    💾 Save All Changes
                </button>

                <div className="text-sm text-gray-500 mt-2 italic">
                    Click on any number to edit its value.
                </div>
            </div>

        </div>
    );
};

export default ManRelatedDefectDashboard;