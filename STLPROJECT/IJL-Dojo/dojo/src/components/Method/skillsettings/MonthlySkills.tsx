import { useForm } from 'react-hook-form';
import axios, { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface OperatorLevel {
  id: number;
  level: number;
  employee_name: string;
}

interface FormData {
  operator_level: string;
  month: string;
  year: string;
  content: string;
}

export function MonthlySkillEvaluationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [operatorLevels, setOperatorLevels] = useState<OperatorLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Fetch operator levels from API
  useEffect(() => {
    const fetchOperatorLevels = async () => {
      setIsLoading(true);
      console.log('📡 Fetching operator levels...');

      try {
        const response = await axios.get('http://127.0.0.1:8000/operator-levels/');
        console.log('✅ API response:', response.data);
        setOperatorLevels(response.data);
      } catch (error) {
        console.error('❌ Error fetching operator levels:', error);
      } finally {
        setIsLoading(false);
        console.log('🔁 Loading state set to false');
      }
    };

    fetchOperatorLevels();
  }, []);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    name: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  // Generate years from current year - 10 to current year + 10
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => (currentYear - 10 + i).toString());

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await axios.post('http://127.0.0.1:8000/monthly-evaluations/', {
        operator_level: parseInt(data.operator_level),
        month: parseInt(data.month),
        year: parseInt(data.year),
        content: data.content,
      });

      if (response.status === 201) {
        setSubmitSuccess(true);
        reset();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setSubmitError(
          error.response?.data?.message || 'Failed to submit evaluation. Please try again.'
        );
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Monthly Skill Evaluation</h2>

      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          Evaluation submitted successfully!
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="operator_level" className="block text-sm font-medium text-gray-700">
              Operator Level
            </label>
            <select
              id="operator_level"
              {...register('operator_level', { required: 'Operator level is required' })}
              disabled={isLoading}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.operator_level ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            >
              <option value="">Select Operator Level</option>
              {operatorLevels.map((level: OperatorLevel) => (
                <option key={level.id} value={level.id}>
                  Level {level.level} ({level.employee_name})
                </option>
              ))}
            </select>
            {errors.operator_level && (
              <p className="mt-1 text-sm text-red-600">{errors.operator_level.message}</p>
            )}
            {isLoading && (
              <p className="mt-1 text-sm text-gray-500">Loading operator levels...</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                id="month"
                {...register('month', { required: 'Month is required' })}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.month ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="mt-1 text-sm text-red-600">{errors.month.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                id="year"
                {...register('year', { required: 'Year is required' })}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.year ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Evaluation Content
          </label>
          <textarea
            id="content"
            rows={4}
            {...register('content', { required: 'Content is required' })}
            className={`mt-1 block w-full border ${errors.content ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting || isLoading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
}