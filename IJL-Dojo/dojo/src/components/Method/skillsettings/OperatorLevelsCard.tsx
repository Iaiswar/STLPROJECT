import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

const SKILL_LEVELS = [1, 2, 3, 4];

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

interface Operation {
  id: number;
  name: string;
  number: number;
  matrix: number | null;  // Make explicit if it can be null
  section?: number | null; // Make explicit if it can be null
  minimum_skill_required: number;
}

interface Operator {
  id: number;
  full_name: string;
  employee_id?: string;
}

const OperatorLevelsComponent = () => {
  const [skillMatrices, setSkillMatrices] = useState<SkillMatrix[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedMatrix, setSelectedMatrix] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('1');
  const [remarks, setRemarks] = useState<string>('');

  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Filter operations based on selected matrix and section
const filteredOperations = operations.filter((op: Operation) => {
  // Handle matrix comparison
  let matrixMatch = true;
  if (selectedMatrix) {
    matrixMatch = op.matrix != null && op.matrix.toString() === selectedMatrix;
  }

  // Handle section comparison
  let sectionMatch = true;
  if (selectedSection) {
    sectionMatch = 
      (op.section != null && op.section.toString() === selectedSection) ||
      (op.section == null && selectedSection === '');
  }

  return matrixMatch && sectionMatch;
});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          skillMatricesResponse,
          sectionsResponse,
          operationsResponse,
          operatorsResponse
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/skill-matrix/`),
          fetch(`${API_BASE_URL}/sections/`),
          fetch(`${API_BASE_URL}/operationlist/`),
          fetch(`${API_BASE_URL}/operators/`)
        ]);

        if (!skillMatricesResponse.ok || !sectionsResponse.ok ||
          !operationsResponse.ok || !operatorsResponse.ok) {
          throw new Error('Failed to fetch data from one or more endpoints');
        }

        const [
          skillMatricesData,
          sectionsData,
          operationsData,
          operatorsData
        ] = await Promise.all([
          skillMatricesResponse.json(),
          sectionsResponse.json(),
          operationsResponse.json(),
          operatorsResponse.json()
        ]);

        // In your fetchData function, modify the data extraction:
        const skillMatricesArray = Array.isArray(skillMatricesData)
          ? skillMatricesData
          : (skillMatricesData?.results || []);
        const sectionsArray = Array.isArray(sectionsData)
          ? sectionsData
          : (sectionsData?.results || []);
        const operationsArray = Array.isArray(operationsData)
          ? operationsData
          : (operationsData?.results || []);
        const operatorsArray = Array.isArray(operatorsData)
          ? operatorsData
          : (operatorsData?.results || []);

        // Console log the fetched data
        // console.log('Skill Matrices:', skillMatricesArray);
        // console.log('Sections:', sectionsArray);
        // console.log('Operations:', operationsArray);
        // console.log('Operators:', operatorsArray);

        setSkillMatrices(skillMatricesArray);
        setSections(sectionsArray);
        setOperations(operationsArray);
        setOperators(operatorsArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedMatrix || !selectedEmployee || !selectedLevel) {
      setError('Please select a skill matrix, an employee, and a skill level');
      return;
    }

    // Remove this validation since operation is optional
    // if (!selectedSection && !selectedOperation) {
    //   setError('Please select at least one of section or operation');
    //   return;
    // }

    setIsSubmitting(true);
    setError(null);

    try {
      const operatorLevelData = {
        operation: selectedOperation ? parseInt(selectedOperation) : null,
        employee: parseInt(selectedEmployee),
        level: parseInt(selectedLevel),
        skill_matrix: parseInt(selectedMatrix),
        remarks: remarks
      };

      // Remove null fields from the payload
      const payload = Object.fromEntries(
        Object.entries(operatorLevelData).filter(([_, v]) => v !== null)
      );

      const response = await fetch(`${API_BASE_URL}/operator-levels/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save operator level');
      }
      setSuccess(true);

      // Reset form
      setSelectedMatrix('');
      setSelectedSection('');
      setSelectedOperation('');
      setSelectedEmployee('');
      setSelectedLevel('1');
      setRemarks('');

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin mr-2" size={20} />
          <span>Loading operator levels...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Operator Levels Management</h2>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="mr-1" size={14} />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
              Operator Level saved successfully!
            </div>
          )}

          <div className="space-y-6">
            {/* Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Operator Level</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Skill Matrix Department *
                  </label>
                  <select
                    value={selectedMatrix}
                    onChange={(e) => {
                      setSelectedMatrix(e.target.value);
                      setSelectedSection('');
                      setSelectedOperation('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {skillMatrices.map(matrix => (
                      <option key={matrix.id} value={matrix.id}>
                        {matrix.department} ({matrix.doc_no})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Section (Optional)
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    disabled={!selectedMatrix}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Operation (Optional)
                  </label>
                  <select
                    value={selectedOperation}
                    onChange={(e) => setSelectedOperation(e.target.value)}
                    disabled={!selectedMatrix}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Operation</option>
                    {filteredOperations.map(op => (
                      <option key={op.id} value={op.id}>
                        {op.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Employee *
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Employee</option>
                    {operators.map(operator => (
                      <option key={operator.id} value={operator.id}>
                        {operator.full_name} {operator.employee_id && `(${operator.employee_id})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Skill Level *
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SKILL_LEVELS.map(level => (
                      <option key={level} value={level}>Level {level}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes or comments"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2" size={16} />
                {isSubmitting ? 'Saving...' : 'Save Operator Level'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorLevelsComponent; 