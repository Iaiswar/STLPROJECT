import React, { useEffect, useState } from "react";
import axios from "axios";

interface Unit {
	id: number;
	content: string;
	day: number;
	topic: number;
	subtopic: number | null;
}

interface SubTopic {
	id: number;
	title: string;
	topic: number;
	leveltwo_units: Unit[];
}

interface Topic {
	id: number;
	title: string;
	section: number;
	leveltwo_units: Unit[];
	leveltwo_subtopics: SubTopic[];
}

const LevelTwoUnitContentForm: React.FC = () => {
	const [topics, setTopics] = useState<Topic[]>([]);
	const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
	const [selectedSubTopicId, setSelectedSubTopicId] = useState<number | null>(
		null
	);
	const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
	const [description, setDescription] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/level2-topics/")
			.then((res) => setTopics(res.data))
			.catch((err) => console.error("Error fetching topics:", err));
	}, []);

	const selectedTopic = topics.find((t) => t.id === selectedTopicId);
	const subtopics = selectedTopic?.leveltwo_subtopics || [];

	const units = (() => {
		if (!selectedTopic) return [];
		if (subtopics.length === 0) {
			return selectedTopic.leveltwo_units.filter(
				(u) => u.subtopic === null
			);
		} else if (selectedSubTopicId !== null) {
			const sub = subtopics.find((s) => s.id === selectedSubTopicId);
			return sub?.leveltwo_units || [];
		}
		return [];
	})();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUnitId || !description.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/level2-subunits/", {
				unit: selectedUnitId,
				title: description.trim(),
			});
			setSuccessMessage("Content saved successfully!");
			setDescription("");
			setSelectedTopicId(null);
			setSelectedSubTopicId(null);
			setSelectedUnitId(null);
		} catch (error) {
			console.error("Error saving content:", error);
		}
	};

	return (
		// <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
		//   <h2 className="text-2xl font-bold mb-4">Add Level 2 Unit Content</h2>
		//   <form onSubmit={handleSubmit} className="space-y-4">
		//     {/* Topic Selector */}
		//     <div>
		//       <label className="block font-medium mb-1">Select Topic</label>
		//       <select
		//         value={selectedTopicId ?? ''}
		//         onChange={(e) => {
		//           const value = Number(e.target.value);
		//           setSelectedTopicId(value);
		//           setSelectedSubTopicId(null);
		//           setSelectedUnitId(null);
		//         }}
		//         className="w-full border rounded px-3 py-2"
		//         required
		//       >
		//         <option value="">-- Select Topic --</option>
		//         {topics.map(topic => (
		//           <option key={topic.id} value={topic.id}>{topic.title}</option>
		//         ))}
		//       </select>
		//     </div>

		//     {/* SubTopic Selector (if applicable) */}
		//     {subtopics.length > 0 && (
		//       <div>
		//         <label className="block font-medium mb-1">Select SubTopic</label>
		//         <select
		//           value={selectedSubTopicId ?? ''}
		//           onChange={(e) => {
		//             setSelectedSubTopicId(Number(e.target.value));
		//             setSelectedUnitId(null);
		//           }}
		//           className="w-full border rounded px-3 py-2"
		//           required
		//         >
		//           <option value="">-- Select SubTopic --</option>
		//           {subtopics.map(sub => (
		//             <option key={sub.id} value={sub.id}>{sub.title}</option>
		//           ))}
		//         </select>
		//       </div>
		//     )}

		//     {/* Unit Selector */}
		//     <div>
		//       <label className="block font-medium mb-1">Select Unit</label>
		//       <select
		//         value={selectedUnitId ?? ''}
		//         onChange={(e) => setSelectedUnitId(Number(e.target.value))}
		//         className="w-full border rounded px-3 py-2"
		//         required
		//       >
		//         <option value="">-- Select Unit --</option>
		//         {units.map(unit => (
		//           <option key={unit.id} value={unit.id}>
		//             {unit.content} (Day {unit.day})
		//           </option>
		//         ))}
		//       </select>
		//     </div>

		//     {/* Description Field */}
		//     <div>
		//       <label className="block font-medium mb-1">Description</label>
		//       <input
		//         type="text"
		//         value={description}
		//         onChange={(e) => setDescription(e.target.value)}
		//         className="w-full border rounded px-3 py-2"
		//         placeholder="Enter content title or description"
		//         required
		//       />
		//     </div>

		//     <button
		//       type="submit"
		//       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
		//     >
		//       Save
		//     </button>

		//     {successMessage && <p className="text-green-600 mt-3">{successMessage}</p>}
		//   </form>
		// </div>
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
					Level 2 Unit Content Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add Level 2 Unit Content
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
									value={selectedTopicId ?? ""}
									onChange={(e) => {
										const value = Number(e.target.value);
										setSelectedTopicId(value);
										setSelectedSubTopicId(null);
										setSelectedUnitId(null);
									}}
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
							{subtopics.length > 0 && (
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
										value={selectedSubTopicId ?? ""}
										onChange={(e) => {
											setSelectedSubTopicId(
												Number(e.target.value)
											);
											setSelectedUnitId(null);
										}}
										className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
										required
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
							)}
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='unit-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Unit{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='unit-select'
									value={selectedUnitId ?? ""}
									onChange={(e) =>
										setSelectedUnitId(
											Number(e.target.value)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>-- Select Unit --</option>
									{units.map((unit) => (
										<option key={unit.id} value={unit.id}>
											{unit.content} (Day {unit.day})
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='description-input'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Description{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='description-input'
									type='text'
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter content title or description'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save
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

export default LevelTwoUnitContentForm;
