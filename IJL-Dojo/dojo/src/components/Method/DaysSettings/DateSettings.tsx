import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Plant {
  id: number;
  name: string;
}

const DayCreate: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<number | ''>('');
  const [dayNumber, setDayNumber] = useState<number | ''>('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/plants/')
      .then(res => setPlants(res.data))
      .catch(err => console.error('Error fetching plants:', err));
  }, []);

  const handleCreateDay = () => {
    if (!selectedPlantId || !dayNumber) {
      alert('Please select both a plant and a day.');
      return;
    }

    axios.post('http://127.0.0.1:8000/days/', {
      plant: selectedPlantId,
      day_number: dayNumber
    })
    .then(() => {
      alert('Day created successfully!');
      setSelectedPlantId('');
      setDayNumber('');
    })
    .catch(err => {
      console.error('Error creating day:', err);
      alert('Failed to create day.');
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Day to Plant</h2>

      <select
        value={selectedPlantId}
        onChange={(e) => setSelectedPlantId(Number(e.target.value))}
        className="w-full border p-2 mb-4 rounded"
      >
        <option value="">Select Plant</option>
        {plants.map(plant => (
          <option key={plant.id} value={plant.id}>{plant.name}</option>
        ))}
      </select>

      <select
        value={dayNumber}
        onChange={(e) => setDayNumber(Number(e.target.value))}
        className="w-full border p-2 mb-4 rounded"
      >
        <option value="">Select Day Number</option>
        {[1, 2, 3, 4, 5, 6].map(day => (
          <option key={day} value={day}>Day {day}</option>
        ))}
      </select>

      <button
        onClick={handleCreateDay}
        className="w-full bg-green-600  text-white py-2 rounded hover:bg-blue-700"
      >
        Create Day
      </button>
    </div>
  );
};

export default DayCreate;
