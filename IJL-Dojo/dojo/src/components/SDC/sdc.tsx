import { useEffect, useState } from 'react';
import axios from 'axios';

interface Feedback {
  id: number;
  user: number;
  temp_id: string;
  date_of_training: string;
  department: string;
  trainer_name: string;
  not_understood: string;
  good: string;
  very_good: string;
  better: string;
  best: string;
  suggestion: string | null;
  trainee_signature?: string;
  training_incharge_signature?: string;
}

interface Department {
  value: string;
  label: string;
}

type FeedbackFormData = Omit<Feedback, 'id'>;

const SDC = () => {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(''); // Track the selected employee name
  const [formData, setFormData] = useState<FeedbackFormData>({
    user: 0,
    temp_id: '',
    date_of_training: '',
    department: '',
    trainer_name: '',
    not_understood: 'nil',
    good: 'nil',
    very_good: 'nil',
    better: 'nil',
    best: 'nil',
    suggestion: null,
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAvailableDepartments(selectedEmployee);
      // Use the orientation_feedbacks from the selected employee data
      setFeedbackData(selectedEmployee.orientation_feedbacks || []);
    }
  }, [selectedEmployee]);

  const fetchAllTrainees = async (searchQuery: string = '') => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/passed-users/', {
        params: { name: searchQuery }
      });
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching trainees:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchAvailableDepartments = async (employeeData: any) => {
    setLoadingDepartments(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/remaining-departments/`,
        {
          params: { temp_id: employeeData.temp_id }
        }
      );
      
      const departmentOptions = response.data.remaining_departments?.map((dept: string) => ({
        value: dept,
        label: dept
      })) || [];
      
      setDepartments(departmentOptions);
    } catch (error) {
      console.error('Error fetching available departments:', error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: keyof FeedbackFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] === 'yes' ? 'nil' : 'yes'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date_of_training) {
      alert("Please select a Date of Training.");
      return;
    }

    if (!formData.department) {
      alert("Please select a Department.");
      return;
    }

    if (!formData.trainer_name.trim()) {
      alert("Please enter the Trainer Name.");
      return;
    }

    const feedbackOptions = [
      formData.not_understood,
      formData.good,
      formData.very_good,
      formData.better,
      formData.best,
    ];

    const atLeastOneSelected = feedbackOptions.some(option => option === 'yes');
    if (!atLeastOneSelected) {
      alert("Please select at least one feedback option (e.g., Good, Very Good, etc.).");
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/sdc-orientation-feedback/', formData);

      if (selectedEmployee) {
        // Add the new feedback to the existing feedbackData
        const newFeedback = response.data;
        setFeedbackData(prev => [...prev, newFeedback]);
        
        // Refresh available departments
        await fetchAvailableDepartments(selectedEmployee);
      }

      setFormData(prev => ({
        ...prev,
        date_of_training: '',
        department: '',
        trainer_name: '',
        not_understood: 'nil',
        good: 'nil',
        very_good: 'nil',
        better: 'nil',
        best: 'nil',
        suggestion: null,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting feedback:', error.message);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Don't search if an employee is already selected and the search term matches
      if (selectedEmployee && searchTerm === selectedEmployeeName) {
        return;
      }
      fetchAllTrainees(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedEmployee, selectedEmployeeName]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    
    // If user modifies the search term after selecting an employee, clear the selection
    if (selectedEmployee && newValue !== selectedEmployeeName) {
      handleNewSearch();
    }
    
    if (newValue === '') {
      setShowResults(false);
    }
  };

  const handleTraineeSelect = (trainee: any) => {
    const fullName = `${trainee.first_name} ${trainee.last_name}`;
    
    // Update states immediately
    setSearchTerm(fullName);
    setSelectedEmployeeName(fullName);
    setSelectedEmployee(trainee);
    
    // Immediately close the search results
    setShowResults(false);
    setSearchResults([]);
    setIsSearching(false);
    
    setFormData({
      user: trainee.id,
      temp_id: trainee.temp_id,
      date_of_training: '',
      department: '',
      trainer_name: '',
      not_understood: 'nil',
      good: 'nil',
      very_good: 'nil',
      better: 'nil',
      best: 'nil',
      suggestion: null,
    });
  };

  const handleNewSearch = () => {
    setSelectedEmployee(null);
    setSelectedEmployeeName(''); // Clear the selected employee name
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
    setFeedbackData([]);
    setDepartments([]);
    setFormData({
      user: 0,
      temp_id: '',
      date_of_training: '',
      department: '',
      trainer_name: '',
      not_understood: 'nil',
      good: 'nil',
      very_good: 'nil',
      better: 'nil',
      best: 'nil',
      suggestion: null,
    });
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">SDC Orientation Feedback System</h1>
      
      {/* Search Section */}
      <div className="mb-6 relative">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="trainee-search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Employee
            </label>
            <input
              type="text"
              id="trainee-search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Type employee name..."
              className="w-full p-2 border border-gray-300 rounded"
            />
            {isSearching && (
              <div className="absolute right-2 top-8 text-gray-500">
                <span className="text-sm">Searching...</span>
              </div>
            )}
          </div>
          {selectedEmployee && (
            <button
              onClick={handleNewSearch}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6"
            >
              Clear Search
            </button>
          )}
        </div>
        
        {showResults && searchResults.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((trainee, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleTraineeSelect(trainee)}
              >
                {trainee.first_name} {trainee.last_name} ({trainee.temp_id}) - {trainee.email}
              </li>
            ))}
          </ul>
        )}
        
        {showResults && searchResults.length === 0 && searchTerm.trim() !== '' && !isSearching && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2">
            <div className="text-gray-500 text-center">No employees found</div>
          </div>
        )}
      </div>

      {selectedEmployee && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th colSpan={10} className="border border-black bg-gray-100 p-2 text-center font-bold text-lg">
                  SDC Orientation Feedback Summary
                </th>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-32">Name :</th>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-32">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </th>
                <th colSpan={5} className="border border-black bg-gray-50 p-2 text-sm font-medium w-32"></th>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-32">Temp ID :</th>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-32">
                  {selectedEmployee.temp_id}
                </th>
               
              </tr>
              <tr>
                <th rowSpan={2} className="border border-black bg-gray-50 p-2 text-sm font-medium w-32">
                  <div>Date of Training</div>
                  <div className="text-xs">प्रशिक्षण की तारीख</div>
                </th>
                <th rowSpan={2} className="border border-black bg-gray-50 p-2 text-sm font-medium w-32">
                  <div>Department</div>
                  <div className="text-xs">विभाग/Section</div>
                </th>
                <th rowSpan={2} className="border border-black bg-gray-50 p-2 text-sm font-medium w-32">
                  <div>Trainer</div>
                  <div className="text-xs">प्रशिक्षण देने वाला</div>
                </th>
                <th colSpan={6} className="border border-black bg-gray-50 p-2 text-sm font-medium">
                  Remark
                </th>
              </tr>
              <tr>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-20">
                  <div>Not</div><div>Understood</div>
                  <div className="text-xs">नहीं समझा</div>
                </th>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-20">
                  <div>Good</div>
                  <div className="text-xs">अच्छा</div>
                </th>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-20">
                  <div>Very Good</div>
                  <div className="text-xs">बहुत अच्छा</div>
                </th>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-20">
                  <div>Better</div>
                  <div className="text-xs">बेहतर</div>
                </th>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium w-20">
                  <div>Best</div>
                  <div className="text-xs">सर्वोत्तम</div>
                </th>
                <th className="border border-black bg-gray-50 p-2 text-sm font-medium">
                  <div>Suggestion (if any)</div>
                  <div className="text-xs">सुझाव</div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border border-black p-2 text-center">
                  <input
                    type="date"
                    name="date_of_training"
                    value={formData.date_of_training}
                    onChange={handleInputChange}
                    className="w-full p-1 border border-gray-300 rounded"
                    required
                  />
                </td>
                <td className="border border-black p-2 text-center">
                  {loadingDepartments ? (
                    <div>Loading departments...</div>
                  ) : (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded"
                      required
                      disabled={departments.length === 0}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="border border-black p-2 text-center">
                  <input
                    type="text"
                    name="trainer_name"
                    value={formData.trainer_name}
                    onChange={handleInputChange}
                    className="w-full p-1 border border-gray-300 rounded"
                    required
                  />
                </td>
                <td className="border border-black p-2 text-center">
                  <input
                    type="checkbox"
                    checked={formData.not_understood === 'yes'}
                    onChange={() => handleCheckboxChange('not_understood')}
                  />
                </td>
                <td className="border border-black p-2 text-center">
                  <input
                    type="checkbox"
                    checked={formData.good === 'yes'}
                    onChange={() => handleCheckboxChange('good')}
                  />
                </td>
                <td className="border border-black p-2 text-center">
                  <input
                    type="checkbox"
                    checked={formData.very_good === 'yes'}
                    onChange={() => handleCheckboxChange('very_good')}
                  />
                </td>
                <td className="border border-black p-2 text-center">
                  <input
                    type="checkbox"
                    checked={formData.better === 'yes'}
                    onChange={() => handleCheckboxChange('better')}
                  />
                </td>
                <td className="border border-black p-2 text-center">
                  <input
                    type="checkbox"
                    checked={formData.best === 'yes'}
                    onChange={() => handleCheckboxChange('best')}
                  />
                </td>
                <td className="border border-black p-2 text-center">
                  <input
                    type="text"
                    name="suggestion"
                    value={formData.suggestion || ''}
                    onChange={handleInputChange}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>

              {feedbackData.map((item) => (
                <tr key={item.id}>
                  <td className="border border-black p-2 text-center">{item.date_of_training}</td>
                  <td className="border border-black p-2 text-center">{item.department}</td>
                  <td className="border border-black p-2 text-center">{item.trainer_name}</td>
                  <td className="border border-black p-2 text-center">
                    {item.not_understood === 'yes' ? '✓' : ''}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.good === 'yes' ? '✓' : ''}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.very_good === 'yes' ? '✓' : ''}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.better === 'yes' ? '✓' : ''}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.best === 'yes' ? '✓' : ''}
                  </td>
                  <td className="border border-black p-2 text-center">{item.suggestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SDC;