import React, { useEffect, useState } from "react";
import axios from "axios";

interface Department {
	id: number;
	name: string;
}

const LineForm: React.FC = () => {
	const [departments, setDepartments] = useState<Department[]>([]);
	const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
		null
	);
	const [name, setName] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		axios
			.get<Department[]>("http://127.0.0.1:8000/departments/")
			.then((response) => setDepartments(response.data))
			.catch((error) =>
				console.error("Error fetching departments:", error)
			);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDepartment || !name.trim()) return;

		try {
			await axios.post("http://127.0.0.1:8000/lines/", {
				department: selectedDepartment,
				name,
			});
			setSuccessMessage("Line saved successfully!");
			setName("");
			setSelectedDepartment(null);
		} catch (error) {
			console.error("Error saving line:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-xl font-semibold text-gray-800 mb-6'>
					Line Management
				</h1>

				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Add New Line
					</h2>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label
									htmlFor='department-select'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Select Department{" "}
									<span className='text-red-500'>*</span>
								</label>
								<select
									id='department-select'
									value={selectedDepartment ?? ""}
									onChange={(e) =>
										setSelectedDepartment(
											Number(e.target.value)
										)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									required
								>
									<option value=''>
										-- Select a Department --
									</option>
									{departments.map((dept) => (
										<option key={dept.id} value={dept.id}>
											{dept.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor='line-name'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Line Name{" "}
									<span className='text-red-500'>*</span>
								</label>
								<input
									id='line-name'
									type='text'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter line name'
									required
								/>
							</div>
						</div>
						<div className='flex justify-end'>
							<button
								type='submit'
								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
							>
								Save Line
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

export default LineForm;
