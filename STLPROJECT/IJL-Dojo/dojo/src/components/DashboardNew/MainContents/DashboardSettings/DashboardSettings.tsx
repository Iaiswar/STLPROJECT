import React, { useState, useEffect } from 'react';
import styles from './DashboardSettings.module.css';

interface DataItem {
  month: string;
  value?: number;
  required?: number;
  available?: number;
  attrition?: number;
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
  bufferData: DataItem[];
  manpowerData: DataItem[];
  attritionData: DataItem[];
  statsData: StatItem[];
  operatorData: OperatorItem[];
  manpowerShortageActions: string[];
}

const months = [
  "Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", 
  "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"
];

const manpowerMonths = [
  "April", "May", "June", "July", "August", "September", 
  "October", "November", "December", "January", "February", "March"
];

const defaultData: PlantData = {
  plantName: "Plant 1",
  dashboardTitle: "DOJO 2.0 Monitoring Dashboard - CTQ Stations",
  data: months.map(month => ({ month, value: 0 })),
  bufferData: months.slice(0, 12).map(month => ({ month, required: 10, available: 0 })),
  manpowerData: manpowerMonths.map(month => ({ month, required: 83, available: 0 })),
  attritionData: months.map(month => ({ month, attrition: 0 })),
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

const DashboardSettings: React.FC = () => {
  const [plantData, setPlantData] = useState<PlantData>(defaultData);
  const [savedPlants, setSavedPlants] = useState<string[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [actionInput, setActionInput] = useState<string>("");
  
  const clearLocalStorage = () => {
    localStorage.clear();
    alert("Local storage has been cleared!");
  };
  // Load saved plants on initial render
  useEffect(() => {
    const plants = JSON.parse(localStorage.getItem('plantList') || '[]');
    setSavedPlants(plants);
    
    // If there are saved plants, load the first one
    if (plants.length > 0) {
      setSelectedPlant(plants[0]);
      loadPlantData(plants[0]);
    }
  }, []);
  
  const loadPlantData = (plantName: string) => {
    const data = localStorage.getItem(`plant_${plantName}`);
    if (data) {
      setPlantData(JSON.parse(data));
    }
  };

  const handlePlantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plant = e.target.value;
    setSelectedPlant(plant);
    if (plant) {
      loadPlantData(plant);
    } else {
      setPlantData(defaultData);
    }
  };

  const handlePlantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlantData({...plantData, plantName: e.target.value});
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlantData({...plantData, dashboardTitle: e.target.value});
  };

  const handleStatsChange = (index: number, field: 'value', value: number) => {
    const newStats = [...plantData.statsData];
    newStats[index][field] = value;
    setPlantData({...plantData, statsData: newStats});
  };

  const handleOperatorDataChange = (index: number, field: 'required' | 'available', value: number) => {
    const newData = [...plantData.operatorData];
    newData[index][field] = value;
    setPlantData({...plantData, operatorData: newData});
  };

  const handleDataChange = (dataType: 'data' | 'bufferData' | 'manpowerData' | 'attritionData', index: number, field: string, value: number) => {
    const newData = [...plantData[dataType]];
    newData[index] = { ...newData[index], [field]: value };
    setPlantData({...plantData, [dataType]: newData});
  };

  const handleAddAction = () => {
    if (actionInput.trim()) {
      setPlantData({
        ...plantData,
        manpowerShortageActions: [...plantData.manpowerShortageActions, actionInput.trim()]
      });
      setActionInput("");
    }
  };

  const handleRemoveAction = (index: number) => {
    const newActions = [...plantData.manpowerShortageActions];
    newActions.splice(index, 1);
    setPlantData({...plantData, manpowerShortageActions: newActions});
  };

  const handleSave = () => {
    // Save current plant data
    localStorage.setItem(`plant_${plantData.plantName}`, JSON.stringify(plantData));
    
    // Update plant list if this is a new plant
    if (!savedPlants.includes(plantData.plantName)) {
      const updatedPlants = [...savedPlants, plantData.plantName];
      localStorage.setItem('plantList', JSON.stringify(updatedPlants));
      setSavedPlants(updatedPlants);
      setSelectedPlant(plantData.plantName);
    }
    
    alert(`Plant "${plantData.plantName}" data saved successfully!`);
  };

  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.title}>Plant Settings</h1>
      
      <div className={styles.formSection}>
        <label>
          Select Existing Plant:
          <select value={selectedPlant} onChange={handlePlantChange} className={styles.select}>
            <option value="">-- Create New Plant --</option>
            {savedPlants.map(plant => (
              <option key={plant} value={plant}>{plant}</option>
            ))}
          </select>
        </label>
      </div>
      
      <div className={styles.formSection}>
        <h2>Basic Information</h2>
        <label>
          Plant Name:
          <input 
            type="text" 
            value={plantData.plantName} 
            onChange={handlePlantNameChange} 
            className={styles.input} 
            required
          />
        </label>
        
        <label>
          Dashboard Title:
          <input 
            type="text" 
            value={plantData.dashboardTitle} 
            onChange={handleTitleChange} 
            className={styles.input} 
          />
        </label>
      </div>
      
      <div className={styles.formSection}>
        <h2>Stats Data</h2>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Label</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {plantData.statsData.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.label}</td>
                  <td>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => handleStatsChange(index, 'value', parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Operator Data</h2>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Level</th>
                <th>Required</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {plantData.operatorData.map((op, index) => (
                <tr key={index}>
                  <td>{op.level}</td>
                  <td>
                    <input
                      type="number"
                      value={op.required}
                      onChange={(e) => handleOperatorDataChange(index, 'required', parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={op.available}
                      onChange={(e) => handleOperatorDataChange(index, 'available', parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Monthly Data</h2>
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button className={styles.tabActive}>Buffer Data</button>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Required</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {plantData.bufferData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.month}</td>
                    <td>
                      <input
                        type="number"
                        value={item.required}
                        onChange={(e) => handleDataChange('bufferData', index, 'required', parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.available}
                        onChange={(e) => handleDataChange('bufferData', index, 'available', parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Attrition Data</h2>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Attrition</th>
              </tr>
            </thead>
            <tbody>
              {plantData.attritionData.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>
                    <input
                      type="number"
                      value={item.attrition}
                      onChange={(e) => handleDataChange('attritionData', index, 'attrition', parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Manpower Data</h2>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Required</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {plantData.manpowerData.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>
                    <input
                      type="number"
                      value={item.required}
                      onChange={(e) => handleDataChange('manpowerData', index, 'required', parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.available}
                      onChange={(e) => handleDataChange('manpowerData', index, 'available', parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Value Data</h2>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {plantData.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleDataChange('data', index, 'value', parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h2>Manpower Shortage Actions</h2>
        <div className={styles.actionsList}>
          {plantData.manpowerShortageActions.map((action, index) => (
            <div key={index} className={styles.actionItem}>
              <span>{action}</span>
              <button onClick={() => handleRemoveAction(index)} className={styles.removeButton}>Remove</button>
            </div>
          ))}
        </div>
        <div className={styles.actionInput}>
          <input
            type="text"
            value={actionInput}
            onChange={(e) => setActionInput(e.target.value)}
            placeholder="Add new action..."
            className={styles.input}
          />
          <button onClick={handleAddAction} className={styles.addButton}>Add</button>
        </div>
      </div>
      
      <div className={styles.buttonContainer}>
        <button onClick={handleSave} className={styles.saveButton}>Save Plant Data</button>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={clearLocalStorage} className={styles.saveButton}>Clear Data</button>
      </div>
      
    </div>
  );
};

export default DashboardSettings;