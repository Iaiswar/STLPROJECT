import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./setting.module.css";
import axios from 'axios';
// Define the CardData interface
interface CardData {
  number: number;
  text: string;
  bgColor: string;
}

// Define the TrainingData interface
interface TrainingData {
  month: string;
  operatorsJoined: number;
  operatorsTrained: number;
}

// Define ProductionDataItem interface
interface ProductionDataItem {
  id: number;
  year: string;
  month: string;
  units: string;
  manpower: string;
  available: string;
}

interface DigitalSettingsProps {
  trainingData: CardData[];
  defectsData: CardData[];
  operatorsTrainingData: TrainingData[];
  onSaveTrainingData: (data: CardData[]) => void;
  onSaveDefectsData: (data: CardData[]) => void;
  onSaveOperatorsTrainingData: (data: TrainingData[]) => void;
}

const DigitalSettings: React.FC<DigitalSettingsProps> = ({
  trainingData,
  defectsData,
  operatorsTrainingData = [],
  onSaveTrainingData,
  onSaveDefectsData,
  onSaveOperatorsTrainingData
}) => {
  const navigate = useNavigate();

  const [productionData, setProductionData] = useState<ProductionDataItem[]>([]);
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    units: '',
    available: '',
    manpower: ''
  });

  // useEffect(() => {
  //   fetch('http://127.0.0.1:8000//plants/')
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch production data');
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setProductionData(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching production data:', error);
  //     });
  // }, []);

  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/plants/');
      const data = await response.json();
      setProductionData(data);
    } catch (error) {
      console.error('Error fetching production data:', error);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];



  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/plants/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit production plan');
      }

      // Optionally clear form
      setFormData({
        year: '',
        month: '',
        units: '',
        manpower: '',
        available: '',
      });

      // Refetch the updated data
      fetchProductionData();
    } catch (error) {
      console.error('Error submitting production plan:', error);
    }
  };




  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/plants/${id}/`);
      console.log("Deleted successfully");
      // Re-fetch the updated data after deletion
      await fetchProductionData();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };
  
  

  // Create local state for editing
  const [editedTrainingData, setEditedTrainingData] = useState<CardData[]>([...trainingData]);
  const [editedDefectsData, setEditedDefectsData] = useState<CardData[]>([...defectsData]);
  const [editedOperatorsTrainingData, setEditedOperatorsTrainingData] = useState<TrainingData[]>(
    operatorsTrainingData.length > 0
      ? [...operatorsTrainingData]
      : [
        { month: "Jan 2024", operatorsJoined: 10, operatorsTrained: 5 },
        { month: "Feb 2024", operatorsJoined: 20, operatorsTrained: 15 },
        { month: "Mar 2024", operatorsJoined: 15, operatorsTrained: 10 },
        { month: "Apr 2024", operatorsJoined: 30, operatorsTrained: 25 },
        { month: "May 2024", operatorsJoined: 25, operatorsTrained: 20 },
        { month: "Jun 2024", operatorsJoined: 35, operatorsTrained: 30 }
      ]
  );

  // Handle input changes for Training Summary cards
  const handleTrainingChange = (index: number, field: keyof CardData, value: string | number) => {
    const newData = [...editedTrainingData];
    if (field === 'number') {
      newData[index][field] = Number(value);
    } else {
      newData[index][field] = value as any;
    }
    setEditedTrainingData(newData);
  };

  // Handle input changes for Man Related Defects cards
  const handleDefectsChange = (index: number, field: keyof CardData, value: string | number) => {
    const newData = [...editedDefectsData];
    if (field === 'number') {
      newData[index][field] = Number(value);
    } else {
      newData[index][field] = value as any;
    }
    setEditedDefectsData(newData);
  };

  // Handle input changes for Operators Training data
  const handleOperatorsTrainingChange = (index: number, field: keyof TrainingData, value: string | number) => {
    const newData = [...editedOperatorsTrainingData];
    if (field === 'month') {
      newData[index][field] = value as string;
    } else {
      newData[index][field] = Number(value);
    }
    setEditedOperatorsTrainingData(newData);
  };

  // Save all changes
  const saveChanges = () => {
    onSaveTrainingData(editedTrainingData);
    onSaveDefectsData(editedDefectsData);
    onSaveOperatorsTrainingData(editedOperatorsTrainingData);
    alert("Settings saved successfully!");
  };



  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.settingsTitle}>Digital Dashboard Settings</h2>

      <div className={styles.settingsSection}>
        <h3>Training Summary Card Settings</h3>
        <div className={styles.cardSettingsGrid}>
          {editedTrainingData.map((card, index) => (
            <div key={index} className={styles.cardSetting}>
              <div className={styles.previewCard} style={{ backgroundColor: card.bgColor }}>
                <h3>{card.number}</h3>
                <p>{card.text}</p>
              </div>
              <div className={styles.cardControls}>
                <div className={styles.inputGroup}>
                  <label>Number:</label>
                  <input
                    type="number"
                    value={card.number}
                    onChange={(e) => handleTrainingChange(index, 'number', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Text:</label>
                  <input
                    type="text"
                    value={card.text}
                    onChange={(e) => handleTrainingChange(index, 'text', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Background Color:</label>
                  <input
                    type="color"
                    value={card.bgColor}
                    onChange={(e) => handleTrainingChange(index, 'bgColor', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>Man Related Defects Card Settings</h3>
        <div className={styles.cardSettingsGrid}>
          {editedDefectsData.map((card, index) => (
            <div key={index} className={styles.cardSetting}>
              <div className={styles.previewCard} style={{ backgroundColor: card.bgColor }}>
                <h3>{card.number}</h3>
                <p>{card.text}</p>
              </div>
              <div className={styles.cardControls}>
                <div className={styles.inputGroup}>
                  <label>Number:</label>
                  <input
                    type="number"
                    value={card.number}
                    onChange={(e) => handleDefectsChange(index, 'number', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Text:</label>
                  <input
                    type="text"
                    value={card.text}
                    onChange={(e) => handleDefectsChange(index, 'text', e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Background Color:</label>
                  <input
                    type="color"
                    value={card.bgColor}
                    onChange={(e) => handleDefectsChange(index, 'bgColor', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h3>Operators Training Data Settings</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Operators Joined</th>
                <th>Operators Trained</th>
              </tr>
            </thead>
            <tbody>
              {editedOperatorsTrainingData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.month}
                      onChange={(e) => handleOperatorsTrainingChange(index, 'month', e.target.value)}
                      className={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.operatorsJoined}
                      onChange={(e) => handleOperatorsTrainingChange(index, 'operatorsJoined', e.target.value)}
                      className={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.operatorsTrained}
                      onChange={(e) => handleOperatorsTrainingChange(index, 'operatorsTrained', e.target.value)}
                      className={styles.tableInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className={styles.settingsSection}>
        <h3>Man Related Defects Trend at MSIL</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Overall Defects</th>
                <th>Defects from CTQ Stations</th>
              </tr>
            </thead>
            <tbody>
              {editedOperatorsTrainingData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.month}
                      onChange={(e) => handleOperatorsTrainingChange(index, 'month', e.target.value)}
                      className={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.operatorsJoined}
                      onChange={(e) => handleOperatorsTrainingChange(index, 'operatorsJoined', e.target.value)}
                      className={styles.tableInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.operatorsTrained}
                      onChange={(e) => handleOperatorsTrainingChange(index, 'operatorsTrained', e.target.value)}
                      className={styles.tableInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className={styles.settingsSection}>
        <h3>Month-wise Production Plan</h3>

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <div className={styles.formGroup}>
            <label>Select Year:</label>
            <select
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className={styles.formDropdown}
            >
              <option value="">-- Select Year --</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Select Month:</label>
            <select
              value={formData.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              className={styles.formDropdown}
            >
              <option value="">-- Select Month --</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>No. of Units:</label>
            <input
              type="number"
              value={formData.units}
              onChange={(e) => handleInputChange('units', e.target.value)}
              className={styles.formInput}
              placeholder="Enter number of units"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Required Manpower:</label>
            <input
              type="number"
              value={formData.manpower}
              onChange={(e) => handleInputChange('manpower', e.target.value)}
              className={styles.formInput}
              placeholder="Enter required manpower"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Available:</label>
            <input
              type="number"
              value={formData.available}
              onChange={(e) => handleInputChange('available', e.target.value)}
              className={styles.formInput}
              placeholder="Enter available"
            />
          </div>

          <button type="submit" className={styles.submitButton}>Add Entry</button>
        </form>

        {productionData.length > 0 && (
          <div className={styles.tableWrapper}>
            <h4>Production Plan Data</h4>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Month</th>
                  <th>No. of Units</th>
                  <th>Required Manpower</th>
                  <th>Available</th>
                  <th>Action</th>
               
                </tr>
              </thead>
              <tbody>
                {productionData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.year}</td>
                    <td>{item.month}</td>
                    <td>{item.units}</td>
                    <td>{item.manpower}</td>
                    <td>{item.available}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.saveButton} onClick={saveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DigitalSettings;