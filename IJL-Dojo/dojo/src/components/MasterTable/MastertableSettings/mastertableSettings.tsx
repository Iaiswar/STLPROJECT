import { useState, useRef, ChangeEvent, useEffect } from "react";
import { FileUp, Loader2, Plus, X, Bell, CheckCircle } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

interface UploadResponse {
	message: string;
	success_count: number;
	error_count: number;
	errors?: Array<{ row: number; error: string }>;
}

interface OperatorMaster {
	id?: number;
	sr_no?: number;
	employee_code: string;
	full_name: string;
	date_of_join: string | null;
	employee_pattern_category: string;
	designation: string;
	department: string | null;
	department_code: string | null;
}

type FormFieldBase = {
	name: string;
	label: string;
	colSpan: number;
};

type TextField = FormFieldBase & {
	type: "text";
	required?: boolean;
};

type DateField = FormFieldBase & {
	type: "date";
	required?: boolean;
};

type FormField = TextField | DateField;

const MasterTableSettings = () => {
	// Form fields configuration
	const fields: FormField[] = [
		{
			name: "employee_code",
			label: "Employee Code",
			type: "text",
			required: true,
			colSpan: 1,
		},
		{
			name: "full_name",
			label: "Full Name",
			type: "text",
			required: true,
			colSpan: 1,
		},
		{
			name: "date_of_join",
			label: "Date of Join",
			type: "date",
			colSpan: 1,
		},
		{
			name: "employee_pattern_category",
			label: "Pattern Category",
			type: "text",
			colSpan: 1,
		},
		{
			name: "designation",
			label: "Designation",
			type: "text",
			colSpan: 1,
		},
		{
			name: "department",
			label: "Department",
			type: "text",
			colSpan: 1,
		},
		{
			name: "department_code",
			label: "Department Code",
			type: "text",
			colSpan: 1,
		},
	];

	// File upload state
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadResult, setUploadResult] = useState<UploadResponse | null>(
		null
	);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Manual entry state
	const [operators, setOperators] = useState<OperatorMaster[]>([
		{
			employee_code: "",
			full_name: "",
			date_of_join: null,
			employee_pattern_category: "",
			designation: "",
			department: null,
			department_code: null,
		},
	]);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

	// Real-time notification state
	const [recentNotifications, setRecentNotifications] = useState<string[]>(
		[]
	);
	const [showNotificationAlert, setShowNotificationAlert] = useState(false);

	// Function to check for new notifications
	const checkForNewNotifications = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/notifications/`);
			if (response.ok) {
				const data = await response.json();
				const notifications = data.results || data || [];

				// Get the latest notification
				if (notifications.length > 0) {
					const latest = notifications[0];
					const latestTime = new Date(latest.created_at).getTime();
					const fiveSecondsAgo = Date.now() - 5000;

					// If notification is very recent (within 5 seconds), show alert
					if (
						latestTime > fiveSecondsAgo &&
						latest.notification_type === "employee_registration"
					) {
						setRecentNotifications((prev) => [
							latest.title,
							...prev.slice(0, 2),
						]);
						setShowNotificationAlert(true);

						// Auto-hide after 5 seconds
						setTimeout(() => setShowNotificationAlert(false), 5000);
					}
				}
			}
		} catch (error) {
			console.error("Error checking notifications:", error);
		}
	};

	// File upload handlers
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
			setUploadResult(null);
			setUploadError(null);
		}
	};

	const handleUpload = async () => {
		if (!file) {
			setUploadError("Please select a file first");
			return;
		}

		setIsUploading(true);
		setUploadError(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch(
				`${API_BASE_URL}/upload-operator-excel/`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error(`Upload failed with status ${response.status}`);
			}

			const result: UploadResponse = await response.json();
			setUploadResult(result);

			// Check for new notifications after successful upload
			if (result.success_count > 0) {
				setTimeout(() => {
					checkForNewNotifications();
				}, 1000); // Wait 1 second for backend to process
			}
		} catch (err) {
			console.error("Error uploading file:", err);
			setUploadError(
				err instanceof Error ? err.message : "Failed to upload file"
			);
		} finally {
			setIsUploading(false);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	// Manual entry handlers
	const handleOperatorChange = (
		index: number,
		field: keyof OperatorMaster,
		value: string | null
	) => {
		const updatedOperators = [...operators];
		updatedOperators[index] = {
			...updatedOperators[index],
			[field]: value,
		};
		setOperators(updatedOperators);
	};

	const addOperatorCard = () => {
		setOperators([
			...operators,
			{
				employee_code: "",
				full_name: "",
				date_of_join: null,
				employee_pattern_category: "",
				designation: "",
				department: null,
				department_code: null,
			},
		]);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		setSubmitError(null);
		setSubmitSuccess(false);

		// Validate required fields
		const hasErrors = operators.some(
			(operator) =>
				!operator.employee_code.trim() || !operator.full_name.trim()
		);

		if (hasErrors) {
			setSubmitError(
				"Please fill all required fields (Employee Code and Full Name)"
			);
			setIsSubmitting(false);
			return;
		}

		try {
			// Submit each operator individually
			const submissionPromises = operators.map(async (operator) => {
				const data = {
					...operator,
					employee_pattern_category:
						operator.employee_pattern_category || "",
					designation: operator.designation || "",
					department: operator.department || null,
					department_code: operator.department_code || null,
					sr_no: operator.sr_no || 0,
				};

				const response = await fetch(
					`${API_BASE_URL}/operators-master/`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data), // Send individual object instead of array
					}
				);

				if (!response.ok) {
					throw new Error(
						`Submission failed with status ${response.status}`
					);
				}
				return response.json();
			});

			await Promise.all(submissionPromises);
			setSubmitSuccess(true);

			// Check for new notifications after successful submission
			setTimeout(() => {
				checkForNewNotifications();
			}, 1000); // Wait 1 second for backend to process

			// Reset form after successful submission
			setOperators([
				{
					employee_code: "",
					full_name: "",
					date_of_join: null,
					employee_pattern_category: "",
					designation: "",
					department: null,
					department_code: null,
				},
			]);
		} catch (err) {
			console.error("Error submitting operators:", err);
			setSubmitError(
				err instanceof Error
					? err.message
					: "Failed to submit operators"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderField = (
		field: FormField,
		operator: OperatorMaster,
		index: number
	) => {
		const value = operator[field.name as keyof OperatorMaster] || "";

		if (field.type === "date") {
			return (
				<input
					type='date'
					value={value as string}
					onChange={(e) =>
						handleOperatorChange(
							index,
							field.name as keyof OperatorMaster,
							e.target.value || null
						)
					}
					className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>
			);
		}

		// Default to text input
		return (
			<input
				type='text'
				value={value as string}
				onChange={(e) =>
					handleOperatorChange(
						index,
						field.name as keyof OperatorMaster,
						e.target.value || null
					)
				}
				className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
				required={field.required}
			/>
		);
	};

	return (
		<>
			{/* Real-time Notification Alert */}
			{showNotificationAlert && (
				<div className='fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-pulse'>
					<Bell className='h-5 w-5' />
					<div>
						<p className='font-semibold'>🔔 New Notification!</p>
						<p className='text-sm'>
							Employee registration notification created
						</p>
					</div>
					<button
						onClick={() => setShowNotificationAlert(false)}
						className='text-white hover:text-gray-200'
					>
						<X className='h-4 w-4' />
					</button>
				</div>
			)}

			<div className='container mx-auto px-4 py-8'>
				<div className="bg-white rounded-xl shadow-md p-6 mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Master Table Settings </h1>
					{/* File Upload Section */}
					<div className='bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-4'>
						<div className='flex items-center justify-between mb-6 border-b pb-2'>
							<h2 className='text-xl font-semibold text-gray-800 flex items-center'>
								<FileUp className='mr-2' size={20} />
								Upload Master Table
							</h2>
						</div>
						<div className='space-y-4'>
							<div className='flex flex-col space-y-4'>
								<div className='flex items-center space-x-4'>
									<input
										type='file'
										ref={fileInputRef}
										onChange={handleFileChange}
										accept='.xlsx,.xls,.csv'
										className='hidden'
									/>
									<button
										onClick={triggerFileInput}
										className='inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors'
									>
										Select Excel
									</button>
									{file && (
										<div className='flex items-center'>
											<span className='text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md border border-gray-200'>
												{file.name}
											</span>
											<button
												onClick={() => setFile(null)}
												className='ml-2 text-gray-400 hover:text-red-500'
											>
												<X size={16} />
											</button>
										</div>
									)}
								</div>
								<button
									onClick={handleUpload}
									disabled={!file || isUploading}
									className={`inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
										!file
											? "opacity-50 cursor-not-allowed"
											: ""
									}`}
								>
									{isUploading ? (
										<>
											<Loader2
												className='animate-spin mr-2'
												size={16}
											/>
											Uploading...
										</>
									) : (
										"Upload Excel"
									)}
								</button>
							</div>
							{uploadError && (
								<div className='p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200'>
									{uploadError}
								</div>
							)}
							{uploadResult && (
								<div className='p-4 bg-green-50 rounded-lg border border-green-200'>
									<div className='flex items-start'>
										<div className='flex-shrink-0'>
											<svg
												className='h-5 w-5 text-green-400'
												fill='currentColor'
												viewBox='0 0 20 20'
											>
												<path
													fillRule='evenodd'
													d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
													clipRule='evenodd'
												/>
											</svg>
										</div>
										<div className='ml-3'>
											<h3 className='text-sm font-medium text-green-800'>
												Upload successful!
											</h3>
											<div className='mt-2 text-sm text-green-700'>
												<p>
													<span className='font-medium'>
														Success:
													</span>{" "}
													{uploadResult.success_count}{" "}
													records
												</p>
												{uploadResult.success_count >
													0 && (
													<p className='text-green-600 mt-1'>
														📢 Notifications sent to
														administrators for{" "}
														{
															uploadResult.success_count
														}{" "}
														new employee(s)
													</p>
												)}
												{uploadResult.error_count >
													0 && (
													<p>
														<span className='font-medium'>
															Errors:
														</span>{" "}
														{
															uploadResult.error_count
														}{" "}
														records
													</p>
												)}
											</div>
											{uploadResult.errors &&
												uploadResult.errors.length >
													0 && (
													<div className='mt-3 border-t border-green-200 pt-3'>
														<h4 className='text-xs font-medium text-green-800 uppercase tracking-wider'>
															Error details:
														</h4>
														<ul className='mt-2 space-y-1'>
															{uploadResult.errors.map(
																(error, i) => (
																	<li
																		key={i}
																		className='text-xs text-green-700'
																	>
																		Row{" "}
																		{
																			error.row
																		}
																		:{" "}
																		{
																			error.error
																		}
																	</li>
																)
															)}
														</ul>
													</div>
												)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
					{/* Manual Entry Section */}
					<div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
						<h2 className='text-xl font-semibold mb-6 text-gray-800 border-b pb-2'>
							Manual Entry
						</h2>
						<div className='space-y-6'>
							{operators.map((operator, index) => (
								<div
									key={index}
									className='border rounded-lg p-4 relative'
								>
									{/* {operators.length > 1 && (
												<button
												onClick={() => removeOperatorCard(index)}
												className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
												aria-label="Remove operator"
												>
												<X size={18} />
												</button>
											)} */}
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										{fields.map((field) => (
											<div
												key={field.name}
												className={`col-span-1`}
											>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													{field.label}
													{field.required && (
														<span className='text-red-500'>
															{" "}
															*
														</span>
													)}
												</label>
												{renderField(
													field,
													operator,
													index
												)}
											</div>
										))}
									</div>
								</div>
							))}
							<button
								onClick={addOperatorCard}
								className='flex items-center px-4 py-2 text-blue-600 hover:text-blue-800'
							>
								<Plus className='mr-2' size={18} />
								Add Another Operator
							</button>
							<div className='pt-4'>
								<button
									onClick={handleSubmit}
									disabled={isSubmitting}
									className={`w-full flex justify-center items-center px-4 py-2 rounded-md text-white ${
										isSubmitting
											? "bg-blue-300"
											: "bg-blue-600 hover:bg-blue-700"
									}`}
								>
									{isSubmitting ? (
										<>
											<Loader2
												className='animate-spin mr-2'
												size={18}
											/>
											Submitting...
										</>
									) : (
										"Submit Operators"
									)}
								</button>
							</div>
							{submitError && (
								<div className='p-3 bg-red-50 text-red-700 rounded-md border border-red-200'>
									{submitError}
								</div>
							)}
							{submitSuccess && (
								<div className='p-4 bg-green-50 text-green-700 rounded-md border border-green-200'>
									<div className='flex items-center space-x-2'>
										<CheckCircle className='h-5 w-5 text-green-600' />
										<div>
											<p className='font-semibold'>
												Operators submitted
												successfully!
											</p>
											<p className='text-sm text-green-600'>
												📢 Notifications have been sent
												to administrators about the new
												employee registrations.
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MasterTableSettings;
