import React, { useEffect, useState } from "react";
import axios from "axios";

interface SkillLevel {
	id: number;
	level: number;
	written_test_date: string;
	written_test_score: number;
	practical_test_date: string;
	practical_test_score: number;
	observation_start_date: string;
	observation_end_date: string;
	observation_score: number;
	status: string;
	operator: number;
}

interface Operator {
	id: number;
	name: string;
	father_name: string;
	department: string;
	employee_code: string;
	category: string;
	date_of_join: string;
	total_experience: string;
	plant: string;
	face_embedding: string | null;
	skill_levels: SkillLevel[];
}

const BatchCreation: React.FC = () => {
	const [operators, setOperators] = useState<Operator[]>([]);
	const [selectedOperators, setSelectedOperators] = useState<number[]>([]);
	const [batchName, setBatchName] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [departmentFilter, setDepartmentFilter] = useState("");
	const [levelFilter, setLevelFilter] = useState("");

	useEffect(() => {
		axios
			.get("http://127.0.0.1:8000/master_list/")
			.then((res) => {
				setOperators(res.data);
			})
			.catch((err) => {
				console.error("Failed to fetch operators:", err);
			});
	}, []);

	const toggleOperatorSelection = (id: number) => {
		setSelectedOperators((prev) =>
			prev.includes(id)
				? prev.filter((opId) => opId !== id)
				: [...prev, id]
		);
	};

	const handleCreateBatch = () => {
		if (selectedOperators.length === 0) {
			alert("Please select at least one operator");
			return;
		}
		if (!batchName.trim()) {
			alert("Please enter a batch name");
			return;
		}

		const batchData = {
			name: batchName,
			operators: selectedOperators,
		};

		axios
			.post("http://127.0.0.1:8000/batches/", batchData)
			.then((res) => {
				alert("Batch created successfully!");
				setSelectedOperators([]);
				setBatchName("");
			})
			.catch((err) => {
				console.error("Failed to create batch:", err);
				alert("Failed to create batch");
			});
	};

	const filteredOperators = operators.filter((operator) => {
		const matchesSearch =
			operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			operator.employee_code
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

		const matchesDepartment = departmentFilter
			? operator.department === departmentFilter
			: true;

		const matchesLevel = levelFilter
			? operator.skill_levels.length > 0 &&
			  operator.skill_levels[0].level.toString() === levelFilter
			: true;

		return matchesSearch && matchesDepartment && matchesLevel;
	});

	const departments = [...new Set(operators.map((op) => op.department))];

	return (
		// <div className="p-6  ">
		//     <h2 className="text-2xl font-bold mb-6">Batch Creation</h2>

		//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
		//         {/* Batch Configuration Panel */}
		//         <div className="bg-white shadow rounded-lg p-4">
		//             <h3 className="text-lg font-semibold mb-4">Batch Configuration</h3>

		//             <div className="mb-4">
		//                 <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
		//                 <input
		//                     type="text"
		//                     value={batchName}
		//                     onChange={(e) => setBatchName(e.target.value)}
		//                     className="w-full p-2 border border-gray-300 rounded-md"
		//                     placeholder="Enter batch name"
		//                 />
		//             </div>

		//             <div className="mb-4">
		//                 <label className="block text-sm font-medium text-gray-700 mb-1">
		//                     Selected Operators: {selectedOperators.length}
		//                 </label>
		//                 <div className="border rounded-md p-2 h-40 overflow-y-auto">
		//                     {selectedOperators.length === 0 ? (
		//                         <p className="text-gray-500 text-sm">No operators selected</p>
		//                     ) : (
		//                         <ul className="space-y-1">
		//                             {operators
		//                                 .filter(op => selectedOperators.includes(op.id))
		//                                 .map(op => (
		//                                     <li key={op.id} className="flex justify-between items-center">
		//                                         <span>{op.name} ({op.employee_code})</span>
		//                                         <button
		//                                             onClick={() => toggleOperatorSelection(op.id)}
		//                                             className="text-red-500 hover:text-red-700"
		//                                         >
		//                                             ×
		//                                         </button>
		//                                     </li>
		//                                 ))
		//                             }
		//                         </ul>
		//                     )}
		//                 </div>
		//             </div>

		//             <button
		//                 onClick={handleCreateBatch}
		//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
		//             >
		//                 Create Batch
		//             </button>
		//         </div>

		//         {/* Operator Selection Panel */}
		//         <div className="lg:col-span-2 bg-white shadow rounded-lg p-4">
		//             <h3 className="text-lg font-semibold mb-4">Select Operators</h3>

		//             {/* Filters */}
		//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
		//                 <div>
		//                     <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
		//                     <input
		//                         type="text"
		//                         value={searchTerm}
		//                         onChange={(e) => setSearchTerm(e.target.value)}
		//                         className="w-full p-2 border border-gray-300 rounded-md"
		//                         placeholder="Search by name or ID"
		//                     />
		//                 </div>

		//                 <div>
		//                     <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
		//                     <select
		//                         value={departmentFilter}
		//                         onChange={(e) => setDepartmentFilter(e.target.value)}
		//                         className="w-full p-2 border border-gray-300 rounded-md"
		//                     >
		//                         <option value="">All Departments</option>
		//                         {departments.map(dept => (
		//                             <option key={dept} value={dept}>{dept}</option>
		//                         ))}
		//                     </select>
		//                 </div>
		//                 <div>
		//                     <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
		//                     <select
		//                         value={levelFilter}
		//                         onChange={(e) => setLevelFilter(e.target.value)}
		//                         className="w-full p-2 border border-gray-300 rounded-md"
		//                     >
		//                         <option value="">All Levels</option>
		//                         {[1, 2, 3, 4, 5].map(level => (
		//                             <option key={level} value={level.toString()}>Level {level}</option>
		//                         ))}
		//                     </select>
		//                 </div>

		//             </div>

		//             {/* Operators List */}
		//             <div className="border rounded-md overflow-hidden">
		//                 <div className="grid grid-cols-12 bg-gray-100 p-2 font-medium text-sm">
		//                     <div className="col-span-1"></div>
		//                     <div className="col-span-3">Name</div>
		//                     <div className="col-span-2">Employee ID</div>
		//                     <div className="col-span-2">Department</div>
		//                     <div className="col-span-2">Skill Level</div>
		//                     <div className="col-span-2">Experience</div>
		//                 </div>

		//                 <div className="max-h-96 overflow-y-auto">
		//                     {filteredOperators.length === 0 ? (
		//                         <div className="p-4 text-center text-gray-500">No operators found</div>
		//                     ) : (
		//                         filteredOperators.map(operator => (
		//                             <div
		//                                 key={operator.id}
		//                                 className={`grid grid-cols-12 p-2 border-b items-center hover:bg-gray-50 cursor-pointer ${selectedOperators.includes(operator.id) ? 'bg-blue-50' : ''}`}
		//                                 onClick={() => toggleOperatorSelection(operator.id)}
		//                             >
		//                                 <div className="col-span-1">
		//                                     <input
		//                                         type="checkbox"
		//                                         checked={selectedOperators.includes(operator.id)}
		//                                         onChange={() => toggleOperatorSelection(operator.id)}
		//                                         className="h-4 w-4 text-blue-600 rounded"
		//                                         onClick={(e) => e.stopPropagation()}
		//                                     />
		//                                 </div>
		//                                 <div className="col-span-3 font-medium">{operator.name}</div>
		//                                 <div className="col-span-2 text-gray-600">{operator.employee_code}</div>
		//                                 <div className="col-span-2">{operator.department}</div>
		//                                 <div className="col-span-2">
		//                                     {operator.skill_levels.length > 0 ? (
		//                                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
		//                                             Level {operator.skill_levels[0].level}
		//                                         </span>
		//                                     ) : (
		//                                         <span className="text-gray-500">N/A</span>
		//                                     )}
		//                                 </div>
		//                                 <div className="col-span-2">{operator.total_experience}</div>
		//                             </div>
		//                         ))
		//                     )}
		//                 </div>
		//             </div>
		//         </div>
		//     </div>
		// </div>

		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
					Batch Creation
				</h1>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Batch Configuration Panel */}
					<div className='bg-gray-50 rounded-lg p-6'>
						<h2 className='text-xl font-semibold text-gray-700 mb-4'>
							Batch Configuration
						</h2>

						<div className='mb-6'>
							<label
								htmlFor='batch-name'
								className='block text-sm font-medium text-gray-600 mb-1'
							>
								Batch Name{" "}
								<span className='text-red-500'>*</span>
							</label>
							<input
								id='batch-name'
								type='text'
								value={batchName}
								onChange={(e) => setBatchName(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
								placeholder='Enter batch name'
							/>
						</div>

						<div className='mb-6'>
							<label className='block text-sm font-medium text-gray-600 mb-1'>
								Selected Operators:{" "}
								<span className='font-semibold text-blue-600'>
									{selectedOperators.length}
								</span>
							</label>
							<div className='border border-gray-300 rounded-md p-3 h-40 overflow-y-auto bg-white'>
								{selectedOperators.length === 0 ? (
									<p className='text-gray-500 text-sm'>
										No operators selected
									</p>
								) : (
									<ul className='space-y-1'>
										{operators
											.filter((op) =>
												selectedOperators.includes(
													op.id
												)
											)
											.map((op) => (
												<li
													key={op.id}
													className='flex justify-between items-center p-2 bg-blue-50 rounded'
												>
													<span className='text-sm'>
														{op.name} (
														{op.employee_code})
													</span>
													<button
														onClick={() =>
															toggleOperatorSelection(
																op.id
															)
														}
														className='text-red-500 hover:text-red-700 font-bold'
													>
														×
													</button>
												</li>
											))}
									</ul>
								)}
							</div>
						</div>

						<button
							onClick={handleCreateBatch}
							className='w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
						>
							Create Batch
						</button>
					</div>

					{/* Operator Selection Panel */}
					<div className='lg:col-span-2 bg-gray-50 rounded-lg p-6'>
						<h2 className='text-xl font-semibold text-gray-700 mb-4'>
							Select Operators
						</h2>

						{/* Filters */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
							<div>
								<label
									htmlFor='search'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Search
								</label>
								<input
									id='search'
									type='text'
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
									placeholder='Search by name or ID'
								/>
							</div>

							<div>
								<label
									htmlFor='department-filter'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Department
								</label>
								<select
									id='department-filter'
									value={departmentFilter}
									onChange={(e) =>
										setDepartmentFilter(e.target.value)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
								>
									<option value=''>All Departments</option>
									{departments.map((dept) => (
										<option key={dept} value={dept}>
											{dept}
										</option>
									))}
								</select>
							</div>

							<div>
								<label
									htmlFor='level-filter'
									className='block text-sm font-medium text-gray-600 mb-1'
								>
									Skill Level
								</label>
								<select
									id='level-filter'
									value={levelFilter}
									onChange={(e) =>
										setLevelFilter(e.target.value)
									}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
								>
									<option value=''>All Levels</option>
									{[1, 2, 3, 4, 5].map((level) => (
										<option
											key={level}
											value={level.toString()}
										>
											Level {level}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Operators Table */}
						<div className='bg-white rounded-lg shadow overflow-hidden'>
							<div className='grid grid-cols-12 bg-gray-100 p-3 font-medium text-sm text-gray-700'>
								<div className='col-span-1'></div>
								<div className='col-span-3'>Name</div>
								<div className='col-span-2'>Employee ID</div>
								<div className='col-span-2'>Department</div>
								<div className='col-span-2'>Skill Level</div>
								<div className='col-span-2'>Experience</div>
							</div>

							<div className='max-h-96 overflow-y-auto'>
								{filteredOperators.length === 0 ? (
									<div className='p-4 text-center text-gray-500'>
										No operators found
									</div>
								) : (
									filteredOperators.map((operator) => (
										<div
											key={operator.id}
											className={`grid grid-cols-12 p-3 border-b border-gray-200 items-center hover:bg-gray-50 cursor-pointer transition-colors ${
												selectedOperators.includes(
													operator.id
												)
													? "bg-blue-50"
													: ""
											}`}
											onClick={() =>
												toggleOperatorSelection(
													operator.id
												)
											}
										>
											<div className='col-span-1'>
												<input
													type='checkbox'
													checked={selectedOperators.includes(
														operator.id
													)}
													onChange={() =>
														toggleOperatorSelection(
															operator.id
														)
													}
													className='h-4 w-4 text-blue-600 rounded focus:ring-blue-500'
													onClick={(e) =>
														e.stopPropagation()
													}
												/>
											</div>
											<div className='col-span-3 font-medium text-gray-900'>
												{operator.name}
											</div>
											<div className='col-span-2 text-gray-600'>
												{operator.employee_code}
											</div>
											<div className='col-span-2 text-gray-700'>
												{operator.department}
											</div>
											<div className='col-span-2'>
												{operator.skill_levels.length >
												0 ? (
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
														Level{" "}
														{
															operator
																.skill_levels[0]
																.level
														}
													</span>
												) : (
													<span className='text-gray-500'>
														N/A
													</span>
												)}
											</div>
											<div className='col-span-2 text-gray-700'>
												{operator.total_experience}
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BatchCreation;
