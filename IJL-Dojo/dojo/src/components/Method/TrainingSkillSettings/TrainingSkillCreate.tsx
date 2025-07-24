import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Group { id: number; name: string; }
interface Plant { id: number; name: string; }
interface Department { id: number; name: string; }
interface Day { id: number; day_number: number; }
interface Skill { id: number; name: string; }

const TrainingSkillCreate: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [groupId, setGroupId] = useState<number | ''>('');
  const [plantId, setPlantId] = useState<number | ''>('');
  const [departmentId, setDepartmentId] = useState<number | ''>('');
  const [dayId, setDayId] = useState<number | ''>('');
  const [skillId, setSkillId] = useState<number | ''>('');
  const [trainingName, setTrainingName] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  // Fetch groups on load
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/groups/').then(res => setGroups(res.data));
  }, []);

  // Fetch plants when group changes
  useEffect(() => {
    if (groupId) {
      axios.get('http://127.0.0.1:8000/plants/')
        .then(res => setPlants(res.data.filter((p: any) => p.group === groupId)));
    } else {
      setPlants([]);
    }
    setPlantId('');
    setDepartments([]);
    setDays([]);
    setSkills([]);
  }, [groupId]);

  // Fetch departments when plant changes
  useEffect(() => {
    if (plantId) {
      axios.get('http://127.0.0.1:8000/departments/')
        .then(res => setDepartments(res.data.filter((d: any) => d.plant === plantId)));

      axios.get('http://127.0.0.1:8000/days/')
        .then(res => setDays(res.data.filter((d: any) => d.plant === plantId)));
    } else {
      setDepartments([]);
      setDays([]);
    }
    setDepartmentId('');
    setDayId('');
    setSkills([]);
  }, [plantId]);

  // Fetch skills when day changes
  useEffect(() => {
    if (dayId) {
      axios.get('http://127.0.0.1:8000/skills/')
        .then(res => setSkills(res.data.filter((s: any) => s.day === dayId)));
    } else {
      setSkills([]);
    }
    setSkillId('');
  }, [dayId]);

  const handleSubmit = () => {
    if (!groupId || !plantId || !departmentId || !dayId || !skillId || !trainingName) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append('group', groupId.toString());
    formData.append('plant', plantId.toString());
    formData.append('department', departmentId.toString());
    formData.append('day', dayId.toString());
    formData.append('skill', skillId.toString());
    formData.append('training_name', trainingName);
    if (video) formData.append('video', video);
    if (pdf) formData.append('pdf_attachment', pdf);

    axios.post('http://127.0.0.1:8000/training-skills/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {
      alert("Training skill created successfully!");
      setTrainingName('');
      setGroupId('');
      setPlantId('');
      setDepartmentId('');
      setDayId('');
      setSkillId('');
      setVideo(null);
      setPdf(null);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to create training skill.");
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Add Training Skill</h2>

      <select className="w-full border p-2 rounded" value={groupId} onChange={e => setGroupId(Number(e.target.value))}>
        <option value="">Select Group</option>
        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      <select className="w-full border p-2 rounded" value={plantId} onChange={e => setPlantId(Number(e.target.value))}>
        <option value="">Select Plant</option>
        {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      <select className="w-full border p-2 rounded" value={departmentId} onChange={e => setDepartmentId(Number(e.target.value))}>
        <option value="">Select Department</option>
        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <select className="w-full border p-2 rounded" value={dayId} onChange={e => setDayId(Number(e.target.value))}>
        <option value="">Select Day</option>
        {days.map(d => <option key={d.id} value={d.id}>Day {d.day_number}</option>)}
      </select>

      <select className="w-full border p-2 rounded" value={skillId} onChange={e => setSkillId(Number(e.target.value))}>
        <option value="">Select Skill</option>
        {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <input
        type="text"
        placeholder="Training Name"
        className="w-full border p-2 rounded"
        value={trainingName}
        onChange={e => setTrainingName(e.target.value)}
      />

      <input
        type="file"
        accept="video/*"
        className="w-full border p-2 rounded"
        onChange={e => setVideo(e.target.files?.[0] || null)}
      />

      <input
        type="file"
        accept="application/pdf"
        className="w-full border p-2 rounded"
        onChange={e => setPdf(e.target.files?.[0] || null)}
      />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default TrainingSkillCreate;
