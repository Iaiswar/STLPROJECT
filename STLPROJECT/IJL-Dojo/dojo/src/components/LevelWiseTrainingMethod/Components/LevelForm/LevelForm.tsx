import React, { useEffect, useState } from "react";
import axios from "axios";

interface Line {
	id: number;
	name: string;
}

const LEVEL_CHOICES: { value: string; label: string }[] = [
	{ value: "level_1", label: "Level 1" },
	{ value: "level_2", label: "Level 2" },
	{ value: "level_3", label: "Level 3" },
	{ value: "level_4", label: "Level 4" },
];

const LevelForm: React.FC = () => {
	const [lines, setLines] = useState<Line[]>([]);
	const [selectedLine, setSelectedLine] = useState<number | null>(null);
	const [selectedLevel, setSelectedLevel] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get<Line[]>("http://127.0.0.1:8000/lines/")
			.then((response) => setLines(response.data))
			.catch((error) => console.error("Error fetching lines:", error));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedLine || !selectedLevel) return;

		try {
			await axios.post("http://127.0.0.1:8000/levels/", {
				line: selectedLine,
				name: selectedLevel, // backend expects value like 'level_1'
			});
			setSuccessMessage("Level saved successfully!");
			setSelectedLine(null);
			setSelectedLevel("");
		} catch (error) {
			console.error("Error saving level:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					Level Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add New Level
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='line-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Line{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='line-select'
									value={selectedLine ?? ""}
									onChange={(e) =>
										setSelectedLine(Number(e.target.value))
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>
										-- Select a Line --
									</option>
									{lines.map((line) => (
										<option key={line.id} value={line.id}>
											{line.name}
										</option>
									))}
								</select>
							</div>
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
									value={selectedLevel}
									onChange={(e) =>
										setSelectedLevel(e.target.value)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>
										-- Select a Level --
									</option>
									{LEVEL_CHOICES.map((choice) => (
										<option
											key={choice.value}
											value={choice.value}
										>
											{choice.label}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								Save Level
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

export default LevelForm;
