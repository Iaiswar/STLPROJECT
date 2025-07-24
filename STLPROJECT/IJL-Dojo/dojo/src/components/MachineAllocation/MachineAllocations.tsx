// src/components/machine/MachineAllocations.tsx
import React, { useState, useEffect } from 'react';
import { 
  fetchMachineAllocations, 
  createMachineAllocation, 
  updateMachineAllocation, 
  deleteMachineAllocation,
  fetchMachines
} from './api';
import { MachineAllocation, Machine, APPROVAL_STATUS_CHOICES } from './types';
import { OperatorMaster } from './types'; // Assuming you have this type defined

const MachineAllocations: React.FC = () => {
  const [allocations, setAllocations] = useState<MachineAllocation[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [employees, setEmployees] = useState<OperatorMaster[]>([]); // You'll need to fetch these
  const [formData, setFormData] = useState<Partial<MachineAllocation>>({
    machine: 0,
    employee: 0,
    approval_status: 'pending',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    { name: 'machine', label: 'Machine', type: 'select', options: machines.map(m => ({ value: m.id, label: m.name })), required: true },
    { name: 'employee', label: 'Employee', type: 'select', options: employees.map(e => ({ value: e.id, label: e.name })), required: true },
    { name: 'approval_status', label: 'Approval Status', type: 'select', options: APPROVAL_STATUS_CHOICES, required: true },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allocs, machs] = await Promise.all([
        fetchMachineAllocations(),
        fetchMachines(),
        // Add fetchEmployees() here when you implement it
      ]);
      setAllocations(allocs);
      setMachines(machs);
      // setEmployees(employeesData) when you implement it
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMachineAllocation(editingId, formData);
      } else {
        await createMachineAllocation(formData);
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving allocation:', error);
    }
  };

  const handleEdit = (allocation: MachineAllocation) => {
    setFormData({
      machine: allocation.machine,
      employee: allocation.employee,
      approval_status: allocation.approval_status,
    });
    setEditingId(allocation.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      try {
        await deleteMachineAllocation(id);
        loadData();
      } catch (error) {
        console.error('Error deleting allocation:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      machine: 0,
      employee: 0,
      approval_status: 'pending',
    });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Machine Allocations</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Allocation' : 'Add New Allocation'}
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
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Allocation List</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : allocations.length === 0 ? (
          <p>No allocations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Machine
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Allocated At
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allocations.map(allocation => (
                  <tr key={allocation.id}>
                    <td className="py-2 px-4 border-b border-gray-200">{allocation.machine_name}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{allocation.employee_name}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {new Date(allocation.allocated_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        allocation.approval_status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {allocation.approval_status.charAt(0).toUpperCase() + allocation.approval_status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => handleEdit(allocation)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-xs mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(allocation.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
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
    </div>
  );
};

export default MachineAllocations;