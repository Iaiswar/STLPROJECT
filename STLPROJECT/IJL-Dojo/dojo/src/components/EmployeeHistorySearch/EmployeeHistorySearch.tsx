import { useState, useEffect } from "react";
// import Nav from "../HomeNav/nav";
import { useLocation } from "react-router-dom"; ////
// import { useSearchParams } from 'react-router-dom';

// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000';

interface Operator {
	id: number;
	sr_no: number;
	employee_code: string;
	full_name: string;
	date_of_join: string | null;
	employee_pattern_category: string;
	designation: string;
	department: string;
	department_code: string;
}

interface OperatorLevel {
	id: number;
	operation_name: string;
	skill_matrix_name: string;
	level: number;
	created_at: string;
	remarks: string | null;
}

interface MultiSkilling {
	id: number;
	employee_name: string;
	station_number?: string | null; 
	skill?: string | null;
	skill_level_value?: string | null;
	start_date?: string | null;
	end_date?: string | null;
	refreshment_date?: string | null;
	notes: string;
	status: 'active' | 'inactive' | 'scheduled' | 'inprogress' | 'rescheduled' | 'completed';
	reason?: string | null;
	department_name: string;
	training_topic: string;
}


interface Score {
	id: number;
	employee_name: string;
	test_name: string;
	marks: number;
	created_at: string;
	percentage: number;
	passed: boolean;
}

interface RefreshmentTraining {
	id: number;
	training_topic: string
	training_name: {
		id: number;
		topic: string;
	};
	trainer: {
		id: number;
		name: string;
	} | null;
	venue: {
		id: number;
		name: string;
	} | null;
	status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
	date: string;
	time: string;
	employees: Operator[];
	trainer_name: string;
	venue_name: string;
}


interface EmployeeCardDetails {
	employee: Operator;
	operator_skills: OperatorLevel[];
	scores: Score[];
	multi_skilling: MultiSkilling[];
	refreshment_training: RefreshmentTraining[];
}

interface LocationState {
	fromReport?: boolean;
}

const EmployeeHistorySearch = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredEmployees, setFilteredEmployees] = useState<Operator[]>([]);
	const [employeeDetails, setEmployeeDetails] =
		useState<EmployeeCardDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	///*******///
	const location = useLocation();
	const state = location.state as LocationState;
	const fromReport = state?.fromReport || false;
	// const [searchParams] = useSearchParams();
	// console.log('URL Params:', searchParams.toString()); 
	// const fromReport = searchParams.get('from') === 'report';
	// console.log('From Report:', fromReport); 
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadSuccess, setDownloadSuccess] = useState(false);

	const clearSearch = () => {
		setSearchTerm('');
		setFilteredEmployees([]);
		setEmployeeDetails(null);
		setError('');
	};

	const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value;
		setSearchTerm(term);

		if (term.length >= 2) {
			try {
				setIsLoading(true);
				setError('');
				const response = await fetch(`${API_BASE_URL}/operators-master/`);
				if (response.ok) {
					const data = await response.json();
					const filtered = data.filter((emp: Operator) =>
						emp.full_name.toLowerCase().includes(term.toLowerCase()) ||
						emp.employee_code.toLowerCase().includes(term.toLowerCase())
					);
					setFilteredEmployees(filtered);
					if (filtered.length === 0) {
						setError('No matching employees found');
					}
				} else {
					setFilteredEmployees([]);
					setError('Error fetching employees');
				}
			} catch (err) {
				console.error('Fetch error:', err);
				setError('Error fetching employees');
				setFilteredEmployees([]);
			} finally {
				setIsLoading(false);
			}
		} else {
			setFilteredEmployees([]);
			setError(term.length ? 'Type at least 2 characters' : '');
		}
	};


	const handleEmployeeSelect = async (employee: Operator) => {
		setIsLoading(true);
		setSearchTerm(employee.full_name);
		setFilteredEmployees([]);
		setError('');

		try {
			const response = await fetch(
				`${API_BASE_URL}/employee-card-details/?employee_code=${employee.employee_code}`
			);

			if (response.ok) {
				const data = await response.json();
				console.log('Employee details response:', data);
				setEmployeeDetails(data);
			} else {
				const errorData = await response.json().catch(() => ({}));
				console.error('API Error:', errorData);
				setError(errorData.error || "Failed to fetch employee details");
			}
		} catch (err) {
			console.error("Fetch error:", err);
			setError("Failed to fetch employee details. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};


	const handleDownload = async () => {
		if (!employeeDetails) return;

		try {
			setIsDownloading(true);
			setDownloadSuccess(false);
			setError('');

			const response = await fetch(
				`${API_BASE_URL}/employee-report/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						card_no: employeeDetails.employee.employee_code,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "Failed to generate report");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `employee_report_${employeeDetails.employee.employee_code}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);

			setDownloadSuccess(true);
		} catch (error) {
			console.error("Download error:", error);
			setError("Failed to download the report. Please try again.");
		} finally {
			setIsDownloading(false);
		}
	};

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;

		if (downloadSuccess) {
			timer = setTimeout(() => {
				setDownloadSuccess(false);
			}, 5000);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [downloadSuccess]);

	return (
		<>
			{/* <Nav /> */}
			<div className='mt-[5%] min-h-screen  p-6'>
				<style
					dangerouslySetInnerHTML={{
						__html: `
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `,
					}}
				/>

				<div className='max-w-6xl mx-auto'>
					{/* Header */}
					<div className='text-center mb-8'>
						<h1 className='text-3xl font-bold text-gray-800 mb-2'>
							{fromReport
								? "Employee History Report"
								: "Employee History Card"}
						</h1>
						<p className='text-gray-600'>
							Search and view comprehensive employee records
						</p>
					</div>

					{/* Search Bar */}
					<div className='relative mb-8'>
						<div className='relative'>
							<input
								type='text'
								placeholder='Search employee by name or employee code...'
								className='w-full p-3 pl-10 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
								value={searchTerm}
								onChange={handleSearch}
							/>
							<svg
								className='absolute left-3 top-3.5 text-gray-400 w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
							{searchTerm && (
								<button
									onClick={clearSearch}
									className='absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 w-5 h-5'
								>
									<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								</button>
							)}
						</div>

						{/* Search Results Dropdown */}
						{isLoading && searchTerm.length >= 2 && (
							<div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3'>
								<div className='flex justify-center items-center'>
									<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
									<span className='ml-2 text-gray-600'>Searching...</span>
								</div>
							</div>
						)}

						{error && !isLoading && searchTerm.length >= 2 && filteredEmployees.length === 0 && (
							<div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-red-500'>
								{error}
							</div>
						)}

						{filteredEmployees.length > 0 && !isLoading && (
							<ul className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
								{filteredEmployees.slice(0, 10).map((emp) => (
									<li
										key={emp.employee_code}
										className='p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-200 last:border-0'
										onClick={() =>
											handleEmployeeSelect(emp)
										}
									>
										<div className='flex items-center justify-between'>
											<div>
												<span className='font-medium block'>
													{emp.full_name}
												</span>
												<span className='text-xs text-gray-500'>
													Code: {emp.employee_code}
												</span>
											</div>
											<span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded'>
												{emp.department || 'N/A'}
											</span>
										</div>
									</li>
								))}
								{filteredEmployees.length > 10 && (
									<li className='p-3 text-center text-gray-500 text-sm bg-gray-50'>
										Showing first 10 results. Type more to narrow down.
									</li>
								)}
							</ul>
						)}
					</div>

					{/* Loading State for Employee Details */}
					{isLoading && searchTerm && !filteredEmployees.length && (
						<div className='flex justify-center items-center py-12'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
							<span className='ml-3 text-gray-600'>Loading employee details...</span>
						</div>
					)}

					{/* Error Display */}
					{error && !isLoading && !filteredEmployees.length && (
						<div className='bg-red-50 border border-red-200 rounded-lg p-4 text-center'>
							<div className='text-red-600 font-medium'>{error}</div>
							<p className='text-red-500 text-sm mt-1'>Please try searching again or contact support if the issue persists.</p>
						</div>
					)}

					{/* Employee Profile Cards */}
					{employeeDetails && !isLoading && (
						<div className='space-y-6'>
							{fromReport && (
								<div className='flex justify-end'>
									<button
										onClick={handleDownload}
										disabled={isDownloading}
										className={`flex items-center px-4 py-2 rounded-md ${isDownloading
												? "bg-gray-400"
												: "bg-blue-600 hover:bg-blue-700"
											} text-white`}
									>
										{isDownloading ? (
											<>
												<svg
													className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
												>
													<circle
														className='opacity-25'
														cx='12'
														cy='12'
														r='10'
														stroke='currentColor'
														strokeWidth='4'
													></circle>
													<path
														className='opacity-75'
														fill='currentColor'
														d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
													></path>
												</svg>
												Generating Report...
											</>
										) : (
											<>
												<svg
													className='w-4 h-4 mr-2'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
													/>
												</svg>
												Download Full Report
											</>
										)}
									</button>
								</div>
							)}
							{/* Card 1: Employee Basic Information - Full Width Header */}
							<div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
								<div className='flex items-center mb-4'>
									<div className='bg-blue-500 p-2 rounded-full mr-3'>
										<svg
											className='w-5 h-5 text-white'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
											/>
										</svg>
									</div>
									<h2 className='text-xl font-semibold text-gray-800'>
										Employee Information
									</h2>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<InfoField
											label='Name'
											value={
												employeeDetails.employee.full_name
											}
										/>
										<InfoField
											label='Card No'
											value={
												employeeDetails.employee.employee_code
											}
										/>
										<InfoField
											label='Department'
											value={
												employeeDetails.employee
													.department
											}
										/>
										<InfoField
											label='Designation'
											value={employeeDetails.employee.designation}
										/>

									</div>
								</div>
							</div>

							{/* Grid Layout for remaining cards */}
							<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
								{/* Card 2: Operator Skills */}
								<div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 h-80 flex flex-col'>
									<div className='flex items-center mb-4'>
										<div className='bg-green-500 p-2 rounded-full mr-3'>
											<svg
												className='w-5 h-5 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
												/>
											</svg>
										</div>
										<h2 className='text-xl font-semibold text-gray-800'>
											Operator Skills
										</h2>
									</div>

									<div className='flex-1 overflow-y-auto hide-scrollbar'>
										{employeeDetails.operator_skills
											.length > 0 ? (
											<div className='space-y-3'>
												{employeeDetails.operator_skills.map(
													(skill, index) => (
														<div
															key={index}
															className='bg-gray-50 p-3 rounded border-l-4 border-green-500'
														>
															<h3 className='font-medium text-gray-800 mb-1 text-sm'>
																{skill.operation_name ||
																	"General Skill"}
															</h3>
															<div className='flex justify-between text-xs mb-1'>
																<span className='text-gray-600'>
																	Level:
																</span>
																<span className='font-medium'>
																	{
																		skill.level
																	}
																</span>
															</div>
															<div className='flex justify-between text-xs'>
																<span className='text-gray-600'>
																	Department:
																</span>
																<span className='font-medium text-xs'>
																	{skill.operation_name || 'N/A'}
																</span>
															</div>
														</div>
													)
												)}
											</div>
										) : (
											<div className='flex items-center justify-center h-full text-gray-500'>
												No operator skills recorded
											</div>
										)}
									</div>
								</div>

								{/* Card 3: Multi-Skilling */}
								<div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 h-80 flex flex-col'>
									<div className='flex items-center mb-4'>
										<div className='bg-purple-500 p-2 rounded-full mr-3'>
											<svg
												className='w-5 h-5 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
												/>
											</svg>
										</div>
										<h2 className='text-xl font-semibold text-gray-800'>
											Multi-Skilling
										</h2>
									</div>

									<div className='flex-1 overflow-y-auto hide-scrollbar'>
										{employeeDetails.multi_skilling.length >
											0 ? (
											<div className='space-y-3'>
												{employeeDetails.multi_skilling.map(
													(skill, index) => (
														<div
															key={index}
															className='bg-gray-50 p-3 rounded border-l-4 border-purple-500'
														>
															<div className='flex justify-between items-start mb-1'>
																<h3 className='font-medium text-gray-800 text-sm'>
																	{
																		skill.department_name
																	}
																</h3>
																<span
																	className={`px-2 py-1 text-xs rounded-full ${skill.status ===
																			"active"
																			? "bg-green-100 text-green-800"
																			: skill.status ===
																				"scheduled"
																				? "bg-blue-100 text-blue-800"
																				: "bg-yellow-100 text-yellow-800"
																		}`}
																>
																	{
																		skill.status
																	}
																</span>
															</div>

															<div className='grid grid-cols-2 gap-2 text-xs'>
																{skill.station_number && (
																	<div>
																		<span className='text-gray-600'>
																			Station:
																		</span>
																		<span className='font-medium ml-1'>
																			{
																				skill.station_number
																			}
																		</span>
																	</div>
																)}
																{skill.skill_level_value && (
																	<div>
																		<span className='text-gray-600'>
																			Level:
																		</span>
																		<span className='font-medium ml-1'>
																			{
																				skill.skill_level_value
																			}
																		</span>
																	</div>
																)}
															</div>
														</div>
													)
												)}
											</div>
										) : (
											<div className='flex items-center justify-center h-full text-gray-500'>
												No multi-skilling records
											</div>
										)}
									</div>
								</div>

								{/* Card 4: Scores */}
								<div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 h-80 flex flex-col'>
									<div className='flex items-center mb-4'>
										<div className='bg-yellow-500 p-2 rounded-full mr-3'>
											<svg
												className='w-5 h-5 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
												/>
											</svg>
										</div>
										<h2 className='text-xl font-semibold text-gray-800'>
											Scores & Assessments
										</h2>
									</div>

									<div className='flex-1 overflow-y-auto hide-scrollbar'>
										{employeeDetails.scores.length > 0 ? (
											<div className='space-y-3'>
												{employeeDetails.scores.map(
													(score, index) => (
														<div
															key={index}
															className='bg-gray-50 p-3 rounded border-l-4 border-yellow-500'
														>
															<h3 className='font-medium text-gray-800 mb-1 text-sm'>
																{score.test_name ||
																	"Assessment"}
															</h3>

															<div className='flex justify-between text-xs'>
																<span className='text-gray-600'>
																	Score:
																</span>
																<span className='font-medium'>
																	{
																		score.marks
																	}{" "}
																	(
																	{
																		score.percentage
																	}
																	%)
																</span>
															</div>

															<div className='flex justify-between text-xs mt-1'>
																<span className='text-gray-600'>
																	Date:
																</span>
																<span className='font-medium'>
																	{new Date(
																		score.created_at
																	).toLocaleDateString()}
																</span>
															</div>

															<div className='flex justify-between text-xs mt-1'>
																<span className='text-gray-600'>
																	Result:
																</span>
																<span
																	className={`font-semibold ${score.passed
																			? "text-green-600"
																			: "text-red-600"
																		}`}
																>
																	{score.passed
																		? "Pass"
																		: "Fail"}
																</span>
															</div>
														</div>
													)
												)}
											</div>
										) : (
											<div className='flex items-center justify-center h-full text-gray-500'>
												No assessment scores available
											</div>
										)}
									</div>
								</div>

								{/* Card 5: Refreshment Training */}
								<div className='bg-white p-6 rounded-lg shadow-md border border-gray-200 h-80 flex flex-col'>
									<div className='flex items-center mb-4'>
										<div className='bg-red-500 p-2 rounded-full mr-3'>
											<svg
												className='w-5 h-5 text-white'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
												/>
											</svg>
										</div>
										<h2 className='text-xl font-semibold text-gray-800'>
											Refresher Training
										</h2>
									</div>

									<div className='flex-1 overflow-y-auto hide-scrollbar'>
										{employeeDetails.refreshment_training &&
										employeeDetails.refreshment_training.length > 0 ? (
											<div className='space-y-3'>
												{employeeDetails.refreshment_training.map(
													(training, index) => (
														<div
															key={index}
															className='bg-gray-50 p-3 rounded border-l-4 border-red-500'
														>
															<div className='flex justify-between items-start mb-1'>
																<h3 className='font-medium text-gray-800 text-sm'>
																	{training.training_topic || 'N/A'}
																</h3>
																<span className='text-xs bg-red-100 text-red-800 px-2 py-1 rounded'>
																	Trainer: {training.trainer_name || 'N/A'}
																</span>
															</div>

															<div className='grid grid-cols-2 gap-2 text-xs'>
																<div>
																	<span className='text-gray-600'>
																		Venue:
																	</span>
																	<span className='font-medium ml-1'>
																		{training.venue_name || 'N/A'}
																	</span>
																</div>
																<div>
																	<span className='text-gray-600'>
																		Date:
																	</span>
																	<span className='font-medium ml-1'>
																		{new Date(training.date).toLocaleDateString()}
																	</span>
																</div>
																<div>
																	<span className='text-gray-600'>
																		Time:
																	</span>
																	<span className='font-medium ml-1'>
																		{training.time}
																	</span>
																</div>
																<div>
																	<span className='text-gray-600'>
																		Status:
																	</span>
																	<span className='font-medium ml-1 text-xs'>
																		{training.status}
																	</span>
																</div>
															</div>
														</div>
													)
												)}
											</div>
										) : (
											<div className='flex items-center justify-center h-full text-gray-500'>
												No refresher training
												scheduled
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					)}

					{downloadSuccess && (
						<div className='fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
							<div className='flex items-center'>
								<svg
									className='w-5 h-5 mr-2'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M5 13l4 4L19 7'
									/>
								</svg>
								Report downloaded successfully!
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

// Helper components
const InfoField = ({ label, value }: { label: string; value: string }) => (
	<div className='flex items-start'>
		<span className='text-gray-600 w-28'>{label}:</span>
		<span className='font-medium flex-1'>{value || "N/A"}</span>
	</div>
);

export default EmployeeHistorySearch;

