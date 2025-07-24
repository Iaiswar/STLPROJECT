import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const SKILL_LEVELS = [1, 2, 3, 4];

interface OperationFormData {
  matrix: string;
  section?: string;
  number: string;
  name: string;
  minimum_skill_required: string;
}

interface SkillMatrix {
  id: number;
  department: string;
  doc_no: string;
  next_review: string;
  prepared_by: string;
  updated_on: string;
  uploaded_by: string;
}

interface Section {
  id: number;
  name: string;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

const OperationCard = () => {
  const [formData, setFormData] = useState<OperationFormData>({
    matrix: '',
    section: '',
    number: '',
    name: '',
    minimum_skill_required: ''
  });
  const [skillMatrices, setSkillMatrices] = useState<SkillMatrix[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  // Fetch skill matrices and sections
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch skill matrices - using the correct endpoint
        const matricesResponse = await fetch('http://127.0.0.1:8000/skill-matrix/');
        const matricesData = await matricesResponse.json();
        // Fetch sections
        const sectionsResponse = await fetch('http://127.0.0.1:8000/sections/');
        const sectionsData = await sectionsResponse.json();
        // Handle skill matrices data - the API returns array directly
        if (Array.isArray(matricesData)) {
          setSkillMatrices(matricesData);
        } else if (matricesData.results) {
          setSkillMatrices(matricesData.results);
        } else {
          console.error('Unexpected skill matrices data format:', matricesData);
          setSkillMatrices([]);
        }

        // Handle sections data - the API returns array directly
        if (Array.isArray(sectionsData)) {
          setSections(sectionsData);
        } else if (sectionsData.results) {
          setSections(sectionsData.results);
        } else {
          console.error('Unexpected sections data format:', sectionsData);
          setSections([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ type: 'error', text: 'Failed to load required data. Please check your API endpoints.' });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof OperationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    if (!formData.matrix) {
      setMessage({ type: 'error', text: 'Skill Matrix is required' });
      return false;
    }
    if (!formData.number) {
      setMessage({ type: 'error', text: 'Operation number is required' });
      return false;
    }
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Operation name is required' });
      return false;
    }
    if (!formData.minimum_skill_required) {
      setMessage({ type: 'error', text: 'Minimum skill level is required' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        matrix: parseInt(formData.matrix),
        section: formData.section ? parseInt(formData.section) : null,
        number: parseInt(formData.number),
        name: formData.name.trim(),
        minimum_skill_required: parseInt(formData.minimum_skill_required)
      };

      const response = await fetch('http://127.0.0.1:8000/operationlist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Operation created successfully!' });
        setFormData({
          matrix: '',
          section: '',
          number: '',
          name: '',
          minimum_skill_required: ''
        });
      } else {
        const errorData = await response.json();
        let errorMessage = 'Failed to create operation';
        
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'object') {
          const errors = Object.values(errorData).flat();
          errorMessage = errors.join(', ');
        }
        
        setMessage({
          type: 'error',
          text: errorMessage
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred. Please check your connection.' });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"> */}
          <h2 className="text-xl font-semibold text-gray-800 py-6 px-6 border-b">
            Create Operation
          </h2>
          {/* <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
            Create Operation
          </h2> */}
        {/* </div> */}
        <div className="p-6">
          <div className="space-y-6">
            {/* First Row - Matrix and Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="matrix" className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Matrix *
                </label>
                <select
                  id="matrix"
                  value={formData.matrix}
                  onChange={(e) => handleInputChange('matrix', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  required
                >
                  <option value="">{isLoading ? 'Loading...' : 'Select Skill Matrix'}</option>
                  {skillMatrices.map((matrix) => (
                    <option key={matrix.id} value={matrix.id.toString()}>
                      {matrix.department} ({matrix.doc_no})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                  Section (Optional)
                </label>
                <select
                  id="section"
                  value={formData.section}
                  onChange={(e) => handleInputChange('section', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  <option value="">{isLoading ? 'Loading...' : 'Select Section'}</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id.toString()}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row - Number and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                  Operation Number *
                </label>
                <input
                  id="number"
                  type="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="Enter operation number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Operation Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter operation name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Third Row - Minimum Skill Required */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="minimum_skill_required" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Skill Level Required *
                </label>
                <select
                  id="minimum_skill_required"
                  value={formData.minimum_skill_required}
                  onChange={(e) => handleInputChange('minimum_skill_required', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select skill level</option>
                  {SKILL_LEVELS.map((level) => (
                    <option key={level} value={level.toString()}>
                      Level {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-500">
                  <p className="mb-1">Skill Levels:</p>
                  <ul className="text-xs space-y-1">
                    <li>Level 1: Beginner</li>
                    <li>Level 2: Intermediate</li>
                    <li>Level 3: Advanced</li>
                    <li>Level 4: Expert</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Debug Information (Remove in production) */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 p-4 rounded-md text-sm">
                <p className="font-semibold mb-2">Debug Info:</p>
                <p>Skill Matrices Count: {skillMatrices.length}</p>
                <p>Sections Count: {sections.length}</p>
                <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
              </div>
            )} */}

            {/* Message Display */}
            {message.text && (
              <div className={`p-4 rounded-md transition-all duration-300 ${message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${message.type === 'success' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  {message.text}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isLoading}
                className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save className="mr-2" size={16} />
                {isSubmitting ? 'Creating...' : 'Create Operation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationCard;