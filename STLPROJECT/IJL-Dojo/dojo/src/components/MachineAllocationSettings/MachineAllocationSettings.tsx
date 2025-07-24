import React from "react";
import AddMachineForm from "./Components/AddMachineForm/AddMachineForm";

const MachineAllocationSettings: React.FC = () => {
	return (
		// <div className="p-6 max-w-5xl mx-auto">
		<div className='container mx-auto px-4 py-8'>
			<div className='bg-white rounded-xl shadow-md p-6 mb-8'>
				<h1 className='text-3xl font-bold text-gray-800 mb-6'>
					Machine Allocation Settings
				</h1>

				{/* Add machine form */}
				<AddMachineForm />

				{/* You can add other settings or sections here */}
			</div>
		</div>
	);
};

export default MachineAllocationSettings;
