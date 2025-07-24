import React, { useState, useEffect } from 'react';
import StandardBarChart from './SummaryGraph/SummaryGraph';
import WasteDowntimeChart from './WasteDowntimeChart/WasteDowntimeChart';
import MESSummaryHeader from './MESSummaryHeader/MESSummaryHeader';
import SiteContributionChart from './SiteContributionChart/SiteContributionChart';
import CompletionPieChart from './CompletionPieChart/CompletionPieChart';
import WorkOrderTable from './WorkOrderTable/WorkOrderTable';

const MESSummary: React.FC = () => {
  // Main filter states
  const [mode, setMode] = useState<'CO' | 'PROD' | 'SAM'>('PROD');
  const [selectedTab, setSelectedTab] = useState<'OEE' | 'Waste' | 'Downtime'>('OEE');

  // Date and work center states
  const [startDate, setStartDate] = useState<string>('2025-01-01');
  const [endDate, setEndDate] = useState<string>('2025-09-01');
  const [workCenter, setWorkCenter] = useState<string>('All');

  // This key will force all child components to re-render when it changes
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Update refresh key whenever any filter changes, causing all components to refresh
  useEffect(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, [startDate, endDate, workCenter, mode, selectedTab]);

  return (
    <div className="flex flex-row w-full p-2 gap-4">
      {/* Left container - 70% width */}
      <div className="w-9/12 flex flex-col gap-4">
        <MESSummaryHeader
          mode={mode}
          setMode={setMode}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          workCenter={workCenter}
          setWorkCenter={setWorkCenter}
        />

<div className="flex gap-4">
  {/* Completion Pie Chart - 40% width */}
  <div className="w-2/5">
    <CompletionPieChart
      key={`pie-${mode}-${selectedTab}-${startDate}-${endDate}-${workCenter}`}
      mode={mode}
      selectedTab={selectedTab}
      startDate={startDate}
      endDate={endDate}
      workCenter={workCenter}
    />
  </div>

  {/* Work Order Table - remaining width */}
  <div className="flex-grow">
    <WorkOrderTable />
  </div>
</div>

        <WasteDowntimeChart
          key={`wdt-${refreshKey}`}
          mode={mode}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          startDate={startDate}
          endDate={endDate}
          workCenter={workCenter}
        />

        <SiteContributionChart
          key={`sc-${refreshKey}`}
          mode={mode}
          selectedTab={selectedTab}
          startDate={startDate}
          endDate={endDate}
          workCenter={workCenter}
        />
      </div>

      {/* Right container - 30% width */}
      <div className="w-3/12 flex flex-col gap-4">
        <StandardBarChart
          key={`waste-${refreshKey}`}
          title="Waste Percentage"
          color="#e05d44"
          mode={mode}
          selectedTab={selectedTab}
          startDate={startDate}
          endDate={endDate}
          workCenter={workCenter}
        />

        <StandardBarChart
          key={`downtime-${refreshKey}`}
          title="Downtime Percentage"
          color="#4299e1"
          mode={mode}
          selectedTab={selectedTab}
          startDate={startDate}
          endDate={endDate}
          workCenter={workCenter}
        />

        <StandardBarChart
          key={`oee-${refreshKey}`}
          title="OEE Percentage"
          color="#68a357"
          mode={mode}
          selectedTab={selectedTab}
          startDate={startDate}
          endDate={endDate}
          workCenter={workCenter}
        />
      </div>
    </div>
  );
};

export default MESSummary;