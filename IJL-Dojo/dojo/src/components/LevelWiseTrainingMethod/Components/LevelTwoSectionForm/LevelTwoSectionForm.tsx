import React, { useEffect, useState } from "react";
import axios from "axios";

interface SkillTraining {
	id: number;
	title: string;
}

const LevelTwoSectionForm: React.FC = () => {
	const [skillTrainings, setSkillTrainings] = useState<SkillTraining[]>([]);
	const [selectedTraining, setSelectedTraining] = useState<number | null>(
		null
	);
	const [sectionTitle, setSectionTitle] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/level2-skill-trainings/")
			.then((res) => setSkillTrainings(res.data))
			.catch((err) =>
				console.error("Error fetching skill trainings:", err)
			);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedTraining || !sectionTitle.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/level2-sections/", {
				skill_training: selectedTraining,
				title: sectionTitle.trim(),
			});

			setSuccessMessage("Section saved successfully!");
			setSectionTitle("");
			setSelectedTraining(null);
		} catch (error) {
			console.error("Error saving section:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					Section Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add Section to Level 2 Training
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='training-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Skill Training{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='training-select'
									value={selectedTraining ?? ""}
									onChange={(e) =>
										setSelectedTraining(
											Number(e.target.value)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>
										-- Select Skill Training --
									</option>
									{skillTrainings.map((training) => (
										<option
											key={training.id}
											value={training.id}
										>
											{training.title}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='section-title'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Section Title{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='section-title'
									type='text'
									value={sectionTitle}
									onChange={(e) =>
										setSectionTitle(e.target.value)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter section title'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save Section
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

export default LevelTwoSectionForm;
