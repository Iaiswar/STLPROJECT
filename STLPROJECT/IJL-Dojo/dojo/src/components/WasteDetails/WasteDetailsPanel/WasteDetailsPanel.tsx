import { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // optional for dropdown arrow

export default function WasteDetailsPanel() {
  const [startDate, setStartDate] = useState('2019-01-01');
  const [endDate, setEndDate] = useState('2019-09-01');
  const [week, setWeek] = useState('All');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);

  const sites = ["BR", "CN", "EU", "ID", "NW", "US"];
  const modes = ["CO", "PROD", "SAM"];
  // const modes = ['CO', 'PROD', 'SAM'];
  const [selectedMode, setSelectedMode] = useState<string>('PROD');

  const toggleSite = (site: string) => {
    setSelectedSites(prev =>
      prev.includes(site) ? prev.filter(s => s !== site) : [...prev, site]
    );
  };

  const toggleMode = (mode: string) => {
    setSelectedModes(prev =>
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  return (
    <div className="flex bg-white shadow-lg overflow-hidden  ">
      {/* Left - Title */}
      <div className="bg-gray-700 text-white flex items-center justify-center p-8  text-sm font-bold">
        Waste Details
      </div>

      {/* Right - Filters */}
      <div className="flex items-center gap-6  p-2 w-full ">

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-red-600 text-xs mb-1">Date</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-yellow-400 text-black font-bold text-sm px-2 py-1 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-yellow-400 text-black font-bold text-sm px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* WK Dropdown */}
        <div className="flex flex-col p-2">
          <label className="text-red-600 text-xs mb-1">WK</label>
          <div className="relative">
            <select
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="appearance-none border text-gray-700 text-sm px-6 py-1 rounded pr-8"
            >
              <option>All</option>
              <option>WK1</option>
              <option>WK2</option>
              <option>WK3</option>
              <option>WK4</option>
            </select>
            <ChevronDown className="absolute right-2 top-2 w-4 h-4 pointer-events-none text-gray-600" />
          </div>
        </div>

        {/* Site Code */}
        <div className="flex flex-col">
          <label className="text-red-600 text-xs mb-1">SiteCode</label>
          <div className="flex flex-wrap gap-2">
            {sites.map(site => (
              <button
                key={site}
                onClick={() => toggleSite(site)}
                className={`px-4 py-1 border rounde text-sm 
                  ${selectedSites.includes(site) ? 'bg-black text-white' : 'bg-white text-black'}
                `}
              >
                {site}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Checkboxes */}
        <div className="flex flex-col p-2">
          <label className="text-red-600 text-xs mb-1">Mode</label>
          <div className="flex flex-col gap-4">
            {modes.map(mode => (
              <div
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className="flex items-center cursor-pointer select-none"
              >
                <div
                  className={`w-5 h-5 border rounded-sm mr-2 transition 
                ${selectedMode === mode ? 'bg-black' : 'bg-white'}
              `}
                />
                <span className={`text-sm ${selectedMode === mode ? 'font-bold' : ''}`}>
                  {mode}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
