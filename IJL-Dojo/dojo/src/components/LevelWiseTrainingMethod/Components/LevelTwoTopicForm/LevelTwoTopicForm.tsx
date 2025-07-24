import React, { useEffect, useState } from "react";
import axios from "axios";

interface LevelTwoSection {
	id: number;
	title: string;
	skill_training: number;
}

const LevelTwoTopicForm: React.FC = () => {
	const [sections, setSections] = useState<LevelTwoSection[]>([]);
	const [selectedSection, setSelectedSection] = useState<number | null>(null);
	const [title, setTitle] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/level2-sections/")
			.then((res) => setSections(res.data))
			.catch((err) => console.error("Error fetching sections:", err));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedSection || !title.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/level2-topics/", {
				section: selectedSection,
				title: title.trim(),
			});
			setSuccessMessage("Topic added successfully!");
			setTitle("");
			setSelectedSection(null);
		} catch (error) {
			console.error("Error creating topic:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					Topic Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add New Topic
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='section-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Section{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='section-select'
									value={selectedSection ?? ""}
									onChange={(e) =>
										setSelectedSection(
											Number(e.target.value)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>
										-- Select Section --
									</option>
									{sections.map((section) => (
										<option
											key={section.id}
											value={section.id}
										>
											{section.title}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='topic-title'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Topic Title{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='topic-title'
									type='text'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter topic title'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save Topic
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

export default LevelTwoTopicForm;
