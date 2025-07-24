import React, { useState, useEffect } from "react";
import axios from 'axios';

interface Factory {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

interface OperatorRequirement {
  id?: number;
  factory: number | null;
  department: number | null;
  month: string;  // Date string in format YYYY-MM-DD
  level: number;
  operator_required: number;
  operator_available: number;
}

const OperatorRequirements: React.FC = () => {
  const [requirements, setRequirements] = useState<OperatorRequirement[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
  const [loading, setLoading] = useState({
    main: false,
    factories: true,
    departments: false,
    submit: false,
  });
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<OperatorRequirement>({
    factory: null,
    department: null,
    month: '',
    level: 1,
    operator_required: 0,
    operator_available: 0
  });

  // Fetch factories
  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/factories/');
        setFactories(response.data);
        setLoading(prev => ({ ...prev, factories: false }));
      } catch (error) {
        setError('Failed to load factories');
        setLoading(prev => ({ ...prev, factories: false }));
      }
    };
    fetchFactories();
  }, []);

  // Fetch departments when factory is selected
  useEffect(() => {
    if (!selectedFactory) return;

    const fetchDepartments = async () => {
      setLoading(prev => ({ ...prev, departments: true }));
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/departments-by-factory/?factory=${selectedFactory}`
        );
        setDepartments(response.data);
      } catch (error) {
        setError('Failed to load departments');
      } finally {
        setLoading(prev => ({ ...prev, departments: false }));
      }
    };

    fetchDepartments();
  }, [selectedFactory]);

  // Fetch requirements
  useEffect(() => {
    const fetchRequirements = async () => {
      setLoading(prev => ({ ...prev, main: true }));
      try {
        const response = await axios.get('http://127.0.0.1:8000/operator-requirements/');
        setRequirements(response.data);
      } catch (error) {
        setError('Failed to load requirements');
      } finally {
        setLoading(prev => ({ ...prev, main: false }));
      }
    };
    fetchRequirements();
  }, []);

  const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const factoryId = parseInt(e.target.value);
    setSelectedFactory(factoryId);
    setFormData(prev => ({ ...prev, factory: factoryId, department: null }));
    setDepartments([]);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, department: departmentId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.factory || !formData.department || !formData.month) {
      alert('Please select factory, department, and month');
      return;
    }

    setLoading(prev => ({ ...prev, submit: true }));
    try {
      const formattedData = {
        ...formData,
        month: formData.month ? `${formData.month}-01` : '',
        factory: Number(formData.factory),
        department: Number(formData.department),
      };

      await axios.post('http://127.0.0.1:8000/operator-requirements/', formattedData);
      
      // Refresh data
      const response = await axios.get('http://127.0.0.1:8000/operator-requirements/');
      setRequirements(response.data);
      
      // Reset form (keep factory and department)
      setFormData(prev => ({
        ...prev,
        month: '',
        level: 1,
        operator_required: 0,
        operator_available: 0
      }));
    } catch (error) {
      console.error('Error submitting data:', error);
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        alert('Error submitting data');
      }
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/operator-requirements/${id}/`);
        setRequirements(prev => prev.filter(req => req.id !== id));
      } catch (error) {
        console.error('Error deleting requirement:', error);
        alert('Error deleting requirement');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' || name === 'operator_required' || name === 'operator_available' 
        ? Number(value) 
        : value
    }));
  };

  const formatMonth = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getFactoryName = (id: number) => {
    return factories.find(f => f.id === id)?.name || id;
  };

  const getDepartmentName = (id: number) => {
    return departments.find(d => d.id === id)?.name || id;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Operator Requirements</h1>
        
        {/* Add New Requirement Form */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Requirement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Factory Dropdown */}
              <div>
                <label htmlFor="factory" className="block text-sm font-medium text-gray-600 mb-1">
                  Factory
                </label>
                <select
                  id="factory"
                  name="factory"
                  value={formData.factory || ''}
                  onChange={handleFactoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a factory</option>
                  {factories.map((factory) => (
                    <option key={factory.id} value={factory.id}>
                      {factory.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Dropdown */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-600 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleDepartmentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.factory || loading.departments}
                >
                  <option value="">Select a department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Input */}
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-600 mb-1">
                  Month
                </label>
                <input
                  type="month"
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-600 mb-1">
                  Skill Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4].map(level => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="operator_required" className="block text-sm font-medium text-gray-600 mb-1">
                  Operators Required
                </label>
                <input
                  type="number"
                  id="operator_required"
                  name="operator_required"
                  min="0"
                  value={formData.operator_required}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="operator_available" className="block text-sm font-medium text-gray-600 mb-1">
                  Operators Available
                </label>
                <input
                  type="number"
                  id="operator_available"
                  name="operator_available"
                  min="0"
                  value={formData.operator_available}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading.submit}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading.submit ? 'Adding...' : 'Add Requirement'}
              </button>
            </div>
          </form>
        </section>

        {/* Requirements Table */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Requirements</h2>
          {loading.main ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : requirements.length > 0 ? (
            <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requirements.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {req.factory ? getFactoryName(req.factory) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {req.department ? getDepartmentName(req.department) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatMonth(req.month)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Level {req.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {req.operator_required}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {req.operator_available}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        req.operator_available >= req.operator_required 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {req.operator_available - req.operator_required}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => req.id && handleDelete(req.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No operator requirements found
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OperatorRequirements;