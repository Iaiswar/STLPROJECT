import { useState, useEffect } from 'react';

interface Skill {
  skill: string;
  skill_level: string;
  start_date: string;
  end_date: string;
  remarks: string;
  status: string;
}

interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
  date_of_join: string;
  employee_pattern_category: string;
  designation: string;
  department: string | null;
  department_code: string | null;
  skills: Skill[];
}

interface Department {
  id: number;
  department: string;
}

interface Section {
  id: number;
  name: string;
  department: number;
}

interface Operation {
  id: number;
  name: string;
  department: number;
  section: number | null;
  number?: number;
  minimum_skill_required?: number;
}

interface SkillLevel {
  id: number;
  name: string;
  name_display: string;
}

interface AddSkillProps {
  employeeID: number;
  employee: Employee;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

  const AddSkill = ({ employeeID }: AddSkillProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    departmentId: null as number | null,
    sectionId: null as number | null,
    operationId: null as number | null,
    skillLevel: '',
    date: '',
    remarks: ''
  });

  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get available sections for selected department
  const availableSections = sections.filter(s => s.department === formData.departmentId);

  // Fetch data when form is shown
useEffect(() => {
  if (!showForm) return;

  const fetchData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [levelsRes, hierarchyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/levels/`),
        fetch(`${API_BASE_URL}/department-hierarchy/`)
      ]);

      if (!levelsRes.ok || !hierarchyRes.ok) {
        throw new Error('Failed to fetch required data');
      }

      const [levels, hierarchy] = await Promise.all([
        levelsRes.json(),
        hierarchyRes.json()
      ]);

      console.log("🟡 Raw Levels Response:", levels);
      console.log("🟡 Raw Hierarchy Response:", hierarchy);

      // Transform departments
      const depts = hierarchy.map((dept: any) => ({
        id: dept.id,
        department: dept.department
      }));
      console.log("✅ Transformed Departments:", depts);

      // Transform sections
      const secs = hierarchy.flatMap((dept: any) =>
        dept.sections?.map((sec: any) => ({
          id: sec.id,
          name: sec.name,
          department: dept.id
        })) || []
      );
      console.log("✅ Transformed Sections:", secs);

      // Transform operations
      const ops = hierarchy.flatMap((dept: any) => {
        const opsWithSection = dept.sections?.flatMap((sec: any) =>
          sec.operations.map((op: any) => ({
            id: op.id,
            name: op.name,
            department: dept.id,
            section: sec.id,
            number: op.number,
            minimum_skill_required: op.minimum_skill_required
          }))
        ) || [];

        const opsWithoutSection = dept.operations_without_section?.map((op: any) => ({
          id: op.id,
          name: op.name,
          department: dept.id,
          section: null,
          number: op.number,
          minimum_skill_required: op.minimum_skill_required
        })) || [];

        return [...opsWithSection, ...opsWithoutSection];
      });

      console.log("✅ Transformed Operations:", ops);

      // Final state update
      setDepartments(depts);
      setSections(secs);
      setOperations(ops);
      setSkillLevels(levels);

    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [showForm]);


  // Filter operations when department or section changes
  useEffect(() => {
    if (!formData.departmentId) {
      setFilteredOperations([]);
      return;
    }

    const filtered = operations.filter(op => {
      if (op.department !== formData.departmentId) return false;
      
      if (formData.sectionId) {
        return op.section === formData.sectionId;
      }
      
      return op.section === null;
    });

    setFilteredOperations(filtered);
  }, [formData.departmentId, formData.sectionId, operations]);

  // Handle form field changes
  const handleChange = (field: string, value: string | number | null) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Reset dependent fields
      if (field === 'departmentId') {
        newData.sectionId = null;
        newData.operationId = null;
      } else if (field === 'sectionId') {
        newData.operationId = null;
      }

      return newData;
    });
  };

  // Handle form submission
  const handleSave = async () => {
    const { departmentId, operationId, skillLevel, date } = formData;

    if (!departmentId || !operationId || !skillLevel || !date) {
      setError('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/multiskilling/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee: employeeID,
          skill_level: skillLevel,
          date,
          remarks: formData.remarks,
          status: 'scheduled',
          department: departmentId,
          section: formData.sectionId,
          operation: operationId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save skill');
      }

      setSuccess('Skill added successfully!');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      departmentId: null,
      sectionId: null,
      operationId: null,
      skillLevel: '',
      date: '',
      remarks: ''
    });
    setShowForm(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
      {!showForm ? (
        <div className="p-8 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Add a New Skill?</h3>
            <p className="text-gray-600 mb-6">Expand your employee's capabilities with new skill allocations</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Skill
          </button>
        </div>
      ) : (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Skill Allocation Form</h3>
            </div>
            <p className="text-gray-600 mt-2 ml-10">Fill in the details to assign a new skill</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p>{success}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Department Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Department *
                </label>
                <select
                  value={formData.departmentId || ''}
                  onChange={(e) => handleChange('departmentId', e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium"
                  required
                >
                  <option value="">Select department...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Selection (only show if sections exist for selected department) */}
              {formData.departmentId && availableSections.length > 0 && (
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Section
                  </label>
                  <select
                    value={formData.sectionId || ''}
                    onChange={(e) => handleChange('sectionId', e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-300 font-medium"
                  >
                    <option value="">Select section...</option>
                    {availableSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Operation Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Operation *
                </label>
                <select
                  value={formData.operationId || ''}
                  onChange={(e) => handleChange('operationId', e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 font-medium"
                  required
                >
                  <option value="">Select operation...</option>
                  {filteredOperations.map((operation) => (
                    <option key={operation.id} value={operation.id}>
                      {operation.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skill Level Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Skill Level *
                </label>
                <select
                  value={formData.skillLevel}
                  onChange={(e) => handleChange('skillLevel', e.target.value)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-300 font-medium"
                  required
                >
                  <option value="">Select skill level...</option>
                  {skillLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name_display}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-300 focus:border-red-500 transition-all duration-300 font-medium"
                  required
                />
              </div>

              {/* remarks */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Remarks (optional)
                </label>
                <textarea
                  placeholder="Add any additional remarks, requirements, or special instructions..."
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium resize-none"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Allocation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddSkill;