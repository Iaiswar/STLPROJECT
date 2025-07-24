import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Group {
  id: number;
  name: string;
}

const PlantCreate: React.FC = () => {
  const [plantName, setPlantName] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | ''>('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/groups/')
      .then(response => setGroups(response.data))
      .catch(error => console.error('Error fetching groups:', error));
  }, []);

  const handleCreatePlant = () => {
    if (!plantName || !selectedGroupId) {
      alert('Please provide a plant name and select a group.');
      return;
    }

    axios.post('http://127.0.0.1:8000/plants/', {
      name: plantName,
      group: selectedGroupId,
    })
    .then(() => {
      alert('Plant created successfully!');
      setPlantName('');
      setSelectedGroupId('');
    })
    .catch(error => {
      console.error('Error creating plant:', error);
      alert('Failed to create plant.');
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add New Plant</h2>
      
      <select
        value={selectedGroupId}
        onChange={(e) => setSelectedGroupId(Number(e.target.value))}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Group</option>
        {groups.map(group => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Plant Name"
        value={plantName}
        onChange={(e) => setPlantName(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleCreatePlant}
        className="w-full bg-green-600  text-white py-2 rounded hover:bg-blue-700"
      >
        Create Plant
      </button>
    </div>
  );
};

export default PlantCreate;
