import { useState, useEffect } from "react";
import CardProps from "./AdvanceCard/Cardprops";
import Absenteeism from "./Graphs/Absenteeism/absenteeism";
import AttritionTrendChart from "./Graphs/Attrition/attrition";
import BufferManpowerAvailability from "./Graphs/BufferManpowerAvailability/BufferManpower";
import OperatorStats from "./OperatorStats/OperatorStatsRedirect";
import ManpowerTrendChart from "./Graphs/Manpower/Manpower";
import ManpowerActions from "./ManpowerActions/ManpowerActions";

interface Factory {
	id: number;
	name: string;
	hq?: string;
}

interface Department {
	id: number;
	name: string;
}

const Advanced = () => {
	const [factories, setFactories] = useState<Factory[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
		null
	);
	const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
	const [loadingFactories, setLoadingFactories] = useState<boolean>(true);
	const [loadingDepartments, setLoadingDepartments] =
		useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [stationType, setStationType] = useState<string>("CTQ"); // Track station type for display

	useEffect(() => {
		const fetchFactories = async () => {
			try {
				const response = await fetch(
					"http://127.0.0.1:8000/factories/"
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: Factory[] = await response.json();
				setFactories(data);
				if (data.length > 0) {
					setSelectedFactory(data[0].id);
				}
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred");
				}
			} finally {
				setLoadingFactories(false);
			}
		};

		fetchFactories();
	}, []);

	useEffect(() => {
		if (!selectedFactory) return;

		const fetchDepartments = async () => {
			setLoadingDepartments(true);
			try {
				const response = await fetch(
					`http://127.0.0.1:8000/departments-by-factory/?factory=${selectedFactory}`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: Department[] = await response.json();
				setDepartments(data);
				if (data.length > 0) {
					setSelectedDepartment(data[0].id);
					// Determine if first department is PDI or CTQ based on name
					setStationType(
						data[0].name.includes("PDI") ? "PDI" : "CTQ"
					);
				}
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError(
						"An unknown error occurred while fetching departments"
					);
				}
			} finally {
				setLoadingDepartments(false);
			}
		};

		fetchDepartments();
	}, [selectedFactory]);

	const handleFactoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const factoryId = parseInt(e.target.value);
		setSelectedFactory(factoryId);
		setDepartments([]);
		setSelectedDepartment(null);
	};

	const handleDepartmentChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		if (e.target.value === "all") {
			setSelectedDepartment(null); // All departments selected
		} else {
			const deptId = parseInt(e.target.value);
			setSelectedDepartment(deptId);
			// Determine if department is PDI or CTQ based on name
			const selectedDept = departments.find((dept) => dept.id === deptId);
			if (selectedDept) {
				setStationType(
					selectedDept.name.includes("PDI") ? "PDI" : "CTQ"
				);
			}
		}
	};

	const buildUrl = () => {
		if (selectedFactory && selectedDepartment) {
			return `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${selectedFactory}&department_id=${selectedDepartment}`;
		}
		if (selectedFactory) {
			return `http://127.0.0.1:8000/manpower-ctq-trends/?factory_id=${selectedFactory}`;
		}
		return "";
	};

	const getCardTitle = () => {
		if (!selectedDepartment) {
			return "Total Stations"; // When "All Departments" is selected
		}
		return `Total ${stationType} Stations`; // When specific department is selected
	};

	const manpowerShortageActions = [
		"Buffer manpower planning",
		"Salary revision",
		"Special perks",
	];

	return (
		<>
            <div className="w-full mx-auto flex flex-col">
				<div>
					<div className='bg-black mb-4 md:mb-6 mt-3'>
						<h4 className='text-2xl md:text-3xl font-bold text-white text-center py-5'>
							Advanced Manpower Planning Dashboard
						</h4>
					</div>
				</div>

				<div className="w-full mx-auto flex flex-col px-2 sm:px-4">
					{/* Mobile Layout - Column */}
					<div className='flex flex-col lg:hidden gap-4'>
						<div className='w-full'>
							<CardProps
								getUrl={buildUrl()}
								subtopics={[
									{
										dataKey: "total_stations_ctq",
										displayText: getCardTitle(),
									},
									{
										dataKey: "operator_required_ctq",
										displayText: "Operators Required",
									},
									{
										dataKey: "operator_availability_ctq",
										displayText: "Operators Available",
									},
									{
										dataKey: "buffer_manpower_required_ctq",
										displayText: "Buff Manpower Required",
									},
									{
										dataKey: "buffer_manpower_availability_ctq",
										displayText: "Buff Manpower Available",
									},
								]}
								cardColors={[
									"#1f1f1f",
									"#0056b3",
									"#0056b3",
									"#1f1f1f",
									"#1f1f1f",
								]}
							/>
						</div>
						<div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200'>
							<div className='flex flex-col gap-3 sm:gap-4'>
								<div>
									<label
										htmlFor='plant'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										Factory
									</label>
									{loadingFactories ? (
										<div className='w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-100 animate-pulse'>
											Loading factories...
										</div>
									) : error ? (
										<div className='text-red-500 text-sm'>
											{error}
										</div>
									) : (
										<select
											id='plant'
											className='w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
											onChange={handleFactoryChange}
											value={selectedFactory || ""}
										>
											<option value=''>
												Select a factory
											</option>
											{factories.map((factory) => (
												<option
													key={factory.id}
													value={factory.id}
												>
													{factory.name}
												</option>
											))}
										</select>
									)}
								</div>
								<div>
									<label
										htmlFor='department'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										Department
									</label>
									{loadingDepartments ? (
										<div className='w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-100 animate-pulse'>
											Loading departments...
										</div>
									) : !selectedFactory ? (
										<select
											id='department'
											className='w-full rounded-md border border-gray-300 py-2 px-3 text-gray-400'
											disabled
										>
											<option value=''>
												Select a factory first
											</option>
										</select>
									) : departments.length === 0 ? (
										<select
											id='department'
											className='w-full rounded-md border border-gray-300 py-2 px-3 text-gray-400'
											disabled
										>
											<option value=''>
												No departments found
											</option>
										</select>
									) : (
										<select
											id='department'
											className='w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
											onChange={handleDepartmentChange}
											value={selectedDepartment || "all"}
										>
											<option value='all'>
												All Departments
											</option>
											{departments.map((department) => (
												<option
													key={department.id}
													value={department.id}
												>
													{department.name}
												</option>
											))}
										</select>
									)}
								</div>
							</div>
						</div>
						<div className='flex-1'>
							<OperatorStats
								factoryId={selectedFactory}
								departmentId={selectedDepartment}
							/>
						</div>
						<div className='flex flex-col gap-4'>
							<ManpowerTrendChart
								factoryId={selectedFactory}
								departmentId={selectedDepartment}
							/>
							<AttritionTrendChart
								factoryId={selectedFactory}
								departmentId={selectedDepartment}
							/>
							<BufferManpowerAvailability
								factoryId={selectedFactory}
								departmentId={selectedDepartment}
							/>
							<Absenteeism
								factoryId={selectedFactory}
								departmentId={selectedDepartment}
							/>
						</div>
					</div>
					{/* Desktop Layout - Row */}
					<div className='hidden lg:flex flex-row gap-4 md:gap-6 p-2'>
						<div className='flex-1 flex flex-col gap-4 md:gap-6 min-w-[60%]'>
							<div className='w-full'>
								<CardProps
									getUrl={buildUrl()}
									subtopics={[
										{
											dataKey: "total_stations_ctq",
											displayText: getCardTitle(),
										},
										{
											dataKey: "operator_required_ctq",
											displayText: "Operators Required",
										},
										{
											dataKey: "operator_availability_ctq",
											displayText: "Operators Available",
										},
										{
											dataKey: "buffer_manpower_required_ctq",
											displayText: "Buff Manpower Required",
										},
										{
											dataKey:
												"buffer_manpower_availability_ctq",
											displayText: "Buff Manpower Available",
										},
									]}
									cardColors={[
										"#6B7280",
										"#0056b3",
										"#0056b3",
										"#1f1f1f",
										"#1f1f1f",
									]}
								/>
							</div>
							<div className='flex flex-col gap-4 md:gap-6 min-w-0 overflow-x-auto'>
								<div className='flex flex-col xl:flex-row gap-4 md:gap-6 min-w-[800px] xl:min-w-0'>
									<div className='w-full xl:w-1/2'>
										<ManpowerTrendChart
											factoryId={selectedFactory}
											departmentId={selectedDepartment}
										/>
									</div>
									<div className='w-full xl:w-1/2'>
										<AttritionTrendChart
											factoryId={selectedFactory}
											departmentId={selectedDepartment}
										/>
									</div>
								</div>
								<div className='flex flex-col xl:flex-row gap-4 md:gap-6 min-w-[800px] xl:min-w-0'>
									<div className='w-full xl:w-1/2'>
										<BufferManpowerAvailability
											factoryId={selectedFactory}
											departmentId={selectedDepartment}
										/>
									</div>
									<div className='w-full xl:w-1/2'>
										<Absenteeism
											factoryId={selectedFactory}
											departmentId={selectedDepartment}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className='w-[20%] min-w-[300px] flex flex-col gap-4 sm:gap-6 pt-0 sm:pt-6 overflow-y-auto'>
							<div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200'>
								<div className='flex flex-col gap-3 sm:gap-4'>
									<div>
										<label
											htmlFor='plant'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											Factory
										</label>
										{loadingFactories ? (
											<div className='w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-100 animate-pulse'>
												Loading factories...
											</div>
										) : error ? (
											<div className='text-red-500 text-sm'>
												{error}
											</div>
										) : (
											<select
												id='plant'
												className='w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
												onChange={handleFactoryChange}
												value={selectedFactory || ""}
											>
												<option value=''>
													Select a factory
												</option>
												{factories.map((factory) => (
													<option
														key={factory.id}
														value={factory.id}
													>
														{factory.name}
													</option>
												))}
											</select>
										)}
									</div>
									<div>
										<label
											htmlFor='department'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											Department
										</label>
										{loadingDepartments ? (
											<div className='w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-100 animate-pulse'>
												Loading departments...
											</div>
										) : !selectedFactory ? (
											<select
												id='department'
												className='w-full rounded-md border border-gray-300 py-2 px-3 text-gray-400'
												disabled
											>
												<option value=''>
													Select a factory first
												</option>
											</select>
										) : departments.length === 0 ? (
											<select
												id='department'
												className='w-full rounded-md border border-gray-300 py-2 px-3 text-gray-400'
												disabled
											>
												<option value=''>
													No departments found
												</option>
											</select>
										) : (
											<select
												id='department'
												className='w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
												onChange={handleDepartmentChange}
												value={selectedDepartment || "all"}
											>
												{/* <option value="all">All Departments</option> */}
												{departments.map((department) => (
													<option
														key={department.id}
														value={department.id}
													>
														{department.name}
													</option>
												))}
											</select>
										)}
									</div>
								</div>
							</div>
							<div className='flex-1'>
								<OperatorStats
									factoryId={selectedFactory}
									departmentId={selectedDepartment}
								/>
							</div>
							<div className='flex-1'>
								<ManpowerActions
									title='Actions Planned for Manpower Shortage'
									data={manpowerShortageActions}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Advanced;
