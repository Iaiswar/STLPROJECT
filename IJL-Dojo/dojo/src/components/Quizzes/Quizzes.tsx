import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TrainingSkill {
  id: number;
  group: number;
  plant: number;
  department: number;
  day: number;
  skill: number;
  training_name: string;
  video: string;
  pdf_attachment: string;
}


const TestUpload: React.FC = () => {
  const [trainingSkills, setTrainingSkills] = useState<TrainingSkill[]>([]);
  const [trainingSkillId, setTrainingSkillId] = useState<number | ''>('');
  const [testName, setTestName] = useState<string>('');
  const [questionsFile, setQuestionsFile] = useState<File | null>(null);

  // Load training skills on component mount
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/training-skills/')
      .then(res => setTrainingSkills(res.data));
  }, []);

  const handleSubmit = () => {
    if (!trainingSkillId || !testName || !questionsFile) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append('training_skill', trainingSkillId.toString());
    formData.append('test_name', testName);
    formData.append('questions_file', questionsFile);

    axios.post('http://127.0.0.1:8000/tests/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {
      alert("Test uploaded successfully!");
      setTrainingSkillId('');
      setTestName('');
      setQuestionsFile(null);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to upload test.");
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Upload Test</h2>

      <select 
        className="w-full border p-2 rounded" 
        value={trainingSkillId} 
        onChange={e => setTrainingSkillId(Number(e.target.value) || '')}
      >
        <option value="">Select Training</option>
        {trainingSkills.map(ts => (
          <option key={ts.id} value={ts.id}>{ts.training_name}</option>
        ))}
      </select>

      <input
        type="text"
        className="w-full border p-2 rounded"
        placeholder="Test Name"
        value={testName}
        onChange={e => setTestName(e.target.value)}
      />

      <input
        type="file"
        accept=".xlsx, .csv"
        className="w-full border p-2 rounded"
        onChange={e => setQuestionsFile(e.target.files?.[0] || null)}
      />

      <button
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        onClick={handleSubmit}
      >
        Upload Test
      </button>
    </div>
  );
};

export default TestUpload;




// import React, { useState } from 'react';
// import styles from './Quizzes.module.css';

// const FileUpload: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [message, setMessage] = useState<string | null>(null);

//   // Handle file selection
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//       setMessage(null); // Reset message
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!file) {
//       setMessage('Please select a file to upload.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/quizzes/', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setMessage(data.message || 'File uploaded successfully!');
//       } else {
//         setMessage('Error uploading file');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessage('Something went wrong!');
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Upload Quiz CSV</h2>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <input type="file" onChange={handleFileChange} className={styles.input} />
//         <button type="submit" className={styles.button}>Upload</button>
//       </form>
//       {message && <p className={styles.message}>{message}</p>}
//     </div>
//   );
// };

// export default FileUpload;
