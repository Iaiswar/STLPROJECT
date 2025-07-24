import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Plant {
  id: number;
  name: string;
}

const DepartmentCreate: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<number | ''>('');
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/plants/')
      .then(res => setPlants(res.data))
      .catch(err => console.error('Error fetching plants:', err));
  }, []);

  const handleCreateDepartment = () => {
    if (!departmentName || !selectedPlantId) {
      alert('Please fill in all fields.');
      return;
    }

    axios.post('http://127.0.0.1:8000/departments/', {
      name: departmentName,
      plant: selectedPlantId
    })
    .then(() => {
      alert('Department created successfully!');
      setDepartmentName('');
      setSelectedPlantId('');
    })
    .catch(err => {
      console.error('Error creating department:', err);
      alert('Failed to create department.');
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add New Department</h2>

      <input
        type="text"
        placeholder="Department Name"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <select
        value={selectedPlantId}
        onChange={(e) => setSelectedPlantId(Number(e.target.value))}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select Plant</option>
        {plants.map(plant => (
          <option key={plant.id} value={plant.id}>{plant.name}</option>
        ))}
      </select>

      <button
        onClick={handleCreateDepartment}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Create Department
      </button>
    </div>
  );
};

export default DepartmentCreate;
