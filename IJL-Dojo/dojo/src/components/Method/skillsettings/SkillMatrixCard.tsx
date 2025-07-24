import { useState, useEffect } from 'react';
import { Save, Edit } from 'lucide-react';
import axios from 'axios';

interface SkillMatrix {
  id?: number;
  department: string;
  updated_on: string;
  next_review: string;
  doc_no: string;
  prepared_by: string;
  uploaded_by: string;
}

interface SkillMatrixCardProps {
  existingMatrix?: SkillMatrix;
  onSuccess?: () => void;
}

const SkillMatrixCard = ({ existingMatrix, onSuccess }: SkillMatrixCardProps) => {
  const [departments, setDepartments] = useState<SkillMatrix[]>([]);
  const [formData, setFormData] = useState<SkillMatrix>({
    department: '',
    updated_on: new Date().toISOString().split('T')[0],
    next_review: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    doc_no: '',
    prepared_by: '',
    uploaded_by: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/skill-matrix/');
        // console.log('Full API Response:', response.data);
        
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (existingMatrix) {
      setFormData({
        ...existingMatrix,
        updated_on: existingMatrix.updated_on.split('T')[0],
        next_review: existingMatrix.next_review.split('T')[0]
      });
    }
  }, [existingMatrix]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleDepartmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    if (!selectedId) return;
    
    const selectedMatrix = departments.find(d => d.id === selectedId);
    if (selectedMatrix) {
      setFormData({
        ...selectedMatrix,
        updated_on: selectedMatrix.updated_on.split('T')[0],
        next_review: selectedMatrix.next_review.split('T')[0]
      });
    }
  };

  const handleSubmit = async (isUpdate: boolean) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isUpdate && formData.id) {
        await axios.put(`http://127.0.0.1:8000/update-skillmatrix/${formData.id}/`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/skill-matrix/', formData);
      }
      
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to save skill matrix. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
          {existingMatrix ? 'Edit Skill Matrix' : 'Create New Skill Matrix'}
        </h2>
      
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department fields in same row */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Enter New Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new department name"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Existing Department
              </label>
              <select
                onChange={handleDepartmentSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Document Number</label>
              <input
                type="text"
                name="doc_no"
                value={formData.doc_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Updated On</label>
              <input
                type="date"
                name="updated_on"
                value={formData.updated_on}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Next Review</label>
              <input
                type="date"
                name="next_review"
                value={formData.next_review}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Prepared By</label>
              <input
                type="text"
                name="prepared_by"
                value={formData.prepared_by}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Uploaded By</label>
              <input
                type="text"
                name="uploaded_by"
                value={formData.uploaded_by}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2" size={16} />
              {isSubmitting ? 'Saving...' : 'Save New'}
            </button>
      
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting || !formData.id}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit className="mr-2" size={16} />
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
              Skill Matrix {formData.id ? 'updated' : 'created'} successfully!
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

export default SkillMatrixCard;