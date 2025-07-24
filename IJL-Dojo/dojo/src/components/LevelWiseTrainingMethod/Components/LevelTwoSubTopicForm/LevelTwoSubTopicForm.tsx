import React, { useEffect, useState } from "react";
import axios from "axios";

interface LevelTwoTopic {
	id: number;
	title: string;
	section: number;
}

const LevelTwoSubTopicForm: React.FC = () => {
	const [topics, setTopics] = useState<LevelTwoTopic[]>([]);
	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [title, setTitle] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/level2-topics/")
			.then((res) => setTopics(res.data))
			.catch((err) => console.error("Error fetching topics:", err));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedTopic || !title.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/level2-subtopics/", {
				topic: selectedTopic,
				title: title.trim(),
			});
			setSuccessMessage("Sub-topic added successfully!");
			setTitle("");
			setSelectedTopic(null);
		} catch (error) {
			console.error("Error creating sub-topic:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					SubTopic Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add New SubTopic
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='topic-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Topic{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='topic-select'
									value={selectedTopic ?? ""}
									onChange={(e) =>
										setSelectedTopic(Number(e.target.value))
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>-- Select Topic --</option>
									{topics.map((topic) => (
										<option key={topic.id} value={topic.id}>
											{topic.title}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='subtopic-title'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									SubTopic Title{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='subtopic-title'
									type='text'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter sub-topic title'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save SubTopic
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

export default LevelTwoSubTopicForm;
