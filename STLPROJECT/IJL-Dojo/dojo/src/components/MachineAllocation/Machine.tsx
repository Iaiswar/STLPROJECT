import React, { useState, useEffect } from 'react';
import { fetchMachines, createMachine, updateMachine, deleteMachine } from './api';
import { Machine, LEVEL_CHOICES } from './types';

const Machines: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [formData, setFormData] = useState<Partial<Machine>>({
    name: '',
    level: 1,
    process: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'level', label: 'Level', type: 'select', options: LEVEL_CHOICES, required: true },
    { name: 'process', label: 'Process', type: 'text', required: false },
    { name: 'image', label: 'Image', type: 'file', required: false },
  ];

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMachines();
      setMachines(data);
    } catch (error) {
      console.error('Error loading machines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value.toString());
      }
    });
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingId) {
        await updateMachine(editingId, data);
      } else {
        await createMachine(data);
      }
      resetForm();
      loadMachines();
    } catch (error) {
      console.error('Error saving machine:', error);
    }
  };

  const handleEdit = (machine: Machine) => {
    setFormData({
      name: machine.name,
      level: machine.level,
      process: machine.process || '',
    });
    setEditingId(machine.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await deleteMachine(id);
        loadMachines();
      } catch (error) {
        console.error('Error deleting machine:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      level: 1,
      process: '',
    });
    setImageFile(null);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Machines Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Machine' : 'Add New Machine'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field.name} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.name}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData] as string | number}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required={field.required}
                  >
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'file' ? (
                  <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    onChange={handleFileChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required={field.required && !editingId}
                    accept="image/*"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData] as string | number || ''}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Machine List</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : machines.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No machines found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {machines.map(machine => (
              <div key={machine.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {machine.image ? (
                    <img 
                      src={machine.image.startsWith('http') ? machine.image : `http://127.0.0.1:8000${machine.image}`}
                      alt={machine.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{machine.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Level:</span>
                      <span>{LEVEL_CHOICES.find(l => l.value === machine.level)?.label}</span>
                    </div>
                    {machine.process && (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Process:</span>
                        <span>{machine.process}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleEdit(machine)}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(machine.id)}
                      className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Machines;