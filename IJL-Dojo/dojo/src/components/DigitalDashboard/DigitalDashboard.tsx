import React, { useEffect, useState } from "react";
import styles from "./digital.module.css";
import TrainingSummaryCard from "./Card/Cardprops";
import Training from "./Graphs/OprTraining-JoinedvsTrained/train";
import Plan from "./Graphs/NoOftrainingPlanvsActual/plan";
import Defects from "./Graphs/ManRelatedDefectsTrend/defects";
import DefectsRejected from "./Graphs/ManRelatedDefectsInternal/defectsRejected";
import MyTable from "./Graphs/ActionPlanned/mytable";
// import SettingsPage from "./Settings/digitalsettings"; // Import the new settings page
// import SettingsPage from "./ManagementSettings/digitalsettings"; // Import the new settings page
import { useNavigate } from "react-router-dom";
import PlanTwo from "./Graphs/NoOftrainingPlanvsActual2/plan2";
import DigitalSettings from "./ManagementSettings/digitalsettings";
import DefectsRejected1 from "./Graphs/ManRelatedDefectsInternal copy/defectsRejected1";

// Define the CardData interface
interface CardData {
    number: number;
    text: string;
    bgColor: string;
}

const DigitalDashboard: React.FC = () => {
    const [selectedPlant, setSelectedPlant] = useState("All Plants");
    const [showSettings, setShowSettings] = useState(false);

    // Move the data into state so it can be updated
    const [trainingData, setTrainingData] = useState<CardData[]>([
        { number: 271, text: "New Operators Joined", bgColor: "#3498db" },
        { number: 244, text: "New Opr. Trained", bgColor: "#3498db" },
        { number: 271, text: "Total Trainings Plan", bgColor: "#8e44ad" },
        { number: 244, text: "Total Trainings Act", bgColor: "#8e44ad" }
    ]);



    const [defectsData, setDefectsData] = useState<CardData[]>([
        { number: 27, text: "Total Defects at MSIL", bgColor: "#143555" },
        { number: 7, text: "CTQ Defects at MSIL", bgColor: "#143555" },
        { number: 152, text: "Total Defects at Tier-1", bgColor: "#6c6714" },
        { number: 152, text: "CTQ Defects at Tier-1", bgColor: "#6c6714" },
        { number: 12, text: "Total Internal Rejection", bgColor: "#5d255d" },
        { number: 12, text: "CTQ Internal Rejection", bgColor: "#5d255d" }
    ]);

    const [operatorsTrainingData, setOperatorsTrainingData] = useState([
        { month: "Jan 2024", operatorsJoined: 10, operatorsTrained: 5 },
        { month: "Feb 2024", operatorsJoined: 20, operatorsTrained: 15 },
        { month: "Mar 2024", operatorsJoined: 15, operatorsTrained: 10 },
        { month: "Apr 2024", operatorsJoined: 30, operatorsTrained: 25 },
        { month: "May 2024", operatorsJoined: 25, operatorsTrained: 20 },
        { month: "Jun 2024", operatorsJoined: 35, operatorsTrained: 30 }
    ]);

    const [data1, setData1] = useState<number[]>([]);
    const [data2, setData2] = useState<number[]>([]);
    
    useEffect(() => {
        const count = 6;
    
        // Generate data2 first, then make data1 > data2 by at least +1
        const generateDataSets = (min2: number, max2: number, maxOffset: number) => {
            const d2: number[] = [];
            const d1: number[] = [];
    
            for (let i = 0; i < count; i++) {
                const val2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
                const offset = Math.floor(Math.random() * maxOffset) + 1; // always >=1
                const val1 = val2 + offset;
    
                d2.push(val2);
                d1.push(val1);
            }
    
            return { d1, d2 };
        };
    
        if (selectedPlant === "All Plants") {
            const { d1, d2 } = generateDataSets(5, 40, 10);
            setData1(d1);
            setData2(d2);
        } else {
            const plantNumber = parseInt(selectedPlant.replace("Plant ", ""));
            const min2 = 3 + plantNumber;
            const max2 = 35 + plantNumber;
            const offsetRange = 8; // tweak how far apart data1 can be from data2
            const { d1, d2 } = generateDataSets(min2, max2, offsetRange);
            setData1(d1);
            setData2(d2);
        }
    }, [selectedPlant]);
    


    const [data3, setdata3] = useState<number[]>([]);
    const [data4, setdata4] = useState<number[]>([]);

    useEffect(() => {
    
        const count = 6;
    
        // Generate data2 first, then make data1 > data2 by at least +1
        const generateDataSets = (min2: number, max2: number, maxOffset: number) => {
            const d2: number[] = [];
            const d1: number[] = [];
    
            for (let i = 0; i < count; i++) {
                const val2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
                const offset = Math.floor(Math.random() * maxOffset) + 1; // always >=1
                const val1 = val2 + offset;
    
                d2.push(val2);
                d1.push(val1);
            }
    
            return { d1, d2 };
        };
    
        if (selectedPlant === "All Plants") {
            const { d1, d2 } = generateDataSets(5, 40, 10);
            setdata3(d1);
            setdata4(d2);
        } else {
            const plantNumber = parseInt(selectedPlant.replace("Plant ", ""));
            const min2 = 3 + plantNumber;
            const max2 = 35 + plantNumber;
            const offsetRange = 8; // tweak how far apart data1 can be from data2
            const { d1, d2 } = generateDataSets(min2, max2, offsetRange);
            setdata3(d1);
            setdata4(d2);
        }
        
    }, [selectedPlant]);
    

    const defaultTitle = selectedPlant === "All Plants"
        ? "CTQ Related Defects  - All Plants"
        : `CTQ Related Defects  - ${selectedPlant}`;



    const TotalTitle = selectedPlant === "All Plants"
        ? " Total Defects  - All Plants"
        : `Total Defects  - ${selectedPlant}`;

    const navigate = useNavigate();
    // Toggle settings page visibility
    const toggleSettings = () => {
        // setShowSettings(!showSettings);
        navigate('/DashboardRedirect');
    };

    const navigateSkillMatrix = () => {
        navigate('/SkillsMatrix')
    }

    const navigateMaster = () => {
        navigate('/MasterTable')
    }

    const navEmployee = () => {
        navigate('/EmployeeEvaluationForm')
    }

    const navlevel = () => {
        navigate('/LevelWiseDashboard')
    }

    const navigateDashboard = () => {
        navigate('/DashboardRedirect');
    };

    const navMethod = () => {
        navigate('/methodsettings');
    }


    const handleNavigate = () => {
        navigate('/training', { state: { employeeName: "Amit Sharma" } });
      };

      const navHome = () => {
        navigate('/');
      };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.titleLeft}>
                    <h1 className={styles.title}>NL Technologies</h1>
                </div>
                <div className={styles.titleRight}>
                    <button onClick={navigateDashboard} className={styles.settingsButton}>Advance Manpower Dashboard</button>
                    <button onClick={navigateSkillMatrix} className={styles.settingsButton}>Skill Matrix</button>
                    <button onClick={navigateMaster} className={styles.settingsButton}>Master</button>
                    <button onClick={navEmployee} className={styles.settingsButton}>Employee</button>
                    <button onClick={handleNavigate} className={styles.settingsButton}>Training</button>
                    <button onClick={navlevel} className={styles.settingsButton}>Machine Allocation</button>

                    <button onClick={navMethod} className={styles.settingsButton}>Method</button>
                    <button onClick={navHome} className={styles.settingsButton}>Home</button>
                    <select
                        className={styles.plantDropdown}
                        value={selectedPlant}
                        onChange={(e) => setSelectedPlant(e.target.value)}
                    >
                        <option value="All Plants">All Plants</option>
                        {Array.from({ length: 3 }, (_, i) => (
                            <option key={i + 1} value={`Plant ${i + 1}`}>
                                Plant {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {showSettings ? (
                <DigitalSettings
                    trainingData={trainingData}
                    defectsData={defectsData}
                    operatorsTrainingData={operatorsTrainingData}
                    onSaveTrainingData={setTrainingData}
                    onSaveDefectsData={setDefectsData}
                    onSaveOperatorsTrainingData={setOperatorsTrainingData}
                />
            ) : (
                <div className={styles.content}>
                    <h4 className={styles.header}>Management Reviews - Digital Dashboard</h4>

                    <div className={styles.mainContentWrapper}>
                        {/* Left Content - TrainingSummaryCards */}
                        <div className={styles.leftContent}>
                            <div className={styles.cardContainer}>
                                <TrainingSummaryCard title="Training Summary" data={trainingData} />
                            </div>
                            <div className={styles.secondcardContainer}>
                                <TrainingSummaryCard title="Man Related Defects" data={defectsData} />
                            </div>
                        </div>

                        {/* Right Content - Graphs and Tables in rows of 2 */}
                        <div className={styles.rightContent}>
                            <div className={styles.componentsRow}>
                                <div className={styles.componentItem}>
                                    <Training selectedPlant={selectedPlant} />
                                </div>
                                <div className={styles.componentItem}>
                                    <Plan selectedPlant={selectedPlant} />
                                </div>
                            </div>

                            <div className={styles.componentsRow}>
                                <div className={styles.componentItem}>
                                    <Defects selectedPlant={selectedPlant} />
                                </div>
                                <div className={styles.componentItem}>
                                    <DefectsRejected
                                        selectedPlant={selectedPlant}
                                        data1={data1}
                                        data2={data2}
                                        labels={["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024"]}
                                        // Optional props
                                        title={defaultTitle}
                                    // label1="Custom Label 1"
                                    // label2="Custom Label 2"
                                    />
                                </div>
                            </div>

                            <div className={styles.componentsRow}>
                                <div className={styles.componentItem}>
                                    {/* <PlanTwo selectedPlant={selectedPlant} /> */}
                                    <MyTable />
                                </div>
                                <div className={styles.componentItem}>
                                    {/* <MyTable /> */}
                                    <div className={styles.componentItem}>
                                        <DefectsRejected1
                                            selectedPlant={selectedPlant}
                                            data1={data3}
                                            data2={data4}
                                            labels={["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024"]}
                                            // Optional props
                                            title={TotalTitle}
                                        // label1="Custom Label 1"
                                        // label2="Custom Label 2"
                                        />
                                    </div>
                                </div>

                            </div>


                            {/* <div className={styles.componentsRow}>
                                <div className={styles.componentItem}>
                                    <Defects selectedPlant={selectedPlant} />
                                </div>
                                <div className={styles.componentItem}>
                                    <DefectsRejected
                                        selectedPlant={selectedPlant}
                                        data1={data1}
                                        data2={data2}
                                        labels={["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024"]}
                                        // Optional props
                                        title={defaultTitle}
                                    // label1="Custom Label 1"
                                    // label2="Custom Label 2"
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigitalDashboard;