import { 
  SkillMatrix, 
  Operation, 
  Section, 
  MonthlySkill 
} from './types';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Generic API call
const apiCall = async <T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<T> => {
  const fullUrl = `${API_BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    throw error;
  }
};

// Fetch all skill matrices (using new API endpoint)
export const fetchSkillMatrices = async (): Promise<SkillMatrix[]> => {
  return apiCall<SkillMatrix[]>('/skill-matrix/');
};

// Fetch skill matrix data with employees and their skill levels
export const fetchSkillMatrixData = async (department?: string): Promise<any> => {
  const endpoint = department ? `/api/skill-matrix/${department}/` : '/api/skill-matrix/';
  return apiCall<any>(endpoint);
};

// Original function remains the same
export const fetchOperations = async (): Promise<Operation[]> => {
  return apiCall<Operation[]>('/operationlist/');
};

// When calling the function
fetchOperations().then(operations => {
  console.log('Fetched operations:', operations);
}).catch(error => {
  console.error('Error fetching operations:', error);
});

// Fetch all sections
export const fetchSections = async (): Promise<Section[]> => {
  return apiCall<Section[]>('/sections/');
};

// Fetch all multiskilling records (with log)
export const fetchMonthlySkill = async (): Promise<MonthlySkill[]> => {
  console.log('📡 Fetching Monthly skills...');
  const data = await apiCall<MonthlySkill[]>('/monthly-skills/');
  console.log('✅ Data received from /monthly-skills/:', data);
  return data;
};