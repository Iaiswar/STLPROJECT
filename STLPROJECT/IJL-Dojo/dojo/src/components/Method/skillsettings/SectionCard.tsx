import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';

interface Department {
  id: number;
  department: string;
  updated_on: string;
  next_review: string;
  doc_no: string;
  prepared_by?: string;
  uploaded_by?: string;
}

interface Section {
  id?: number;
  name: string;
  department?: number;
}

interface SectionCardProps {
  onSuccess?: () => void;
}

const SectionCard = ({ onSuccess }: SectionCardProps) => {
  const [formData, setFormData] = useState<Section>({
    name: '',
    department: undefined
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepartments(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/skill-matrix/');
        setDepartments(response.data.results || response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments');
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'department' ? (value ? parseInt(value) : undefined) : value 
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Section name is required');
      return;
    }

    if (!formData.department) {
      setError('Department is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await axios.post('http://127.0.0.1:8000/sections/', formData);
      
      setSuccess(true);
      setFormData({ name: '', department: undefined }); // Reset form
      onSuccess?.();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error creating section:', err);
      
      if (err.response?.data?.name) {
        setError(`Name: ${err.response.data.name[0]}`);
      } else if (err.response?.data?.department) {
        setError(`Department: ${err.response.data.department[0]}`);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to create section. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
          Create New Section
        </h2>
      
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoadingDepartments}
            >
              <option value="">
                {isLoadingDepartments ? 'Loading departments...' : 'Select a department'}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.department}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Section Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter section name (max 100 characters)"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.name.length}/100 characters
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingDepartments}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="mr-2" size={16} />
              {isSubmitting ? 'Creating...' : 'Create Section'}
            </button>
          </div>
          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
              Section created successfully!
            </div>
          )}
      
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SectionCard;