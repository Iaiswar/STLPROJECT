import React, { useState, useEffect } from "react";
import axios from 'axios';
import OperatorRequirements from "./OperatorRequirement";

interface Factory {
  id: number;
  name: string;
  hq?: string;
}

interface Department {
  id: number;
  name: string;
}

interface AdvancedManpowerCTQ {
  id?: number;
  month_year_ctq: string;
  total_stations_ctq: number | null;
  operator_required_ctq: number | null;
  operator_availability_ctq: number | null;
  buffer_manpower_required_ctq: number | null;
  buffer_manpower_availability_ctq: number | null;
  attrition_trend_ctq: number | null;
  absentee_trend_ctq: number | null;
  planned_units_ctq: number | null;
  actual_production_ctq: number | null;
  factory: number | null;
  department: number | null;
}

const AdvancedSettings: React.FC = () => {
  const [ctqData, setCtqData] = useState<AdvancedManpowerCTQ[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
  const [loading, setLoading] = useState({
    factories: true,
    departments: false,
    ctqData: true,
    upload: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<AdvancedManpowerCTQ>({
    month_year_ctq: '',
    total_stations_ctq: null,
    operator_required_ctq: null,
    operator_availability_ctq: null,
    buffer_manpower_required_ctq: null,
    buffer_manpower_availability_ctq: null,
    attrition_trend_ctq: null,
    absentee_trend_ctq: null,
    planned_units_ctq: null,
    actual_production_ctq: null,
    factory: null,
    department: null,
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

  // Fetch CTQ data
  useEffect(() => {
    const fetchCtqData = async () => {
      setLoading(prev => ({ ...prev, ctqData: true }));
      try {
        const response = await axios.get('http://127.0.0.1:8000/advanced-ctq/');
        setCtqData(response.data);
      } catch (error) {
        setError('Failed to load CTQ data');
      } finally {
        setLoading(prev => ({ ...prev, ctqData: false }));
      }
    };
    fetchCtqData();
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
    try {
      const formattedData = {
        ...formData,
        month_year_ctq: formData.month_year_ctq ? `${formData.month_year_ctq}-01` : '',
      };

      const response = await axios.post('http://127.0.0.1:8000/advanced-ctq/', formattedData);

      if (response.status === 201) {
        alert('Data added successfully!');
        setFormData({
          month_year_ctq: '',
          total_stations_ctq: null,
          operator_required_ctq: null,
          operator_availability_ctq: null,
          buffer_manpower_required_ctq: null,
          buffer_manpower_availability_ctq: null,
          attrition_trend_ctq: null,
          absentee_trend_ctq: null,
          planned_units_ctq: null,
          actual_production_ctq: null,
          factory: null,
          department: null,
        });
        setSelectedFactory(null);
        setDepartments([]);
        // Refresh data
        const refreshResponse = await axios.get('http://127.0.0.1:8000/advanced-ctq/');
        setCtqData(refreshResponse.data);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/advanced-ctq/${id}/`);
        setCtqData(prev => prev.filter(item => item.id !== id));
        alert('Entry deleted successfully!');
      } catch (error) {
        console.error("Error deleting entry:", error);
        alert('Error deleting entry. Please try again.');
      }
    }
  };

  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    setLoading(prev => ({ ...prev, upload: true }));
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      // await axios.post('http://127.0.0.1:8000/upload-advanced-manpower/', formData, {
      await axios.post('http://127.0.0.1:8000/upload-ctq/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Excel file uploaded successfully!');
      setUploadFile(null);
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      // Refresh data
      const response = await axios.get('http://127.0.0.1:8000/advanced-ctq/');
      setCtqData(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
    }
  };

  const handleInputChange = (field: keyof AdvancedManpowerCTQ, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'month_year_ctq' 
        ? value
        : (value === '' ? null : Number(value))
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getFactoryName = (id: number) => {
    return factories.find(f => f.id === id)?.name || id;
  };

  const getDepartmentName = (id: number) => {
    return departments.find(d => d.id === id)?.name || id;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Advance Manpower Planning Dashboard Settings</h1>

        {/* Excel Upload Section */}
        <section className="mb-10 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Excel Data</h2>
          <form onSubmit={handleExcelUpload} className="flex flex-col space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Select Excel File</label>
              <input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              disabled={!uploadFile || loading.upload}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.upload ? 'Uploading...' : 'Upload Excel'}
            </button>
          </form>
        </section>

        <section className="mb-10 p-6 bg-gray-50 rounded-lg">
          <OperatorRequirements />
        </section>

        {/* Data Entry Form */}
        <section className="mb-10 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Factory Dropdown */}
              <div>
                <label htmlFor="factory" className="block text-sm font-medium text-gray-600 mb-1">
                  Factory
                </label>
                <select
                  id="factory"
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

              {/* Date Input */}
              <div>
                <label htmlFor="month_year_ctq" className="block text-sm font-medium text-gray-600 mb-1">
                  Month/Year
                </label>
                <input
                  id="month_year_ctq"
                  type="month"
                  value={formData.month_year_ctq}
                  onChange={(e) => handleInputChange('month_year_ctq', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Numeric Inputs */}
              {[
                { id: 'total_stations_ctq', label: 'Total Stations' },
                { id: 'operator_required_ctq', label: 'Operators Required' },
                { id: 'operator_availability_ctq', label: 'Operators Available' },
                { id: 'buffer_manpower_required_ctq', label: 'Buffer Manpower Required' },
                { id: 'buffer_manpower_availability_ctq', label: 'Buffer Manpower Available' },
                { id: 'attrition_trend_ctq', label: 'Attrition Trend' },
                { id: 'absentee_trend_ctq', label: 'Absenteeism  Trend' },
                { id: 'planned_units_ctq', label: 'Planned Units' },
                { id: 'actual_production_ctq', label: 'Actual Production' },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type="number"
                    min="0"
                    value={formData[field.id as keyof AdvancedManpowerCTQ] || ''}
                    onChange={(e) => handleInputChange(field.id as keyof AdvancedManpowerCTQ, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter value"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Entry
              </button>
            </div>
          </form>
        </section>

        {/* Data Table */}
        {loading.ctqData ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : ctqData.length > 0 ? (
          <section className="overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Data</h2>
            <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stations</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Req</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Avail</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buffer Req</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buffer Avail</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ctqData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(item.month_year_ctq)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.factory ? getFactoryName(item.factory) : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.department ? getDepartmentName(item.department) : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_stations_ctq ?? '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.operator_required_ctq ?? '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.operator_availability_ctq ?? '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.buffer_manpower_required_ctq ?? '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.buffer_manpower_availability_ctq ?? '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => item.id && handleDelete(item.id)}
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
          </section>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No data available. Please add some entries.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSettings;