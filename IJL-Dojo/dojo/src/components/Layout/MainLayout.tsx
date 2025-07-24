import { Outlet } from "react-router-dom";
import Nav from "../HomeNav/nav";
import { useEffect, useState } from "react";
import ScrollToTop from "../General/ScrollToTop";


interface CompanyLogo {
	id: number;
	name: string;
	logo: string;
	uploaded_at: string;
}

type SizeOption = "small" | "medium" | "large";

interface MainLayoutProps {
	size?: SizeOption; // Optional prop
}

const MainLayout = ({ size = "medium" }: MainLayoutProps) => {
	const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
	const [logoLoading, setLogoLoading] = useState(true);

	useEffect(() => {
		const fetchCompanyLogo = async () => {
			try {
				const response = await fetch("http://127.0.0.1:8000/api/logo/");
				const data = await response.json();
				console.log(data);

				if (data && data.logo_url) {
					setCompanyLogo({
						id: 1,
						name: "NL Technologies",
						logo: data.logo_url,
						uploaded_at: "",
					});
				}
			} catch (error) {
				console.error("Error fetching company logo:", error);
			} finally {
				setLogoLoading(false);
			}
		};

		fetchCompanyLogo();
	}, []);

	// Define dynamic class based on size
	const sizeClasses = {
		small: "text-sm px-2 py-1",
		// medium: "text-base px-4 py-2",
		medium: "text-base",
		large: "text-lg px-6 py-4",
	};

	return (
		<div className={`min-h-screen flex flex-col ${sizeClasses[size]}`}>
			<Nav />

			{/* Scroll to top on page change */}
			<ScrollToTop />

			<div className='pt-16 flex-grow'>
				<Outlet />
			</div>

			{/* <footer className="flex justify-between items-center text-sm text-[#1E3A46] bg-gray-300">
				<div className='flex justify-center md:justify-start mb-4 md:mb-0 pl-16'>
					{logoLoading ? (
						<div className='h-10 w-auto bg-gray-200 rounded animate-pulse'></div>
					) : companyLogo ? (
						<img
							src={companyLogo.logo}
							alt={companyLogo.name}
							className='h-20 w-auto max-w-[200px] object-contain'
						/>
					) : (
						<div className='text-2xl font-semibold'>
							NL Technologies
						</div>
					)}
				</div>

				<span className="text-[#1E3A46] font-semibold text-center text-xl">
					Empowering Industrial Excellence Through Digital Transformation
				</span>

				<span>
					© 2025{' '}
					<a
						href="http://www.nltecsolutions.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#1E3A46] hover:underline font-medium"
					>
						NL Technologies
					</a>. All rights reserved.
				</span>
			</footer> */}

			<footer className='bg-white text-[#1E3A46] text-sm '>
				<div className='flex flex-col md:flex-row justify-between items-center px-4 md:px-16 space-y-4 md:space-y-0'>
					{/* Logo or Loading or Text */}
					<div className='flex justify-center md:justify-start w-full md:w-auto'>
						{logoLoading ? (
							<div className='h-10 w-40 bg-gray-200 rounded animate-pulse'></div>
						) : companyLogo ? (
							<img
								src={companyLogo.logo}
								alt={companyLogo.name}
								className='h-20 w-auto max-w-[200px] object-contain'
							/>
						) : (
							<div className='text-2xl font-semibold'>
								NL Technologies
							</div>
						)}
					</div>

					{/* Tagline */}
					<div className='text-center text-[#1E3A46] text-sm  font-semibold w-full md:w-auto'>
						Empowering Industrial Excellence Through Digital
						Transformation
					</div>

					{/* Copyright */}
					<div className='text-center w-full md:w-auto text-sm font-semibold'>
						© 2025{" "}
						<a
							href='http://www.nltecsolutions.com/'
							target='_blank'
							rel='noopener noreferrer'
							className='text-[#1E3A46] hover:underline font-medium'
						>
							NL Technologies
						</a>
						. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
};

export default MainLayout;
