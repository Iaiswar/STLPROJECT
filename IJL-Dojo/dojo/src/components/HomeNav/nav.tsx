import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { logout } from "../Login/Slice/LoginSlice";
import { useNavigate } from "react-router-dom";

interface CompanyLogo {
	id: number;
	name: string;
	logo: string;
	uploaded_at: string;
}

export default function Nav() {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const userData = useSelector((state: RootState) => state.LoginData.user);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
	const [logoLoading, setLogoLoading] = useState(true);
	const goToTermsAndConditions = () => navigate("/TermsAndConditions");
	const goToPrivacyPolicy = () => navigate("/PrivacyPolicy");
	const goToVersionControl = () => navigate("/VersionControl");

	const getInitial = () => {
		if (!userData?.first_name) return "U";
		return userData.first_name.charAt(0).toUpperCase();
	};

	const handleLogout = () => {
		dispatch(logout({ navigate }))
			.unwrap()
			.then((response: any) => {
				navigate("/");
			})
			.catch((error: any) => {
				console.error("Logout failed:", error);
			});
	};

	if (!userData) {
		return null;
	}

	useEffect(() => {
		const fetchCompanyLogo = async () => {
			try {
				const response = await fetch("http://127.0.0.1:8000/logos/");
				const data = await response.json();

				// Get the first logo or the most recent one
				if (data && data.length > 0) {
					setCompanyLogo(data[0]); // or data[data.length - 1] for most recent
				}
			} catch (error) {
				console.error("Error fetching company logo:", error);
			} finally {
				setLogoLoading(false);
			}
		};

		fetchCompanyLogo();
	}, []);

	return (
		<nav className='fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-md text-[#001740] z-50 mb-5'>
			{/* Left: Brand and navigation buttons */}
			<div className='flex items-center gap-4'>
				{/* <div className="text-2xl font-bold whitespace-nowrap">IJL</div> */}
				{/* Logo Section */}
				{/* <div className='flex justify-center md:justify-start mb-4 md:mb-0 pl-16'>
							{logoLoading ? (
								<div className='h-10 w-auto bg-gray-200 rounded animate-pulse'></div>
							) : companyLogo ? (
								<img
									src={companyLogo.logo}
									alt={companyLogo.name}
									className='h-12 w-auto max-w-[200px] object-contain'
								/>
							) : (
								<div className='text-2xl font-semibold'>
									IJL
								</div>
							)}
						</div> */}
				<div className='flex flex-col items-center md:items-start justify-center mb-4 md:mb-0 pl-16 md:pl-1'>
					{logoLoading ? (
						<div className='h-10 w-auto bg-gray-200 rounded animate-pulse'></div>
					) : companyLogo ? (
						<>
							<div className='w-full flex justify-center'>
								<img
									src={companyLogo.logo}
									alt={companyLogo.name}
									className='h-8 w-auto max-w-[200px] object-contain'
								/>
							</div>
							<div className='w-full text-sm font-semibold text-black text-left'>
								India Japan Lighting Pvt Ltd
							</div>
						</>
					) : (
						<>
							<div className='w-full flex justify-center'>
								<div className='text-2xl font-semibold'>
									IJL
								</div>
							</div>
							<div className='w-full text-sm text-gray-700 mt-1 text-left'>
								India Japan Lighting Pvt Ltd
							</div>
						</>
					)}
				</div>
			</div>

			{/* Center: Dojo 2.0 - Responsive text */}
			<div
				onClick={() => navigate("/")}
				className='absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl lg:text-3xl font-bold cursor-pointer transition-transform duration-200 active:scale-110 whitespace-nowrap'
			>
				<span className='hidden sm:inline'>
					Dojo 2.0 Training Optimization Platform
				</span>
				<span className='sm:hidden'>Dojo 2.0</span>
			</div>

			<div className='flex items-center gap-4'>
				<button
					onClick={() => navigate(-1)}
					className='hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
					aria-label='Go back'
					title='Go back'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-8 w-8'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M10 19l-7-7m0 0l7-7m-7 7h18'
						/>
					</svg>
				</button>

				<button
					onClick={() => navigate("/home")}
					className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
					aria-label='Go home'
					title='Home'
				>
					<svg
						xmlns='http://www.w2000/svg'
						className='h-8 w-8'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
						/>
					</svg>
				</button>
				<div className='relative'>
					<button
						onClick={() => setDropdownOpen(!dropdownOpen)}
						className='focus:outline-none'
					>
						<div className='w-10 h-10 rounded-full border-2 border-[#001740] flex items-center justify-center bg-[#001740] text-white font-semibold'>
							{getInitial()}
						</div>
					</button>
					{dropdownOpen && (
						<div className='absolute right-0 mt-2 w-96 bg-gray-100 border border-gray-200 rounded-2xl shadow-2xl z-50 text-[#001740]'>
							<div className='flex justify-end pt-3 pr-4'>
								<button
									onClick={() => setDropdownOpen(false)}
									className='text-gray-400 hover:text-gray-600'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								</button>
							</div>
							<div className='px-6 text-sm text-center text-gray-500 -mt-2'>
								{userData.email}
							</div>
							<div className='flex flex-col items-center px-6 pt-4 pb-3'>
								<div className='w-12 h-12 rounded-full bg-[#001740] text-white flex items-center justify-center font-bold text-lg shadow-md'>
									{getInitial()}
									{userData.last_name
										?.charAt(0)
										.toUpperCase() || ""}
								</div>
								<p className='mt-2 text-xl font-semibold'>
									Hi, {userData.first_name}!
								</p>
							</div>
							<div className='px-6 py-2 flex justify-center'>
								<button
									onClick={handleLogout}
									className='w-[50%] flex items-center justify-center gap-2 text-sm text-[#001740] bg-white rounded-full py-2 shadow hover:bg-gray-100 transition-all duration-150'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M17 16l4-4m0 0l-4-4m4 4H7'
										/>
									</svg>
									Sign Out
								</button>
							</div>
							<div className='mt-[80px] border-t border-gray-200 text-center text-sm text-gray-400 px-4 py-4 flex justify-center gap-2'>
								<span
									onClick={goToPrivacyPolicy}
									className='hover:underline cursor-pointer'
								>
									Privacy policy
								</span>{" "}
								|
								<span
									onClick={goToTermsAndConditions}
									className='hover:underline cursor-pointer'
								>
									Terms of service
								</span>{" "}
								|
								<span
									onClick={goToVersionControl}
									className='hover:underline cursor-pointer'
								>
									Version
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}

// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '../../store/store'; // Import AppDispatch
// import { useDispatch } from 'react-redux';
// import { logout } from '../Login/Slice/LoginSlice';
// import { useNavigate } from 'react-router-dom';

// interface CompanyLogo {
//   id: number;
//   name: string;
//   logo: string;
//   uploaded_at: string;
// }

// export default function Nav() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
//   const [logoLoading, setLogoLoading] = useState(true);
//   const userData = useSelector((state: RootState) => state.LoginData.user);
//   const dispatch = useDispatch<AppDispatch>(); // Type the dispatch with AppDispatch
//   const navigate = useNavigate();
//   const goToTermsAndConditions = () => navigate('/TermsAndConditions');
//   const goToPrivacyPolicy = () => navigate('/PrivacyPolicy');
//   const goToVersionControl = () => navigate('/VersionControl');

//   useEffect(() => {
//     const fetchCompanyLogo = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/logos/');
//         const data = await response.json();

//         // Get the first logo or the most recent one
//         if (data && data.length > 0) {
//           setCompanyLogo(data[0]); // or data[data.length - 1] for most recent
//         }
//       } catch (error) {
//         console.error('Error fetching company logo:', error);
//       } finally {
//         setLogoLoading(false);
//       }
//     };

//     fetchCompanyLogo();
//   }, []);

//   const getInitial = () => {
//     if (!userData?.first_name) return 'U';
//     return userData.first_name.charAt(0).toUpperCase();
//   };

//   const handleLogout = () => {
//     dispatch(logout({ navigate }))
//       .unwrap()
//       .then((response: any) => {
//         console.log('Logout successful:', response);
//         navigate('/'); // Navigate to home page after successful logout
//       })
//       .catch((error: any) => {
//         console.error('Logout failed:', error);
//         // Handle logout error - user stays on current page
//       });
//   };

//   // Add a guard clause to prevent rendering if userData is null
//   if (!userData) {
//     return null; // or return a loading spinner
//   }

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center text-[#001740] z-50">
//       {/* Left: Company Logo */}

//       {/* <div className="flex items-center gap-4">
//         <div className="flex flex-col items-start">
//           <div className="text-2xl font-bold leading-tight">Krishna Maruti Ltd.<samp className="text-2xl  ml-3 self-end font-bold">- Seat</samp></div>
//         </div>

//       </div> */}
//       <div className="flex items-center gap-4">
//          {/* <div className="text-2xl font-bold whitespace-nowrap">IJL</div> */}
//         {/* Logo Section */}
//  						<div className='flex justify-center md:justify-start mb-4 md:mb-0 pl-16'>
//  							{logoLoading ? (
//  								<div className='h-10 w-auto bg-gray-200 rounded animate-pulse'></div>
//  							) : companyLogo ? (
//  								<img
//  									src={companyLogo.logo}
//  									alt={companyLogo.name}
//  									className='h-12 w-auto max-w-[200px] object-contain'
//  								/>
//  							) : (
//  								<div className='text-2xl font-semibold'>
//  									IJL
//  								</div>
//  							)}
//  						</div>
//        </div>
//       {/* <div className="flex flex-col">
//         {logoLoading ? (
//           <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
//         ) : companyLogo ? (
//           <img
//             src={companyLogo.logo}
//             alt={companyLogo.name}
//             className="h-10 w-auto  max-w-[200px] object-contain"
//           />
//         ) : (
//           <div className="text-2xl font-semibold">KML</div>
//         )}
//       </div> */}

//       {/* <p className="text-xs font-semibold text-blue-700  ">
//           Beta Ver: 0000 0000
//         </p> */}

//       {/* Center: Dojo 2.0 */}
//       <div
//         className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl lg:text-3xl font-bold cursor-pointer"
//         onClick={() => navigate('/home')}
//       >
//         Dojo 2.0
//       </div>

//       {/* Right: User avatar */}
//       {/* <div className="relative"> */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => navigate(-1)}
//           className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
//           aria-label="Go back"
//           title="Go back"

//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//         </button>

//         <button
//           onClick={() => navigate('/')}
//           className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
//           aria-label="Go home"
//           title="Home"

//         >
//           <svg xmlns="http://www.w2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//           </svg>
//         </button>
//         <div className="relative">
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="focus:outline-none"
//           >
//             <div className="w-10 h-10 rounded-full border-2 border-[#001740] flex items-center justify-center bg-[#001740] text-white font-semibold">
//               {getInitial()}
//             </div>
//           </button>
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-96 bg-gray-100 border border-gray-200 rounded-2xl shadow-2xl z-50 text-[#001740]">
//               <div className="flex justify-end pt-3 pr-4">
//                 <button onClick={() => setDropdownOpen(false)} className="text-gray-400 hover:text-gray-600">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="px-6 text-sm text-center text-gray-500 -mt-2">
//                 {userData.email}
//               </div>
//               <div className="flex flex-col items-center px-6 pt-4 pb-3">
//                 <div className="w-12 h-12 rounded-full bg-[#001740] text-white flex items-center justify-center font-bold text-lg shadow-md">
//                   {getInitial()}{userData.last_name?.charAt(0).toUpperCase() || ''}
//                 </div>
//                 <p className="mt-2 text-xl font-semibold">Hi, {userData.first_name}!</p>
//               </div>
//               <div className="px-6 py-2 flex justify-center">
//                 <button
//                   onClick={handleLogout}
//                   className="w-[50%] flex items-center justify-center gap-2 text-sm text-[#001740] bg-white rounded-full py-2 shadow hover:bg-gray-100 transition-all duration-150"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
//                   </svg>
//                   Sign Out
//                 </button>
//               </div>
//               <div className="mt-[80px] border-t border-gray-200 text-center text-sm text-gray-400 px-4 py-4 flex justify-center gap-2">
//                 <span onClick={goToPrivacyPolicy} className="hover:underline cursor-pointer">Privacy policy</span> |
//                 <span onClick={goToTermsAndConditions} className="hover:underline cursor-pointer">Terms of service</span> |
//                 <span onClick={goToVersionControl} className="hover:underline cursor-pointer">Version</span>

//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
