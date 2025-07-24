import React, { useEffect, useState } from "react";
import axios from "axios";

interface LevelTwoTopic {
	id: number;
	title: string;
}

interface LevelTwoSubTopic {
	id: number;
	title: string;
}

interface Day {
	id: number;
	day: string;
}

const LevelTwoUnitForm: React.FC = () => {
	const [topics, setTopics] = useState<LevelTwoTopic[]>([]);
	const [subtopics, setSubtopics] = useState<LevelTwoSubTopic[]>([]);
	const [days, setDays] = useState<Day[]>([]);

	const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
	const [selectedSubTopic, setSelectedSubTopic] = useState<number | null>(
		null
	);
	const [selectedDay, setSelectedDay] = useState<number | null>(null);
	const [content, setContent] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/level2-topics/")
			.then((res) => setTopics(res.data));
		axios
			.get("http://127.0.0.1:8000/level2-subtopics/")
			.then((res) => setSubtopics(res.data));
		axios
			.get("http://127.0.0.1:8000/days/")
			.then((res) => setDays(res.data));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedTopic && !selectedSubTopic)
			return alert("Select at least a Topic or a Subtopic");
		if (!selectedDay || !content.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/level2-units/", {
				topic: selectedTopic,
				subtopic: selectedSubTopic,
				day: selectedDay,
				content: content.trim(),
			});
			setSuccessMessage("Level Two Unit created successfully!");
			setSelectedTopic(null);
			setSelectedSubTopic(null);
			setSelectedDay(null);
			setContent("");
		} catch (error) {
			console.error("Error creating unit:", error);
		}
	};

	return (
		// <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
		//   <h2 className="text-2xl font-bold mb-4">Create Level 2 Unit</h2>
		//   <form onSubmit={handleSubmit} className="space-y-4">
		//     <div>
		//       <label className="block font-medium mb-1">Select Topic (optional)</label>
		//       <select
		//         value={selectedTopic ?? ''}
		//         onChange={(e) => setSelectedTopic(Number(e.target.value) || null)}
		//         className="w-full border rounded px-3 py-2"
		//       >
		//         <option value="">-- Select Topic --</option>
		//         {topics.map(topic => (
		//           <option key={topic.id} value={topic.id}>{topic.title}</option>
		//         ))}
		//       </select>
		//     </div>
		//     <div>
		//       <label className="block font-medium mb-1">Select SubTopic (optional)</label>
		//       <select
		//         value={selectedSubTopic ?? ''}
		//         onChange={(e) => setSelectedSubTopic(Number(e.target.value) || null)}
		//         className="w-full border rounded px-3 py-2"
		//       >
		//         <option value="">-- Select SubTopic --</option>
		//         {subtopics.map(sub => (
		//           <option key={sub.id} value={sub.id}>{sub.title}</option>
		//         ))}
		//       </select>
		//     </div>
		//     <div>
		//       <label className="block font-medium mb-1">Select Day</label>
		//       <select
		//         value={selectedDay ?? ''}
		//         onChange={(e) => setSelectedDay(Number(e.target.value))}
		//         className="w-full border rounded px-3 py-2"
		//         required
		//       >
		//         <option value="">-- Select Day --</option>
		//         {days.map(day => (
		//           <option key={day.id} value={day.id}>{day.day}</option>
		//         ))}
		//       </select>
		//     </div>
		//     <div>
		//       <label className="block font-medium mb-1">Content</label>
		//       <input
		//         type="text"
		//         value={content}
		//         onChange={(e) => setContent(e.target.value)}
		//         className="w-full border rounded px-3 py-2"
		//         placeholder="Enter content"
		//         required
		//       />
		//     </div>
		//     <button
		//       type="submit"
		//       className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
		//     >
		//       Save Unit
		//     </button>
		//     {successMessage && (
		//       <p className="text-green-600 mt-2">{successMessage}</p>
		//     )}
		//   </form>
		// </div>
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
					Level 2 Unit Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Create New Level 2 Unit
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='topic-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Topic (optional)
								</label>
								<select
									id='topic-select'
									value={selectedTopic ?? ""}
									onChange={(e) =>
										setSelectedTopic(
											Number(e.target.value) || null
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
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
									htmlFor='subtopic-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select SubTopic (optional)
								</label>
								<select
									id='subtopic-select'
									value={selectedSubTopic ?? ""}
									onChange={(e) =>
										setSelectedSubTopic(
											Number(e.target.value) || null
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
								>
									<option value=''>
										-- Select SubTopic --
									</option>
									{subtopics.map((sub) => (
										<option key={sub.id} value={sub.id}>
											{sub.title}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
									htmlFor='content-input'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Content{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='content-input'
									type='text'
									value={content}
									onChange={(e) => setContent(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter content'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save Unit
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

export default LevelTwoUnitForm;
