import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../user/Slice/UserSlice";
import { AppDispatch, RootState } from "../../store/store";
import { currentRole } from "../Login/Slice/LoginSlice";

interface ApiError {
	message?: string;
	errors?: {
		[key: string]: string;
	};
}

interface AuthState {
	loading: boolean;
	error: ApiError | null;
}

const ROLE_CHOICES = [
	{ value: "developer", label: "Developer" },
	{ value: "management", label: "Management" },
	{ value: "admin", label: "Admin" },
	{ value: "instructor", label: "Instructor" },
];

interface HQ {
	id: number;
	name: string;
}

interface Factory {
	id: number;
	name: string;
	hq: number;
}

interface Department {
	id: number;
	name: string;
	factory: number;
}

const AddUserForm: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const userRole = useSelector(currentRole);
	const { loading, error } = useSelector(
		(state: RootState) => state.auth as AuthState
	);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		employeeid: "",
		role: "",
		first_name: "",
		last_name: "",
		hq: "",
		factory: "",
		department: "",
	});

	const [errors, setErrors] = useState({
		email: false,
		password: false,
		employeeid: false,
		role: false,
		first_name: false,
		last_name: false,
		hq: false,
		factory: false,
		department: false,
	});

	const [modalState, setModalState] = useState({
		isModalOpen: false,
		successMessage: "",
		errorMessage: "",
	});

	const [hqs, setHqs] = useState<HQ[]>([]);
	const [factories, setFactories] = useState<Factory[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);

	useEffect(() => {
		const fetchHqs = async () => {
			try {
				const response = await fetch("http://127.0.0.1:8000/hq/");
				const data = await response.json();
				setHqs(data);
			} catch (err) {
				console.error("Failed to fetch HQs:", err);
			}
		};
		fetchHqs();

		return () => {
			dispatch(clearError());
		};
	}, [dispatch]);

	const handleHqChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const hqId = e.target.value;
		setFormData({
			...formData,
			hq: hqId,
			factory: "",
			department: "",
		});

		if (hqId) {
			try {
				const response = await fetch("http://127.0.0.1:8000/factories/");
				const data = await response.json();
				setFactories(data);
				setDepartments([]);
			} catch (err) {
				console.error("Failed to fetch factories:", err);
			}
		} else {
			setFactories([]);
			setDepartments([]);
		}
	};

	const handleFactoryChange = async (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const factoryId = e.target.value;
		setFormData({
			...formData,
			factory: factoryId,
			department: "",
		});

		if (factoryId) {
			try {
				const response = await fetch("http://127.0.0.1:8000/departments/");
				const data = await response.json();
				setDepartments(data);
			} catch (err) {
				console.error("Failed to fetch departments:", err);
			}
		} else {
			setDepartments([]);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		});

		setErrors({
			...errors,
			[name]: false,
		});

		if (error) {
			dispatch(clearError());
		}
	};

	const validatePassword = (password: string) => {
		const regex =
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|;:',.<>?/]).{6,}$/;
		return regex.test(password);
	};

	const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const {
			first_name,
			last_name,
			email,
			password,
			employeeid,
			role,
			hq,
			factory,
			department,
		} = formData;

		const newErrors = {
			first_name: !first_name,
			last_name: !last_name,
			email: !email,
			password: !password || !validatePassword(password),
			employeeid: !employeeid,
			role: !role,
			hq: !hq,
			factory: !factory,
			department: !department,
		};

		if (Object.values(newErrors).some((error) => error)) {
			setErrors(newErrors);
			return;
		}

		try {
			const resultAction = await dispatch(registerUser(formData));

			if (registerUser.fulfilled.match(resultAction)) {
				setModalState({
					isModalOpen: true,
					successMessage: "User added successfully!",
					errorMessage: "",
				});

				// ✅ Clear form
				setFormData({
					email: "",
					password: "",
					employeeid: "",
					role: "",
					first_name: "",
					last_name: "",
					hq: "",
					factory: "",
					department: "",
				});

				// ✅ Show success message
				window.alert("User added successfully!");
			} else if (registerUser.rejected.match(resultAction)) {
				setModalState({
					isModalOpen: true,
					successMessage: "",
					errorMessage: "Failed to add user. Please try again.",
				});
			}
		} catch (err) {
			setModalState({
				isModalOpen: true,
				successMessage: "",
				errorMessage: "An unexpected error occurred",
			});
		}
	};

	const handleModalClose = () => {
		setModalState({ ...modalState, isModalOpen: false });
		if (modalState.successMessage) {
			navigate("/");
		}
	};

	if (userRole !== "admin") {
		return (
			<h2 className="text-center text-red-600 font-semibold mt-10">
				Not enough credentials to access this page.
			</h2>
		);
	}

	const getFieldError = (fieldName: string) => {
		if (error?.errors?.[fieldName]) {
			return error.errors[fieldName];
		}
		return null;
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-white rounded-xl shadow-md p-6 mb-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
					User Management
				</h1>

				<section className="mb-10 p-6 bg-gray-50 rounded-lg">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">
						Add New User
					</h2>

					{error?.message && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-center">
							<p className="text-sm text-red-700">
								{error.message}
							</p>
						</div>
					)}

					<form onSubmit={handleAddUser} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[
								{
									id: "first_name",
									label: "First Name",
									type: "text",
								},
								{
									id: "last_name",
									label: "Last Name",
									type: "text",
								},
								{ id: "email", label: "Email", type: "email" },
								{
									id: "password",
									label: "Password",
									type: "password",
									placeholder:
										"Password (must include uppercase, lowercase, number, and special character)",
								},
								{
									id: "employeeid",
									label: "Employee ID",
									type: "text",
								},
							].map(({ id, label, type, placeholder }) => (
								<div key={id} className="flex flex-col">
									<label
										htmlFor={id}
										className="block text-sm font-medium text-gray-600 mb-1"
									>
										{label}{" "}
										<span className="text-red-500">*</span>
									</label>
									<input
										type={type}
										id={id}
										name={id}
										value={
											formData[
												id as keyof typeof formData
											]
										}
										onChange={handleInputChange}
										className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
											errors[id as keyof typeof errors] ||
											getFieldError(id)
												? "border-red-500"
												: "border-gray-300"
										}`}
										placeholder={
											placeholder || `Enter ${label}`
										}
									/>
									{errors[id as keyof typeof errors] && (
										<p className="text-red-500 text-xs mt-1">
											{label} is required.
										</p>
									)}
									{getFieldError(id) && (
										<p className="text-red-500 text-xs mt-1">
											{getFieldError(id)}
										</p>
									)}
								</div>
							))}

							{/* HQ Dropdown */}
							<div className="flex flex-col">
								<label htmlFor="hq" className="block text-sm font-medium text-gray-600 mb-1">
									HQ <span className="text-red-500">*</span>
								</label>
								<select
									id="hq"
									name="hq"
									value={formData.hq}
									onChange={handleHqChange}
									className={`w-full px-3 py-2 border rounded-md shadow-sm ${
										errors.hq ? "border-red-500" : "border-gray-300"
									}`}
								>
									<option value="">Select HQ</option>
									{hqs.map((hq: HQ) => (
										<option key={hq.id} value={hq.id}>
											{hq.name}
										</option>
									))}
								</select>
								{errors.hq && (
									<p className="text-red-500 text-xs mt-1">HQ is required.</p>
								)}
								{getFieldError("hq") && (
									<p className="text-red-500 text-xs mt-1">{getFieldError("hq")}</p>
								)}
							</div>

							{/* Factory Dropdown */}
							<div className="flex flex-col">
								<label htmlFor="factory" className="block text-sm font-medium text-gray-600 mb-1">
									Factory <span className="text-red-500">*</span>
								</label>
								<select
									id="factory"
									name="factory"
									value={formData.factory}
									onChange={handleFactoryChange}
									disabled={!formData.hq}
									className={`w-full px-3 py-2 border rounded-md shadow-sm ${
										errors.factory ? "border-red-500" : "border-gray-300"
									} ${!formData.hq ? "bg-gray-100" : ""}`}
								>
									<option value="">Select Factory</option>
									{factories.map((factory) => (
										<option key={factory.id} value={factory.id}>
											{factory.name}
										</option>
									))}
								</select>
								{errors.factory && (
									<p className="text-red-500 text-xs mt-1">Factory is required.</p>
								)}
								{getFieldError("factory") && (
									<p className="text-red-500 text-xs mt-1">{getFieldError("factory")}</p>
								)}
							</div>

							{/* Department Dropdown */}
							<div className="flex flex-col">
								<label htmlFor="department" className="block text-sm font-medium text-gray-600 mb-1">
									Department <span className="text-red-500">*</span>
								</label>
								<select
									id="department"
									name="department"
									value={formData.department}
									onChange={handleInputChange}
									disabled={!formData.factory}
									className={`w-full px-3 py-2 border rounded-md shadow-sm ${
										errors.department ? "border-red-500" : "border-gray-300"
									} ${!formData.factory ? "bg-gray-100" : ""}`}
								>
									<option value="">Select Department</option>
									{departments.map((dept) => (
										<option key={dept.id} value={dept.id}>
											{dept.name}
										</option>
									))}
								</select>
								{errors.department && (
									<p className="text-red-500 text-xs mt-1">Department is required.</p>
								)}
								{getFieldError("department") && (
									<p className="text-red-500 text-xs mt-1">{getFieldError("department")}</p>
								)}
							</div>

							{/* Role Dropdown */}
							<div className="flex flex-col">
								<label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-1">
									Role <span className="text-red-500">*</span>
								</label>
								<select
									id="role"
									name="role"
									value={formData.role}
									onChange={handleInputChange}
									className={`w-full px-3 py-2 border rounded-md shadow-sm ${
										errors.role ? "border-red-500" : "border-gray-300"
									}`}
								>
									<option value="">Select Role</option>
									{ROLE_CHOICES.map((role) => (
										<option key={role.value} value={role.value}>
											{role.label}
										</option>
									))}
								</select>
								{errors.role && (
									<p className="text-red-500 text-xs mt-1">Role is required.</p>
								)}
								{getFieldError("role") && (
									<p className="text-red-500 text-xs mt-1">{getFieldError("role")}</p>
								)}
							</div>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								disabled={loading}
								className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "Adding..." : "Add User"}
							</button>
						</div>
					</form>
				</section>
			</div>
		</div>
	);
};

export default AddUserForm;



// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { registerUser, clearError } from "../user/Slice/UserSlice";
// import { AppDispatch, RootState } from "../../store/store";
// import { currentRole } from "../Login/Slice/LoginSlice";

// interface ApiError {
// 	message?: string;
// 	errors?: {
// 		[key: string]: string;
// 	};
// }

// interface AuthState {
// 	loading: boolean;
// 	error: ApiError | null;
// 	// Add other auth state properties if needed
// }

// const ROLE_CHOICES = [
// 	{ value: "developer", label: "Developer" },
// 	{ value: "management", label: "Management" },
// 	{ value: "admin", label: "Admin" },
// 	{ value: "instructor", label: "Instructor" },
// ];

// interface HQ {
// 	id: number;
// 	name: string;
// }

// interface Factory {
// 	id: number;
// 	name: string;
// 	hq: number;
// }

// interface Department {
// 	id: number;
// 	name: string;
// 	factory: number;
// }

// const AddUserForm: React.FC = () => {
// 	const dispatch = useDispatch<AppDispatch>();
// 	const navigate = useNavigate();

// 	const userRole = useSelector(currentRole);
// 	const { loading, error } = useSelector(
// 		(state: RootState) => state.auth as AuthState
// 	);

// 	const [formData, setFormData] = useState({
// 		email: "",
// 		password: "",
// 		employeeid: "",
// 		role: "",
// 		first_name: "",
// 		last_name: "",
// 		hq: "",
// 		factory: "",
// 		department: "",
// 	});

// 	const [errors, setErrors] = useState({
// 		email: false,
// 		password: false,
// 		employeeid: false,
// 		role: false,
// 		first_name: false,
// 		last_name: false,
// 		hq: false,
// 		factory: false,
// 		department: false,
// 	});

// 	const [modalState, setModalState] = useState({
// 		isModalOpen: false,
// 		successMessage: "",
// 		errorMessage: "",
// 	});

// 	const [hqs, setHqs] = useState<HQ[]>([]);
// 	const [factories, setFactories] = useState<Factory[]>([]);
// 	const [departments, setDepartments] = useState<Department[]>([]);

// 	// Fetch HQs on component mount
// 	useEffect(() => {
// 		const fetchHqs = async () => {
// 			try {
// 				const response = await fetch("http://127.0.0.1:8000/hq/");
// 				const data = await response.json();
// 				console.log(data);
// 				setHqs(data);
// 			} catch (err) {
// 				console.error("Failed to fetch HQs:", err);
// 			}
// 		};
// 		fetchHqs();

// 		return () => {
// 			dispatch(clearError());
// 		};
// 	}, [dispatch]);

// 	// Fetch factories when HQ is selected
// 	const handleHqChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		const hqId = e.target.value;
// 		setFormData({
// 			...formData,
// 			hq: hqId,
// 			factory: "",
// 			department: "",
// 		});

// 		if (hqId) {
// 			try {
// 				const response = await fetch(
// 					`http://127.0.0.1:8000/factories/`
// 				);
// 				const data = await response.json();
// 				setFactories(data);
// 				setDepartments([]);
// 			} catch (err) {
// 				console.error("Failed to fetch factories:", err);
// 			}
// 		} else {
// 			setFactories([]);
// 			setDepartments([]);
// 		}
// 	};

// 	// Fetch departments when factory is selected
// 	const handleFactoryChange = async (
// 		e: React.ChangeEvent<HTMLSelectElement>
// 	) => {
// 		const factoryId = e.target.value;
// 		setFormData({
// 			...formData,
// 			factory: factoryId,
// 			department: "",
// 		});

// 		if (factoryId) {
// 			try {
// 				const response = await fetch(
// 					`http://127.0.0.1:8000/departments/`
// 				);
// 				const data = await response.json();
// 				setDepartments(data);
// 			} catch (err) {
// 				console.error("Failed to fetch departments:", err);
// 			}
// 		} else {
// 			setDepartments([]);
// 		}
// 	};

// 	const handleInputChange = (
// 		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
// 	) => {
// 		const { name, value } = e.target;

// 		setFormData({
// 			...formData,
// 			[name]: value,
// 		});

// 		setErrors({
// 			...errors,
// 			[name]: false,
// 		});

// 		if (error) {
// 			dispatch(clearError());
// 		}
// 	};

// 	const validatePassword = (password: string) => {
// 		const regex =
// 			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|;:',.<>?/]).{6,}$/;
// 		return regex.test(password);
// 	};

// 	const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
// 		e.preventDefault();

// 		const {
// 			first_name,
// 			last_name,
// 			email,
// 			password,
// 			employeeid,
// 			role,
// 			hq,
// 			factory,
// 			department,
// 		} = formData;

// 		const newErrors = {
// 			first_name: !first_name,
// 			last_name: !last_name,
// 			email: !email,
// 			password: !password || !validatePassword(password),
// 			employeeid: !employeeid,
// 			role: !role,
// 			hq: !hq,
// 			factory: !factory,
// 			department: !department,
// 		};

// 		if (Object.values(newErrors).some((error) => error)) {
// 			setErrors(newErrors);
// 			return;
// 		}

// 		try {
// 			const resultAction = await dispatch(registerUser(formData));

// 			if (registerUser.fulfilled.match(resultAction)) {
// 				setModalState({
// 					isModalOpen: true,
// 					successMessage: "User added successfully!",
// 					errorMessage: "",
// 				});
// 			} else if (registerUser.rejected.match(resultAction)) {
// 				setModalState({
// 					isModalOpen: true,
// 					successMessage: "",
// 					errorMessage: "Failed to add user. Please try again.",
// 					//  errorMessage: resultAction.payload?.error || "Failed to add user. Please try again.",
// 				});
// 			}
// 		} catch (err) {
// 			setModalState({
// 				isModalOpen: true,
// 				successMessage: "",
// 				errorMessage: "An unexpected error occurred",
// 			});
// 		}
// 	};

// 	const handleModalClose = () => {
// 		setModalState({ ...modalState, isModalOpen: false });
// 		if (modalState.successMessage) {
// 			navigate("/");
// 		}
// 	};

// 	if (userRole !== "admin") {
// 		return (
// 			<h2 className='text-center text-red-600 font-semibold mt-10'>
// 				Not enough credentials to access this page.
// 			</h2>
// 		);
// 	}

// 	const getFieldError = (fieldName: string) => {
// 		if (error?.errors?.[fieldName]) {
// 			return error.errors[fieldName];
// 		}
// 		return null;
// 	};

// 	return (
// 		// <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
// 		//   <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add User</h2>

// 		//   {error?.message && (
// 		//     <div className="text-red-600 text-sm mb-4 text-center">{error.message}</div>
// 		//   )}

// 		//   <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
// 		//     {[
// 		//       { id: 'first_name', label: 'First Name', type: 'text' },
// 		//       { id: 'last_name', label: 'Last Name', type: 'text' },
// 		//       { id: 'email', label: 'Email', type: 'email' },
// 		//       { id: 'password', label: 'Password', type: 'password', placeholder: 'Password (must include uppercase, lowercase, number, and special character)' },
// 		//       { id: 'employeeid', label: 'Employee ID', type: 'text' },
// 		//     ].map(({ id, label, type, placeholder }) => (
// 		//       <div key={id} className="flex flex-col">
// 		//         <label htmlFor={id} className="font-medium text-sm mb-1 text-gray-700">{label}</label>
// 		//         <input
// 		//           type={type}
// 		//           id={id}
// 		//           name={id}
// 		//           value={formData[id as keyof typeof formData]}
// 		//           onChange={handleInputChange}
// 		//           className={`border rounded px-3 py-2 text-sm ${errors[id as keyof typeof errors] || getFieldError(id) ? 'border-red-500' : 'border-gray-300'}`}
// 		//           placeholder={placeholder || `Enter ${label}`}
// 		//         />
// 		//         {errors[id as keyof typeof errors] && <p className="text-red-500 text-xs mt-1">{label} is required.</p>}
// 		//         {getFieldError(id) && <p className="text-red-500 text-xs mt-1">{getFieldError(id)}</p>}
// 		//       </div>
// 		//     ))}

// 		//     {/* HQ Dropdown */}
// 		//     {/* HQ Dropdown */}
// 		//     <div className="flex flex-col">
// 		//       <label htmlFor="hq" className="font-medium text-sm mb-1 text-gray-700">HQ</label>
// 		//       <select
// 		//         id="hq"
// 		//         name="hq"
// 		//         value={formData.hq}
// 		//         onChange={handleHqChange}
// 		//         className={`border rounded px-3 py-2 text-sm ${errors.hq ? 'border-red-500' : 'border-gray-300'}`}
// 		//       >
// 		//         <option value="">Select HQ</option>
// 		//         {hqs.map((hq: HQ) => (
// 		//           <option key={hq.id} value={hq.id}>{hq.name}</option>
// 		//         ))}
// 		//       </select>
// 		//       {errors.hq && <p className="text-red-500 text-xs mt-1">HQ is required.</p>}
// 		//       {getFieldError('hq') && <p className="text-red-500 text-xs mt-1">{getFieldError('hq')}</p>}
// 		//     </div>

// 		//     {/* Factory Dropdown */}
// 		//     <div className="flex flex-col">
// 		//       <label htmlFor="factory" className="font-medium text-sm mb-1 text-gray-700">Factory</label>
// 		//       <select
// 		//         id="factory"
// 		//         name="factory"
// 		//         value={formData.factory}
// 		//         onChange={handleFactoryChange}
// 		//         disabled={!formData.hq}
// 		//         className={`border rounded px-3 py-2 text-sm ${errors.factory ? 'border-red-500' : 'border-gray-300'} ${!formData.hq ? 'bg-gray-100' : ''}`}
// 		//       >
// 		//         <option value="">Select Factory</option>
// 		//         {factories.map(factory => (
// 		//           <option key={factory.id} value={factory.id}>{factory.name}</option>
// 		//         ))}
// 		//       </select>
// 		//       {errors.factory && <p className="text-red-500 text-xs mt-1">Factory is required.</p>}
// 		//       {getFieldError('factory') && <p className="text-red-500 text-xs mt-1">{getFieldError('factory')}</p>}
// 		//     </div>

// 		//     {/* Department Dropdown */}
// 		//     <div className="flex flex-col">
// 		//       <label htmlFor="department" className="font-medium text-sm mb-1 text-gray-700">Department</label>
// 		//       <select
// 		//         id="department"
// 		//         name="department"
// 		//         value={formData.department}
// 		//         onChange={handleInputChange}
// 		//         disabled={!formData.factory}
// 		//         className={`border rounded px-3 py-2 text-sm ${errors.department ? 'border-red-500' : 'border-gray-300'} ${!formData.factory ? 'bg-gray-100' : ''}`}
// 		//       >
// 		//         <option value="">Select Department</option>
// 		//         {departments.map(dept => (
// 		//           <option key={dept.id} value={dept.id}>{dept.name}</option>
// 		//         ))}
// 		//       </select>
// 		//       {errors.department && <p className="text-red-500 text-xs mt-1">Department is required.</p>}
// 		//       {getFieldError('department') && <p className="text-red-500 text-xs mt-1">{getFieldError('department')}</p>}
// 		//     </div>

// 		//     {/* Role Dropdown */}
// 		//     <div className="flex flex-col">
// 		//       <label htmlFor="role" className="font-medium text-sm mb-1 text-gray-700">Role</label>
// 		//       <select
// 		//         id="role"
// 		//         name="role"
// 		//         value={formData.role}
// 		//         onChange={handleInputChange}
// 		//         className={`border rounded px-3 py-2 text-sm ${errors.role || getFieldError('role') ? 'border-red-500' : 'border-gray-300'}`}
// 		//       >
// 		//         <option value="">Select a role</option>
// 		//         {ROLE_CHOICES.map((role) => (
// 		//           <option key={role.value} value={role.value}>{role.label}</option>
// 		//         ))}
// 		//       </select>
// 		//       {errors.role && <p className="text-red-500 text-xs mt-1">Role is required.</p>}
// 		//       {getFieldError('role') && <p className="text-red-500 text-xs mt-1">{getFieldError('role')}</p>}
// 		//     </div>

// 		//     <div className="md:col-span-2">
// 		//       <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-700 text-white font-bold text-sm rounded hover:bg-indigo-800 transition">
// 		//         {loading ? "Adding..." : "Add User"}
// 		//       </button>
// 		//     </div>
// 		//   </form>
// 		// </div>
// 		<div className='container mx-auto px-4 py-8'>
// 			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
// 				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
// 					User Management
// 				</h1>

// 				<section className='mb-10 p-6 bg-gray-50 rounded-lg'>
// 					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
// 						Add New User
// 					</h2>

// 					{error?.message && (
// 						<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-center'>
// 							<p className='text-sm text-red-700'>
// 								{error.message}
// 							</p>
// 						</div>
// 					)}

// 					<form onSubmit={handleAddUser} className='space-y-6'>
// 						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
// 							{[
// 								{
// 									id: "first_name",
// 									label: "First Name",
// 									type: "text",
// 								},
// 								{
// 									id: "last_name",
// 									label: "Last Name",
// 									type: "text",
// 								},
// 								{ id: "email", label: "Email", type: "email" },
// 								{
// 									id: "password",
// 									label: "Password",
// 									type: "password",
// 									placeholder:
// 										"Password (must include uppercase, lowercase, number, and special character)",
// 								},
// 								{
// 									id: "employeeid",
// 									label: "Employee ID",
// 									type: "text",
// 								},
// 							].map(({ id, label, type, placeholder }) => (
// 								<div key={id} className='flex flex-col'>
// 									<label
// 										htmlFor={id}
// 										className='block text-sm font-medium text-gray-600 mb-1'
// 									>
// 										{label}{" "}
// 										<span className='text-red-500'>*</span>
// 									</label>
// 									<input
// 										type={type}
// 										id={id}
// 										name={id}
// 										value={
// 											formData[
// 												id as keyof typeof formData
// 											]
// 										}
// 										onChange={handleInputChange}
// 										className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// 											errors[id as keyof typeof errors] ||
// 											getFieldError(id)
// 												? "border-red-500"
// 												: "border-gray-300"
// 										}`}
// 										placeholder={
// 											placeholder || `Enter ${label}`
// 										}
// 									/>
// 									{errors[id as keyof typeof errors] && (
// 										<p className='text-red-500 text-xs mt-1'>
// 											{label} is required.
// 										</p>
// 									)}
// 									{getFieldError(id) && (
// 										<p className='text-red-500 text-xs mt-1'>
// 											{getFieldError(id)}
// 										</p>
// 									)}
// 								</div>
// 							))}

// 							{/* HQ Dropdown */}
// 							<div className='flex flex-col'>
// 								<label
// 									htmlFor='hq'
// 									className='block text-sm font-medium text-gray-600 mb-1'
// 								>
// 									HQ <span className='text-red-500'>*</span>
// 								</label>
// 								<select
// 									id='hq'
// 									name='hq'
// 									value={formData.hq}
// 									onChange={handleHqChange}
// 									className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// 										errors.hq
// 											? "border-red-500"
// 											: "border-gray-300"
// 									}`}
// 								>
// 									<option value=''>Select HQ</option>
// 									{hqs.map((hq: HQ) => (
// 										<option key={hq.id} value={hq.id}>
// 											{hq.name}
// 										</option>
// 									))}
// 								</select>
// 								{errors.hq && (
// 									<p className='text-red-500 text-xs mt-1'>
// 										HQ is required.
// 									</p>
// 								)}
// 								{getFieldError("hq") && (
// 									<p className='text-red-500 text-xs mt-1'>
// 										{getFieldError("hq")}
// 									</p>
// 								)}
// 							</div>

// 							{/* Factory Dropdown */}
// 							<div className='flex flex-col'>
// 								<label
// 									htmlFor='factory'
// 									className='block text-sm font-medium text-gray-600 mb-1'
// 								>
// 									Factory{" "}
// 									<span className='text-red-500'>*</span>
// 								</label>
// 								<select
// 									id='factory'
// 									name='factory'
// 									value={formData.factory}
// 									onChange={handleFactoryChange}
// 									disabled={!formData.hq}
// 									className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// 										errors.factory
// 											? "border-red-500"
// 											: "border-gray-300"
// 									} ${!formData.hq ? "bg-gray-100" : ""}`}
// 								>
// 									<option value=''>Select Factory</option>
// 									{factories.map((factory) => (
// 										<option
// 											key={factory.id}
// 											value={factory.id}
// 										>
// 											{factory.name}
// 										</option>
// 									))}
// 								</select>
// 								{errors.factory && (
// 									<p className='text-red-500 text-xs mt-1'>
// 										Factory is required.
// 									</p>
// 								)}
// 								{getFieldError("factory") && (
// 									<p className='text-red-500 text-xs mt-1'>
// 										{getFieldError("factory")}
// 									</p>
// 								)}
// 							</div>

// 							{/* Department Dropdown */}
// 							<div className='flex flex-col'>
// 								<label
// 									htmlFor='department'
// 									className='block text-sm font-medium text-gray-600 mb-1'
// 								>
// 									Department{" "}
// 									<span className='text-red-500'>*</span>
// 								</label>
// 								<select
// 									id='department'
// 									name='department'
// 									value={formData.department}
// 									onChange={handleInputChange}
// 									disabled={!formData.factory}
// 									className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// 										errors.department
// 											? "border-red-500"
// 											: "border-gray-300"
// 									} ${
// 										!formData.factory ? "bg-gray-100" : ""
// 									}`}
// 								>
// 									<option value=''>Select Department</option>
// 									{departments.map((dept) => (
// 										<option key={dept.id} value={dept.id}>
// 											{dept.name}
// 										</option>
// 									))}
// 								</select>
// 								{errors.department && (
// 									<p className='text-red-500 text-xs mt-1'>
// 										Department is required.
// 									</p>
// 								)}
// 								{getFieldError("department") && (
// 									<p className='text-red-500 text-xs mt-1'>
// 										{getFieldError("department")}
// 									</p>
// 								)}
// 							</div>

// 							{/* Role Dropdown */}
// 							<div className='flex flex-col'>
// 								<label
// 									htmlFor='role'
// 									className='block text-sm font-medium text-gray-600 mb-1'
// 								>
// 									Role <span className='text-red-500'>*</span>
// 								</label>
// 								<select
// 									id='role'
// 									name='role'
// 									value={formData.role}
// 									onChange={handleInputChange}
// 									className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// 										errors.role || getFieldError("role")
// 											? "border-red-500"
// 											: "border-gray-300"
// 									}`}
// 								>
// 									<option value=''>Select a role</option>
// 									{ROLE_CHOICES.map((role) => (
// 										<option
// 											key={role.value}
// 											value={role.value}
// 										>
// 											{role.label}
// 										</option>
// 									))}
// 								</select>
// 								{errors.role && (
// 									<p className='text-red-500 text-xs mt-1'>
// 										Role is required.
// 									</p>
// 								)}
// 								{getFieldError("role") && (
// 									<p className='text-red-500 text-xs mt-1'>
// 										{getFieldError("role")}
// 									</p>
// 								)}
// 							</div>
// 						</div>

// 						<div className='flex justify-end'>
// 							<button
// 								type='submit'
// 								disabled={loading}
// 								className='px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
// 							>
// 								{loading ? "Adding..." : "Add User"}
// 							</button>
// 						</div>
// 					</form>
// 				</section>
// 			</div>
// 		</div>
// 	);
// };

// export default AddUserForm;
