import React from 'react';
import WasteDetailsPanel from './WasteDetailsPanel/WasteDetailsPanel';

import TopItemsByWaste from './WasteTreemap/WasteTreemap';
// import MyPieChart from './WasteContributionChart/WasteContributionChart';
import TopItemsPieChart from './WasteContributionChart/WasteContributionChart';
import ParetoChart from './ParetoChart/ParetoChart';
import WasteAnalysisChart from './WasteAnalysisChart/WasteAnalysisChart';
import WasteBucketChart from './WasteBucketChart/WasteBucketChart';
import WasteByMachineCodeChart from './WasteByMachineCodeChart/WasteByMachineCodeChart';



const WasteDetails: React.FC = () => {
    return (
        <div className="flex flex-row w-full p-2  gap-4">
            {/* Left container - 70% width */}
            <div className="w-8/12 flex flex-col gap-4">
                <WasteDetailsPanel />
                <div className='flex gap-4 '>
                    <TopItemsByWaste />
                    <TopItemsPieChart />

                </div>
                <div className='flex gap-4 '>
                    <ParetoChart />
                    <WasteAnalysisChart />
                </div>

            </div>

            {/* Right container - 30% width */}
            <div className="w-4/12 flex flex-col gap-4">
                <WasteBucketChart />
                <WasteByMachineCodeChart />
            </div>
        </div>
    );
};

export default WasteDetails;