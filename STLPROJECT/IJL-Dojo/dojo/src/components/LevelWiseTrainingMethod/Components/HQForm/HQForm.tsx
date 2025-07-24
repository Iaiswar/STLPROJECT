import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface HQ {
  id: number;
  name: string;
}

const HQForm: React.FC = () => {
  const [formData, setFormData] = useState({ id: '', name: '' });
  const [hqs, setHQs] = useState<HQ[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null); // to maintain scroll position

  useEffect(() => {
    fetchHQs();
  }, []);

  const fetchHQs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/hq/');
      setHQs(response.data);
      if (response.data.length > 0) handleEdit(response.data[0]);
    } catch (error) {
      console.error('Error fetching HQs:', error);
      setErrorMessage('Failed to fetch HQs. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const scrollY = window.scrollY; // store current scroll position
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:8000/hq/${formData.id}/`, { name: formData.name });
        setSuccessMessage('HQ updated successfully!');
      } else {
        if (hqs.length > 0) throw new Error('Only one HQ can exist. Please edit the existing HQ instead.');
        await axios.post('http://127.0.0.1:8000/hq/', { name: formData.name });
        setSuccessMessage('HQ created successfully!');
      }
      await fetchHQs();
      resetForm();
      setTimeout(() => window.scrollTo({ top: scrollY }), 0); // restore scroll after render
    } catch (error: any) {
      console.error('Error saving HQ:', error);
      setErrorMessage(error.message || `Failed to ${isEditing ? 'update' : 'create'} HQ. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ id: '', name: '' });
    setIsEditing(false);
  };

  const handleEdit = (hq: HQ) => {
    setFormData({ id: hq.id.toString(), name: hq.name });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this HQ?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/hq/${id}/`);
        setHQs([]);
        setSuccessMessage('HQ deleted successfully!');
        resetForm();
      } catch (error) {
        console.error('Error deleting HQ:', error);
        setErrorMessage('Failed to delete HQ. Please try again.');
      }
    }
  };

  return (
    <div ref={scrollRef} className="max-w-[1440px] mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {hqs.length > 0 ? 'Edit HQ' : 'Create HQ'}
      </h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {(hqs.length === 0 || isEditing) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HQ Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter HQ name"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditing ? 'Update HQ' : 'Create HQ'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Current HQ</h3>
        {hqs.length > 0 ? (
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-800">{hqs[0].name}</h4>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(hqs[0])}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hqs[0].id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No HQ created yet</p>
        )}
      </div>
    </div>
  );
};

export default HQForm;
