// Demo2.tsx
import React, { useState } from 'react';
import TrainingSummaryCard from '../ManagementDashboard/Card/Cardprops';
import Training from '../ManagementDashboard/Graphs/OprTraining-JoinedvsTrained/train';
import Plan from '../ManagementDashboard/Graphs/NoOftrainingPlanvsActual/plan';

interface CardData {
    number: number;
    text: string;
    bgColor: string;
}

const Demo2: React.FC = () => {

    const [selectedPlant, setSelectedPlant] = useState("All Plants");
    const [trainingData, setTrainingData] = useState<CardData[]>([
        { number: 271, text: "New Operators Joined", bgColor: "#3498db" },
        { number: 244, text: "New Opr. Trained", bgColor: "#3498db" },
        { number: 271, text: "Total Trainings Plan", bgColor: "#8e44ad" },
        { number: 244, text: "Total Trainings Act", bgColor: "#8e44ad" }
    ]);

    const [defectsData, setDefectsData] = useState<CardData[]>([
        { number: 27, text: "New Operators Joined", bgColor: "#143555" },
        { number: 7, text: "New Opr. Trained", bgColor: "#143555" },
        { number: 152, text: "Total Trainings Plan", bgColor: "#6c6714" },
        { number: 152, text: "Total Trainings Act", bgColor: "#6c6714" },
        { number: 12, text: "Total Trainings Plan", bgColor: "#5d255d" },
        { number: 12, text: "Total Trainings Act", bgColor: "#5d255d" }
    ]);

    const [operatorsTrainingData, setOperatorsTrainingData] = useState([
        { month: "Jan 2024", operatorsJoined: 10, operatorsTrained: 5 },
        { month: "Feb 2024", operatorsJoined: 20, operatorsTrained: 15 },
        { month: "Mar 2024", operatorsJoined: 15, operatorsTrained: 10 },
        { month: "Apr 2024", operatorsJoined: 30, operatorsTrained: 25 },
        { month: "May 2024", operatorsJoined: 25, operatorsTrained: 20 },
        { month: "Jun 2024", operatorsJoined: 35, operatorsTrained: 30 }
    ]);

    return (
        <div className='h-screen flex flex-col'>
            <div className='flex w-full bg-[#16163e] justify-between p-4'>
                <h1 className='text-white'>Management Reviews - Digital Dashboard</h1>
                <div className='text-white'>select</div>
            </div>

            <div className='flex flex-1 w-full overflow-hidden'>
                {/* Left Scrollable Panel - Fixed 300px width */}
                <div className='w-[300px] flex-shrink-0 flex flex-col gap-4 p-4 overflow-y-auto min-h-0'>
                    <div className='w-full'>
                        <TrainingSummaryCard title="Training Summary" data={trainingData} />
                    </div>
                    <div className='w-full'>
                        <TrainingSummaryCard title="Man Related Defects" data={defectsData} />
                    </div>
                </div>

                {/* Main Content - Occupies remaining space */}
                <div className='flex-1 p-4 overflow-auto'>
                    <div className="flex w-full gap-4">
                        <div className="flex-1 min-w-0 overflow-hidden p-2">
                            <Training
                                selectedPlant={selectedPlant}
                                operatorsTrainingData={operatorsTrainingData}
                            />
                        </div>
                        <div className="flex-1 min-w-0  overflow-hidden p-2 ">
                            <Plan selectedPlant={selectedPlant} />
                        </div>
                    </div>

                    <div className="flex w-full gap-4 mt-2">
                        <div className="flex-1 min-w-0 overflow-hidden p-2">
                            <Training
                                selectedPlant={selectedPlant}
                                operatorsTrainingData={operatorsTrainingData}
                            />
                        </div>
                        <div className="flex-1 min-w-0  overflow-hidden p-2 ">
                            <Plan selectedPlant={selectedPlant} />
                        </div>
                    </div>

                    <div className="flex w-full gap-4 mt-2">
                        <div className="flex-1 min-w-0 overflow-hidden p-2">
                            <Training
                                selectedPlant={selectedPlant}
                                operatorsTrainingData={operatorsTrainingData}
                            />
                        </div>
                        <div className="flex-1 min-w-0  overflow-hidden p-2 ">
                            <Plan selectedPlant={selectedPlant} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Demo2;