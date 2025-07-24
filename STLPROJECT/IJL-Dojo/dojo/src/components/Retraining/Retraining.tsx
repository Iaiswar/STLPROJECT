import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Operator {
  id: number;
  name: string;
  empid: string;
}

interface Trainer {
  id: number;
  name: string;
  line_no: string;
}

interface Observation {
  id?: number;
  serial_no: number;
  failure_point: string;
  retraining_date: string;
  confirm_1: string;
  confirm_2: string;
  confirm_3: string;
  trainee_sign: string;
  trainer_sign: string;
}

interface ReTrainingConfirmation {
  id?: number;
  operator: number | null;
  trainer: number | null;
  process_name: string;
  line_name_or_no: string;
  observations: Observation[];
}

const Retraining: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [formData, setFormData] = useState<ReTrainingConfirmation>({
    operator: null,
    trainer: null,
    process_name: '',
    line_name_or_no: '',
    observations: Array(20).fill(null).map((_, i) => ({
      serial_no: i + 1,
      failure_point: '',
      retraining_date: '',
      confirm_1: '',
      confirm_2: '',
      confirm_3: '',
      trainee_sign: '',
      trainer_sign: ''
    }))
  });
  const [loading, setLoading] = useState(false);
  const [operatorName, setOperatorName] = useState('');
  const [eCodeInput, setECodeInput] = useState('');
  const [operatorSearchLoading, setOperatorSearchLoading] = useState(false);

  useEffect(() => {
    // Fetch trainers when component mounts
    const fetchTrainers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/trainers/');
        setTrainers(response.data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };
    fetchTrainers();
  }, []);

  const handleFetchOperator = async () => {
    if (!eCodeInput) {
      alert('Please enter E-Code');
      return;
    }
    
    try {
      setOperatorSearchLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/operators/fetch/', {
        params: {
          empid: eCodeInput
        }
      });

      if (response.data) {
        const operator = response.data;
        setFormData(prev => ({
          ...prev,
          operator: operator.id
        }));
        setOperatorName(operator.name);
        setECodeInput(operator.empid);
      }
    } catch (error) {
      console.error('Error fetching operator:', error);
      alert('Error fetching operator');
    } finally {
      setOperatorSearchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleObservationChange = (index: number, field: keyof Observation, value: string) => {
    setFormData(prev => {
      const newObservations = [...prev.observations];
      newObservations[index] = {
        ...newObservations[index],
        [field]: value
      };
      return {
        ...prev,
        observations: newObservations
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Save operator data first if needed
      if (operatorName && eCodeInput && !formData.operator) {
        const createResponse = await axios.post('http://127.0.0.1:8000/operators/', {
          name: operatorName,
          empid: eCodeInput
        });
        const newOperator = createResponse.data;
        setFormData(prev => ({
          ...prev,
          operator: newOperator.id
        }));
      }

      if (formData.id) {
        await axios.put(`http://127.0.0.1:8000/confirmations/${formData.id}/`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/confirmations/', formData);
      }
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const selectedTrainer = trainers.find(t => t.id === formData.trainer);

  return (
    <div className="overflow-x-auto p-4">
      <form onSubmit={handleSubmit}>
        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td colSpan={7} rowSpan={4} className="border border-gray-400 text-center align-middle">
                Re-Training Effectiveness Confirmation
              </td>
              <td className="border border-gray-400 align-middle">Document No</td>
              <td className="border border-gray-400 align-middle">F21(PD-P-01)</td>
            </tr>
            <tr>
              <td className="border border-gray-400 align-middle">Rev. No / Date</td>
              <td className="border border-gray-400 align-middle">00/01.09.2023</td>
            </tr>
            <tr>
              <td className="border border-gray-400 align-middle">Effective Date</td>
              <td className="border border-gray-400 align-middle">01.09.2023</td>
            </tr>
            <tr>
              <td className="border border-gray-400 align-middle">Retention Period</td>
              <td className="border border-gray-400 align-middle">20 Years</td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-gray-400 align-middle">
                <div className="flex items-center">
                  <span className="mr-2">Employee Name:</span>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Enter Name"
                    className="border p-1 flex-1"
                  />
                </div>
              </td>
              <td colSpan={5} className="border border-gray-400 align-middle">
                <input
                  type="text"
                  name="process_name"
                  value={formData.process_name}
                  onChange={handleInputChange}
                  placeholder="Process Name"
                  className="w-full p-1 border"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-gray-400 align-middle">
                <div className="flex items-center">
                  <span className="mr-2">E.Code:</span>
                  <input
                    type="text"
                    value={eCodeInput}
                    onChange={(e) => setECodeInput(e.target.value)}
                    placeholder="Enter E-Code"
                    className="border p-1 flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleFetchOperator}
                    className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                    disabled={operatorSearchLoading}
                  >
                    {operatorSearchLoading ? 'Loading...' : 'Fetch'}
                  </button>
                </div>
              </td>
              <td colSpan={5} className="border border-gray-400 align-middle">
                <input
                  type="text"
                  name="line_name_or_no"
                  value={formData.line_name_or_no}
                  onChange={handleInputChange}
                  placeholder="Line Name / No."
                  className="w-full p-1 border"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-gray-400 align-middle">
                <select
                  name="trainer"
                  value={formData.trainer || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    trainer: e.target.value ? parseInt(e.target.value) : null
                  }))}
                  className="w-full p-1 border"
                >
                  <option value="">Select Trainer</option>
                  {trainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name} (Line {trainer.line_no})
                    </option>
                  ))}
                </select>
              </td>
              <td colSpan={5} className="border border-gray-400 align-middle">
                {selectedTrainer && (
                  <span>Line No.: {selectedTrainer.line_no}</span>
                )}
              </td>
            </tr>

            {/* Table Header */}
            <tr>
              <td rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">S.NO.</td>
              <td colSpan={2} rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">OBSERVATIONS (Failure Points)</td>
              <td rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">Re-Training Date</td>
              <td colSpan={3} className="border border-gray-400 p-2 text-center bg-gray-100">DEGREE OF CONFIRMATION / EVALUATION</td>
              <td rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">Trainee Sign [OPERATOR]</td>
              <td rowSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">Trainer's confirmation Sign</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 text-center bg-gray-100">1st</td>
              <td className="border border-gray-400 p-2 text-center bg-gray-100">2nd</td>
              <td className="border border-gray-400 p-2 text-center bg-gray-100">3rd</td>
            </tr>

            {/* Observation Rows */}
            {formData.observations.map((obs, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">{obs.serial_no}</td>
                <td colSpan={2} className="border border-gray-400 p-2 text-center bg-gray-100">
                  <input
                    type="text"
                    value={obs.failure_point}
                    onChange={(e) => handleObservationChange(index, 'failure_point', e.target.value)}
                    className="w-full p-1 border"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">
                  <input
                    type="date"
                    value={obs.retraining_date}
                    onChange={(e) => handleObservationChange(index, 'retraining_date', e.target.value)}
                    className="w-full p-1 border"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">
                  <select
                    value={obs.confirm_1}
                    onChange={(e) => handleObservationChange(index, 'confirm_1', e.target.value)}
                    className="w-full p-1 border"
                  >
                    <option value=""></option>
                    <option value="○">○ Satisfactory</option>
                    <option value="△">△ Needs Retraining</option>
                  </select>
                </td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">
                  <select
                    value={obs.confirm_2}
                    onChange={(e) => handleObservationChange(index, 'confirm_2', e.target.value)}
                    className="w-full p-1 border"
                  >
                    <option value=""></option>
                    <option value="○">○ Satisfactory</option>
                    <option value="△">△ Needs Retraining</option>
                  </select>
                </td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">
                  <select
                    value={obs.confirm_3}
                    onChange={(e) => handleObservationChange(index, 'confirm_3', e.target.value)}
                    className="w-full p-1 border"
                  >
                    <option value=""></option>
                    <option value="○">○ Satisfactory</option>
                    <option value="△">△ Needs Retraining</option>
                  </select>
                </td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">
                  <input
                    type="text"
                    value={obs.trainee_sign}
                    onChange={(e) => handleObservationChange(index, 'trainee_sign', e.target.value)}
                    className="w-full p-1 border"
                    placeholder="Operator Sign"
                  />
                </td>
                <td className="border border-gray-400 p-2 text-center bg-gray-100">
                  <input
                    type="text"
                    value={obs.trainer_sign}
                    onChange={(e) => handleObservationChange(index, 'trainer_sign', e.target.value)}
                    className="w-full p-1 border"
                    placeholder="Trainer Sign"
                  />
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={7} className="border border-gray-400 text-center align-middle">
                ø Legends for confirmation and evaluation : <br />
                [○] - Satisfactory [If all related contents are clear]<br />
                [△] - Need to Retrained [If related contents are not clear]
              </td>
              <td colSpan={2} className="border border-gray-400 text-center align-middle">
                Section Head Sign.-
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="mt-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Retraining;