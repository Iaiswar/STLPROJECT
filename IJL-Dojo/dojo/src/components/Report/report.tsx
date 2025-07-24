import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Report = () => {
	const navigate = useNavigate();
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadSuccess, setDownloadSuccess] = useState(false);

	const handleDownload = async () => {
		try {
			setIsDownloading(true);
			setDownloadSuccess(false);
			const response = await fetch(
				"http://127.0.0.1:8000/operators-excel/export_excel/"
			);

			if (!response.ok) {
				throw new Error("Failed to download file");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "master_table.xlsx";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);

			setDownloadSuccess(true);
		} catch (error) {
			console.error("Download error:", error);
			alert("Failed to download the file. Please try again.");
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
			<div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-10 relative'>
				{downloadSuccess && (
					<div className='fixed bottom-4 right-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm shadow-lg z-10'>
						Download completed successfully!
					</div>
				)}

				<div className='max-w-4xl mx-auto'>
					<h1 className='text-3xl font-bold text-gray-800 text-center mb-12'>
						Employee Reports
					</h1>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{/* Employee History Card */}
						<div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex flex-col h-full'>
							<h2 className='text-xl font-semibold text-gray-800 mb-3'>
								Employee History
							</h2>
							<p className='text-gray-600 mb-6 flex-grow'>
								Complete record of all employee changes and
								updates.
							</p>
							<div className='mt-auto'>
								<button 
									onClick={() => navigate('/EmployeeHistorySearch', { state: { fromReport: true } })}
									className='w-full bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-md font-medium flex items-center justify-center transition-colors'>
									Access Report →
								</button>
							</div>
						</div>

						{/* Master Table Card */}
						<div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 flex flex-col h-full'>
							<h2 className='text-xl font-semibold text-gray-800 mb-3'>
								Master Table
							</h2>
							<p className='text-gray-600 mb-6 flex-grow'>
								Current snapshot of all employee records.
							</p>

							<div className='mt-auto flex gap-2'>
								<button
									className='flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-md font-medium flex items-center justify-center transition-colors whitespace-nowrap'
									onClick={() =>
										navigate("/MasterTable", {
											state: { fromReport: true },
										})
									}
								>
									View Report →
								</button>

								<button
									onClick={handleDownload}
									disabled={isDownloading}
									className={`flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-md font-medium flex items-center justify-center transition-colors whitespace-nowrap ${
										isDownloading
											? "opacity-50 cursor-not-allowed"
											: ""
									}`}
								>
									{isDownloading ? (
										<span className='flex items-center'>
											<svg
												className='animate-spin mr-2 h-4 w-4 text-indigo-600'
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
											Downloading
										</span>
									) : (
										"Download Excel →"
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Report;
