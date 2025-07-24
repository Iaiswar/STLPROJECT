import React, { useEffect, useState } from "react";
import axios from "axios";

interface Level {
	id: number;
	name: string; // e.g., 'level_1'
	line: number;
	display_name?: string; // Optional for showing "Level 1"
}

const SkillTrainingForm: React.FC = () => {
	const [levels, setLevels] = useState<Level[]>([]);
	const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
	const [title, setTitle] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/levels/")
			.then((res) => setLevels(res.data))
			.catch((err) => console.error("Error fetching levels:", err));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedLevel || !title.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/skill-trainings/", {
				level: selectedLevel,
				title: title.trim(),
			});
			setSuccessMessage("Skill training saved successfully!");
			setTitle("");
			setSelectedLevel(null);
		} catch (error) {
			console.error("Error submitting skill training:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					Skill Training Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add New Skill Training
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='level-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Level{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='level-select'
									value={selectedLevel ?? ""}
									onChange={(e) =>
										setSelectedLevel(Number(e.target.value))
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>
										-- Select a Level --
									</option>
									{levels.map((level) => (
										<option key={level.id} value={level.id}>
											{level.name
												.replace("_", " ")
												.toUpperCase()}{" "}
											(Line {level.line})
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='skill-title'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Skill Training Title{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='skill-title'
									type='text'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter training title'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save Training
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

export default SkillTrainingForm;
