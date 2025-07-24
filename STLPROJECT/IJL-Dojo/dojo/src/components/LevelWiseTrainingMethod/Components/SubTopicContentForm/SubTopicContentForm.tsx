import React, { useEffect, useState } from "react";
import axios from "axios";

interface SubTopic {
	id: number;
	skill_training: number;
	day: number;
	title: string;
}

const SubTopicContentForm: React.FC = () => {
	const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
	const [selectedSubtopic, setSelectedSubtopic] = useState<number | null>(
		null
	);
	const [title, setTitle] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/subtopics/")
			.then((res) => {
				setSubtopics(res.data);
				console.log(res.data);
			})
			.catch((err) => console.error("Error fetching subtopics:", err));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedSubtopic || !title.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/subtopic-contents/", {
				subtopic: selectedSubtopic,
				title: title.trim(),
			});
			setSuccessMessage("SubTopicContent saved successfully!");
			setTitle("");
			setSelectedSubtopic(null);
		} catch (error) {
			console.error("Error submitting SubTopicContent:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					SubTopic Content Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add New SubTopic Content
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='subtopic-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select SubTopic{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='subtopic-select'
									value={selectedSubtopic ?? ""}
									onChange={(e) =>
										setSelectedSubtopic(
											Number(e.target.value)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>
										-- Select a SubTopic --
									</option>
									{subtopics.map((sub) => (
										<option key={sub.id} value={sub.id}>
											{/* Day {sub.day} -  */}
											{sub.title}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='content-title'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Content Title{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='content-title'
									type='text'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='e.g. Safety Measures'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save Content
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

export default SubTopicContentForm;
