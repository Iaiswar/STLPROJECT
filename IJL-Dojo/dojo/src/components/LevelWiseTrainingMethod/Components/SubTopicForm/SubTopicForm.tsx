import React, { useEffect, useState } from "react";
import axios from "axios";

interface SkillTraining {
	id: number;
	title: string;
	level: number;
}

interface Day {
	id: number;
	day: string;
	level: number;
}

const SubTopicForm: React.FC = () => {
	const [skillTrainings, setSkillTrainings] = useState<SkillTraining[]>([]);
	const [days, setDays] = useState<Day[]>([]);
	const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
	const [selectedDay, setSelectedDay] = useState<number | null>(null);
	const [title, setTitle] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/skill-trainings/")
			.then((res) => setSkillTrainings(res.data))
			.catch((err) =>
				console.error("Error fetching skill trainings:", err)
			);

		axios
			.get("http://127.0.0.1:8000/days/")
			.then((res) => setDays(res.data))
			.catch((err) => console.error("Error fetching days:", err));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedSkill || !selectedDay || !title.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/subtopics/", {
				skill_training: selectedSkill,
				day: selectedDay,
				title: title.trim(),
			});
			setSuccessMessage("Subtopic added successfully!");
			setTitle("");
			setSelectedDay(null);
			setSelectedSkill(null);
		} catch (error) {
			console.error("Error submitting subtopic:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					Sub Topic Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add New Sub Topic
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<div>
								<label
									htmlFor='skill-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Skill Training{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='skill-select'
									value={selectedSkill ?? ""}
									onChange={(e) =>
										setSelectedSkill(Number(e.target.value))
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>
										-- Select Training --
									</option>
									{skillTrainings.map((skill) => (
										<option key={skill.id} value={skill.id}>
											{skill.title}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='day-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Day{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='day-select'
									value={selectedDay ?? ""}
									onChange={(e) =>
										setSelectedDay(Number(e.target.value))
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>-- Select Day --</option>
									{days.map((day) => (
										<option key={day.id} value={day.id}>
											{day.day}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='subtopic-title'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Sub Topic Title{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='subtopic-title'
									type='text'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter sub topic title'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save Sub Topic
							</button>
						</div>
					</form>
					{successMessage && (
						<div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-md'>
							<p className='text-sm text-green-700'>
								{successMessage}
							</p>
						</div>
					)}
				</section>
			</div>
		</div>
	);
};

export default SubTopicForm;
