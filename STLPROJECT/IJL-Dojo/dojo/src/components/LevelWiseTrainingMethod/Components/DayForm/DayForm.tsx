import React, { useEffect, useState } from "react";
import axios from "axios";

interface Level {
	id: number;
	name: string;
	line: number;
}

const DayForm: React.FC = () => {
	const [levels, setLevels] = useState<Level[]>([]);
	const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
	const [day, setDay] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/levels/")
			.then((res) => setLevels(res.data))
			.catch((err) => console.error("Error fetching levels:", err));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedLevel || !day.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/days/", {
				level: selectedLevel,
				day: day.trim(),
			});
			setSuccessMessage("Day saved successfully!");
			setDay("");
			setSelectedLevel(null);
		} catch (error) {
			console.error("Error submitting day:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					Training Day Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add New Training Day
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
									htmlFor='day-input'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Training Day{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='day-input'
									type='text'
									value={day}
									onChange={(e) => setDay(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='e.g. Day 1'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save Training Day
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

export default DayForm;
