import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Operator {
  id: number;
  name: string;
}

interface TrainingSkill {
  id: number;
  training_name: string;
  video: string | null;
  pdf_attachment: string | null;
}

const OperatorTrainingAssignmentForm: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [trainingSkills, setTrainingSkills] = useState<TrainingSkill[]>([]);

  const [selectedOperator, setSelectedOperator] = useState<number | null>(null);
  const [selectedTrainings, setSelectedTrainings] = useState<number[]>([]);

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch operators
    axios.get('http://127.0.0.1:8000/master_list/')
      .then(res => setOperators(res.data))
      .catch(err => console.error('Failed to fetch operators:', err));

    // Fetch training skills
    axios.get('http://127.0.0.1:8000/training-skills/')
      .then(res => setTrainingSkills(res.data))
      .catch(err => console.error('Failed to fetch training skills:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOperator && selectedTrainings.length > 0) {
      try {
        await axios.post('http://127.0.0.1:8000/assignments/', {
          operator: selectedOperator,
          trainings: selectedTrainings, // ✅ as array
        });
        setMessage("Trainings assigned successfully!");
        setSelectedOperator(null);
        setSelectedTrainings([]);
      } catch (err) {
        console.error(err);
        setMessage("Error assigning trainings.");
      }
    } else {
      setMessage("Please select both operator and at least one training.");
    }
  };

  const handleTrainingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
    setSelectedTrainings(selectedOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded shadow-md bg-white max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Assign Training to Operator</h2>

      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Operator</label>
        <select
          className="border px-3 py-2 rounded w-full"
          value={selectedOperator ?? ''}
          onChange={(e) => setSelectedOperator(Number(e.target.value))}
        >
          <option value="">-- Select Operator --</option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Trainings</label>
        <select
          multiple
          className="border px-3 py-2 rounded w-full h-40"
          value={selectedTrainings.map(String)}
          onChange={handleTrainingChange}
        >
          {trainingSkills.map((training) => (
            <option key={training.id} value={training.id}>
              {training.training_name}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">Hold Ctrl (Windows) or Command (Mac) to select multiple.</p>
      </div>

      <button
        type="submit"
        className="bg-green-600  text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Assign
      </button>
    </form>
  );
};

export default OperatorTrainingAssignmentForm;
