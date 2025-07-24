import React, { useState, useEffect } from "react";
import axios from 'axios';

interface ManagementReviewData {
  id?: number;
  month_year: string;
  new_operators_joined: number;
  new_operators_trained: number;
  total_training_plans: number;
  total_trainings_actual: number;
  total_defects_msil: number;
  ctq_defects_msil: number;
  total_defects_tier1: number;
  ctq_defects_tier1: number;
  total_internal_rejection: number;
  ctq_internal_rejection: number;
}

const DigitalSettings: React.FC = () => {
  const [managementReviewData, setManagementReviewData] = useState<ManagementReviewData[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formData, setFormData] = useState<ManagementReviewData>({
    month_year: '',
    new_operators_joined: 0,
    new_operators_trained: 0,
    total_training_plans: 0,
    total_trainings_actual: 0,
    total_defects_msil: 0,
    ctq_defects_msil: 0,
    total_defects_tier1: 0,
    ctq_defects_tier1: 0,
    total_internal_rejection: 0,
    ctq_internal_rejection: 0,
  });

  useEffect(() => {
    fetchManagementReviewData();
  }, []);

  const fetchManagementReviewData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/management-review/');
      setManagementReviewData(response.data);
    } catch (error) {
      console.error('Error fetching management review data:', error);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // Format the month_year to YYYY-MM-01 format
    const formattedData = {
      ...formData,
      month_year: formData.month_year ? `${formData.month_year}-01` : ''
    };

    const response = await axios.post('http://127.0.0.1:8000/management-review/', formattedData);
    
    if (response.status === 201) {
      alert('Data added successfully!');
      setFormData({
        month_year: '',
        new_operators_joined: 0,
        new_operators_trained: 0,
        total_training_plans: 0,
        total_trainings_actual: 0,
        total_defects_msil: 0,
        ctq_defects_msil: 0,
        total_defects_tier1: 0,
        ctq_defects_tier1: 0,
        total_internal_rejection: 0,
        ctq_internal_rejection: 0,
      });
      fetchManagementReviewData();
    }
  } catch (error) {
    console.error('Error submitting data:', error);
    alert('Error submitting data. Please try again.');
  }
};

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/management-review/${id}/`);
        fetchManagementReviewData();
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

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      await axios.post('http://127.0.0.1:8000/upload-management-review/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Excel file uploaded successfully!');
      setUploadFile(null);
      const fileInput = document.getElementById('excel-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchManagementReviewData();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleInputChange = (field: keyof ManagementReviewData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  // Handle both formats (YYYY-MM and YYYY-MM-DD)
  const dateParts = dateString.split('-');
  const year = dateParts[0];
  const month = dateParts[1].length === 2 ? dateParts[1] : dateParts[1].padStart(2, '0');
  
  const date = new Date(`${year}-${month}-01`);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  });
};
  // Simplified form fields configuration
  const formFields = [
    { id: 'month_year', label: 'Month/Year', type: 'month', required: true },
    { id: 'new_operators_joined', label: 'New Operators Joined', type: 'number', required: true },
    { id: 'new_operators_trained', label: 'New Operators Trained', type: 'number', required: true },
    { id: 'total_training_plans', label: 'Total Training Plans', type: 'number', required: true },
    { id: 'total_trainings_actual', label: 'Total Trainings Actual', type: 'number', required: true },
    { id: 'total_defects_msil', label: 'Total Defects MSIL', type: 'number', required: true },
    { id: 'ctq_defects_msil', label: 'CTQ Defects MSIL', type: 'number', required: true },
    { id: 'total_defects_tier1', label: 'Total Defects Tier1', type: 'number', required: true },
    { id: 'ctq_defects_tier1', label: 'CTQ Defects Tier1', type: 'number', required: true },
    { id: 'total_internal_rejection', label: 'Total Internal Rejection', type: 'number', required: true },
    { id: 'ctq_internal_rejection', label: 'CTQ Internal Rejection', type: 'number', required: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Management Review Dashboard Settings</h1>
        
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
              disabled={!uploadFile || uploadLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : 'Upload Excel'}
            </button>
          </form>
        </section>

        {/* Data Entry Form */}
        <section className="mb-10 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formFields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id as keyof ManagementReviewData] as string | number}
                    onChange={(e) => handleInputChange(field.id as keyof ManagementReviewData, field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required={field.required}
                    min={field.type === 'number' ? 0 : undefined}
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
        {managementReviewData.length > 0 && (
          <section className="overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Data</h2>
            <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Joined</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operators Trained</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Plans</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainings Actual</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {managementReviewData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(item.month_year)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.new_operators_joined}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.new_operators_trained}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_training_plans}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_trainings_actual}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(item.id!)}
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
        )}
      </div>
    </div>
  );
};

export default DigitalSettings;