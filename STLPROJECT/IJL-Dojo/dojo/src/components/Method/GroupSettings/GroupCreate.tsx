import React, { useState } from 'react';
import axios from 'axios';

const GroupCreate: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setErrorMessage('Group name cannot be empty.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/groups/', { name: groupName });
      setSuccessMessage(`Group "${groupName}" created successfully!`);
      setErrorMessage('');
      setGroupName('');
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Failed to create group. It might already exist.');
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Group</h2>

      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
        className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleCreateGroup}
        className="w-full bg-green-600  text-white py-2 rounded hover:bg-blue-700"
      >
        Add Group
      </button>

      {successMessage && (
        <p className="text-green-600 mt-4 text-center">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 mt-4 text-center">{errorMessage}</p>
      )}
    </div>
  );
};

export default GroupCreate;
