import React from 'react';

interface MESSummaryHeaderProps {
  mode: 'CO' | 'PROD' | 'SAM';
  setMode: React.Dispatch<React.SetStateAction<'CO' | 'PROD' | 'SAM'>>;
  startDate: string;
  endDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  workCenter: string;
  setWorkCenter: React.Dispatch<React.SetStateAction<string>>;
}

const MESSummaryHeader: React.FC<MESSummaryHeaderProps> = ({ 
  mode, 
  setMode,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  workCenter,
  setWorkCenter
}) => {
  // Handle date change with proper formatting
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  return (
    <div className="flex items-center w-full border border-gray-300 bg-white">
      {/* Title */}
      <div className="bg-white  text-white py-4 px-6 font-bold text-2xl w-64">
        MES Summary
      </div>

      {/* Date Range */}
      <div className="flex flex-col p-2">
        <label className="text-red-600 text-xs mb-1">Date</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="bg-yellow-400 text-black font-bold text-sm px-2 py-1 rounded"
          />
          <div className="h-1 bg-black w-24 mx-2"></div>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="bg-yellow-400 text-black font-bold text-sm px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* Work Center Dropdown */}
      <div className="px-6 border-r border-gray-300">
        <div className="text-gray-500 text-sm mb-1">WK</div>
        <div className="flex items-center">
          <select
            className="p-2 border border-gray-300 w-24 pr-8"
            value={workCenter}
            onChange={(e) => setWorkCenter(e.target.value)}
          >
            <option>All</option>
            <option>WK1</option>
            <option>WK2</option>
            <option>WK3</option>
          </select>
        </div>
      </div>

      {/* Mode Buttons */}
      <div className="px-6">
        <div className="text-gray-500 text-sm mb-1">Mode</div>
        <div className="flex">
          {['CO', 'PROD', 'SAM'].map((item) => (
            <button
              key={item}
              className={`px-6 py-2 ${
                mode === item
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-800 border border-gray-300'
              }`}
              onClick={() => setMode(item as 'CO' | 'PROD' | 'SAM')}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MESSummaryHeader;