import React, { useState, useEffect } from 'react';
import styles from "./DashboardNew.module.css";
import AbsenteeismRateTrend from "./MainContents/AbsenteeismRateTrend/AbsenteeismRateTrend";
import AttritionRateTrend from "./MainContents/AttritionRateTrend/AttritionRateTrend";
import BufferManpowerAvailability from "./MainContents/BufferManpowerAvailability/BufferManpowerAvailability";
import DashboardHeader from "./MainContents/DashboardHeader/DashboardHeader";
import DashboardStats from "./MainContents/DashboardStats/DashboardStats";
import ManpowerActions from "./MainContents/ManpowerActions/ManpowerActions";
import ManpowerAvailability from "./MainContents/ManpowerAvailability/ManpowerAvailability";
import OperatorStats from "./MainContents/OperatorStats/OperatorStats";
import { useNavigate } from 'react-router-dom';


// Define interfaces for the data
interface DataItem {
  month: string;
  value?: number;
}

// Define the type expected by AbsenteeismRateTrend component
interface AbsenteeismDataItem {
  month: string;
  value: number;
}

interface BufferDataItem {
  month: string;
  required: number;
  available: number;
}

interface ManpowerDataItem {
  month: string;
  required: number;
  available: number;
}

interface AttritionDataItem {
  month: string;
  attrition: number;
}

interface StatItem {
  value: number;
  label: string;
  color: string;
}

interface OperatorItem {
  level: string;
  required: number;
  available: number;
}

interface PlantData {
  plantName: string;
  dashboardTitle: string;
  data: DataItem[];
  bufferData: BufferDataItem[];
  manpowerData: ManpowerDataItem[];
  attritionData: AttritionDataItem[];
  statsData: StatItem[];
  operatorData: OperatorItem[];
  manpowerShortageActions: string[];
}

const DashboardNew: React.FC = () => {
  const [savedPlants, setSavedPlants] = useState<string[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<string>("All");
  const [allPlantsData, setAllPlantsData] = useState<PlantData[]>([]);
  const [plantData, setPlantData] = useState<PlantData>({
    plantName: "",
    dashboardTitle: "DOJO 2.0 Monitoring Dashboard - CTQ Stations",
    data: [],
    bufferData: [],
    manpowerData: [],
    attritionData: [],
    statsData: [],
    operatorData: [],
    manpowerShortageActions: []
  });

  // Default data to use when no plant is selected
  const defaultData: PlantData = {
    plantName: "Default Plant",
    dashboardTitle: "DOJO 2.0 Monitoring Dashboard - CTQ Stations",
    data: [
      { month: "Apr 2024", value: 0 },
      { month: "May 2024", value: 8 },
      { month: "Jun 2024", value: 6 },
      { month: "Jul 2024", value: 4 },
      { month: "Aug 2024", value: 7 },
      { month: "Sep 2024", value: 8 },
      { month: "Oct 2024", value: 4 },
      { month: "Nov 2024", value: 8 },
      { month: "Dec 2024", value: 6 },
      { month: "Jan 2025", value: 8 },
      { month: "Feb 2025", value: 0 },
      { month: "Mar 2025", value: 5 }
    ],
    bufferData: [
      { month: "Apr 2024", required: 10.0, available: 9.0 },
      { month: "May 2024", required: 10.0, available: 6.0 },
      { month: "Jun 2024", required: 10.0, available: 8.0 },
      { month: "Jul 2024", required: 10.0, available: 7.0 },
      { month: "Aug 2024", required: 10.0, available: 0 },
      { month: "Sep 2024", required: 10.0, available: 7.0 },
      { month: "Oct 2024", required: 10.0, available: 4.0 },
      { month: "Nov 2024", required: 10.0, available: 8.0 },
      { month: "Dec 2024", required: 10.0, available: 5.0 },
      { month: "Jan 2025", required: 10.0, available: 9.0 },
      { month: "Feb 2025", required: 10.0, available: 9.0 },
      { month: "Mar 2025", required: 10.0, available: 9.0 },
    ],
    manpowerData: [
      { month: "April", required: 83, available: 66 },
      { month: "May", required: 83, available: 82 },
      { month: "June", required: 95, available: 83 },
      { month: "July", required: 83, available: 80 },
      { month: "August", required: 83, available: 83 },
      { month: "September", required: 95, available: 83 },
      { month: "October", required: 92, available: 83 },
      { month: "November", required: 83, available: 83 },
      { month: "December", required: 90, available: 83 },
      { month: "January", required: 83, available: 82 },
      { month: "February", required: 83, available: 82 },
      { month: "March", required: 83, available: 80 }
    ],
    attritionData: [
      { month: "Apr 2024", attrition: 4 },
      { month: "May 2024", attrition: 3 },
      { month: "Jun 2024", attrition: 3 },
      { month: "Jul 2024", attrition: 2 },
      { month: "Aug 2024", attrition: 1 },
      { month: "Sep 2024", attrition: 1 },
      { month: "Oct 2024", attrition: 4 },
      { month: "Nov 2024", attrition: 3 },
      { month: "Dec 2024", attrition: 2 },
      { month: "Jan 2025", attrition: 1 },
      { month: "Feb 2025", attrition: 4 },
      { month: "Mar 2025", attrition: 3 }
    ],
    statsData: [
      { value: 5, label: "Total CTQ Stations", color: "dark" },
      { value: 83, label: "Operators Required", color: "blue" },
      { value: 84, label: "Operators Available", color: "blue" },
      { value: 10, label: "Buffer Manpower Required", color: "dark" },
      { value: 7, label: "Buffer Manpower Available", color: "dark" },
    ],
    operatorData: [
      { level: "L1", required: 8, available: 8 },
      { level: "L2", required: 25, available: 24 },
      { level: "L3", required: 25, available: 25 },
      { level: "L4", required: 25, available: 25 },
    ],
    manpowerShortageActions: [
      "Buffer manpower planning",
      "Salary revision",
      "Special perks",
    ]
  };

  // Generate aggregate data for all plants
  const generateAggregateData = (): PlantData => {
    if (allPlantsData.length === 0) {
      return {
        ...defaultData,
        plantName: "All Plants ",
        dashboardTitle: "DOJO 2.0 Monitoring Dashboard - All Plants "
      };
    }

    // Create sets of all unique months across all plants for each data type
    const allMonths = new Set<string>();
    const allManpowerMonths = new Set<string>();

    allPlantsData.forEach(plant => {
      plant.data.forEach(item => allMonths.add(item.month));
      plant.bufferData.forEach(item => allMonths.add(item.month));
      plant.attritionData.forEach(item => allMonths.add(item.month));
      plant.manpowerData.forEach(item => allManpowerMonths.add(item.month));
    });

    // Convert to sorted arrays
    const monthsArray = Array.from(allMonths).sort();
    const manpowerMonthsArray = Array.from(allManpowerMonths).sort();

    // Initialize aggregate data structure
    const aggregateData: PlantData = {
      plantName: "All Plants ",
      dashboardTitle: "DOJO 2.0 Monitoring Dashboard - All Plants ",
      data: monthsArray.map(month => ({ month, value: 0 })),
      bufferData: monthsArray.map(month => ({ month, required: 0, available: 0 })),
      manpowerData: manpowerMonthsArray.map(month => ({ month, required: 0, available: 0 })),
      attritionData: monthsArray.map(month => ({ month, attrition: 0 })),
      statsData: [
        { value: 0, label: "Total CTQ Stations ", color: "dark" },
        { value: 0, label: "Operators Required ", color: "blue" },
        { value: 0, label: "Operators Available ", color: "blue" },
        { value: 0, label: "Buffer Manpower Required ", color: "dark" },
        { value: 0, label: "Buffer Manpower Available ", color: "dark" },
      ],
      operatorData: [
        { level: "L1", required: 0, available: 0 },
        { level: "L2", required: 0, available: 0 },
        { level: "L3", required: 0, available: 0 },
        { level: "L4", required: 0, available: 0 },
      ],
      manpowerShortageActions: []
    };

    // Sum up values for each data type
    allPlantsData.forEach(plant => {
      // Sum absenteeism data (Value Data)
      plant.data.forEach(item => {
        const matchingItem = aggregateData.data.find(i => i.month === item.month);
        if (matchingItem && item.value !== undefined) {
          matchingItem.value = (matchingItem.value || 0) + item.value;
        }
      });

      // Sum buffer data (Monthly Data)
      plant.bufferData.forEach(item => {
        const matchingItem = aggregateData.bufferData.find(i => i.month === item.month);
        if (matchingItem) {
          matchingItem.required += item.required || 0;
          matchingItem.available += item.available || 0;
        }
        console.log(matchingItem)
      });

      // Sum manpower data
      plant.manpowerData.forEach(item => {
        const matchingItem = aggregateData.manpowerData.find(i => i.month === item.month);
        if (matchingItem) {
          matchingItem.required += item.required || 0;
          matchingItem.available += item.available || 0;
        }
      });

      // Sum attrition data
      plant.attritionData.forEach(item => {
        const matchingItem = aggregateData.attritionData.find(i => i.month === item.month);
        if (matchingItem) {
          matchingItem.attrition += item.attrition || 0;
        }
      });

      // Sum stats data
      plant.statsData.forEach((item, index) => {
        if (index < aggregateData.statsData.length) {
          aggregateData.statsData[index].value += item.value;
        }
      });

      // Sum operator data
      plant.operatorData.forEach((item, index) => {
        if (index < aggregateData.operatorData.length) {
          aggregateData.operatorData[index].required += item.required;
          aggregateData.operatorData[index].available += item.available;
        }
      });

      // Collect unique actions
      plant.manpowerShortageActions.forEach(action => {
        if (!aggregateData.manpowerShortageActions.includes(action)) {
          aggregateData.manpowerShortageActions.push(action);
        }
      });
    });

    return aggregateData;
  };

  // Load data for a specific plant or generate aggregate data
  const loadPlantData = (plantName: string) => {
    if (plantName === "All") {
      // Generate aggregate data for all plants
      const aggregateData = generateAggregateData();
      setPlantData(aggregateData);
    } else {
      const data = localStorage.getItem(`plant_${plantName}`);
      if (data) {
        const parsedData = JSON.parse(data);

        // Make sure the data array has the expected format for AbsenteeismRateTrend
        // If value is undefined for any entry, set a default of 0
        const processedData = {
          ...parsedData,
          data: parsedData.data.map((item: DataItem) => ({
            month: item.month,
            value: item.value !== undefined ? item.value : 0
          }))
        };

        setPlantData(processedData);
      }
    }
  };

  // Load saved plants and their data on initial render
  useEffect(() => {
    const plants = JSON.parse(localStorage.getItem('plantList') || '[]');
    setSavedPlants(plants);

    // Load all plant data for aggregation
    const allData: PlantData[] = [];
    plants.forEach((plantName: string) => {
      const data = localStorage.getItem(`plant_${plantName}`);
      if (data) {
        const parsedData = JSON.parse(data);
        allData.push(parsedData);
      }
    });
    setAllPlantsData(allData);

    // Default to "All" view, or use the first plant if no data is available
    if (plants.length > 0) {
      setSelectedPlant("All");
      loadPlantData("All");
    } else {
      // Use default data if no plants are saved
      setPlantData(defaultData);
    }
  }, []);

  const handlePlantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plant = e.target.value;
    setSelectedPlant(plant);
    loadPlantData(plant);
  };

  // Check if data is available and properly formatted for AbsenteeismRateTrend
  const hasValidAbsenteeismData = plantData.data && plantData.data.length > 0 &&
    plantData.data.every(item => typeof item.month === 'string' && typeof item.value === 'number');

  // Convert the plantData.data to the format expected by AbsenteeismRateTrend
  const absenteeismData: AbsenteeismDataItem[] = plantData.data.map(item => ({
    month: item.month,
    value: item.value ?? 0 // Use nullish coalescing to provide a default value of 0
  }));

  const navigate = useNavigate();
  // Toggle settings page visibility
  const toggleSettings = () => {
    // setShowSettings(!showSettings);
    navigate('/digital');
  };
  console.log(plantData)
  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <DashboardHeader title={plantData.dashboardTitle} />
        <DashboardStats data={plantData.statsData} />

        <div className={styles.trendsGrid}>
          <ManpowerAvailability  />
          {/* <AttritionRateTrend data={plantData.attritionData} /> */}
          {/* <BufferManpowerAvailability data={plantData.bufferData} /> */}
          {/* {hasValidAbsenteeismData ? (
            <AbsenteeismRateTrend data={absenteeismData} />
          ) : (
            <div className={styles.errorCard}>
              <h3>Absenteeism Data Unavailable</h3>
              <p>Could not load absenteeism data for this plant.</p>
            </div>
          )} */}
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.plantSelector}>
          <button
            className={styles.settingsButton}
            onClick={toggleSettings}
          >
            {/* {showSettings ? "Back to Dashboard" : "Training"} */}Digital
          </button>
          <select
            id="plantSelect"
            value={selectedPlant}
            onChange={handlePlantChange}
            className={styles.plantSelect}
          >

            {savedPlants.map(plant => (
              <option key={plant} value={plant}>{plant}</option>
            ))}
            <option value="All">All Plants </option>
          </select>
        </div>
        <OperatorStats data={plantData.operatorData} />
        <ManpowerActions
          title="Actions Planned for Manpower Shortage"
          data={plantData.manpowerShortageActions}
        />
      </div>
    </div>
  );
};

export default DashboardNew;