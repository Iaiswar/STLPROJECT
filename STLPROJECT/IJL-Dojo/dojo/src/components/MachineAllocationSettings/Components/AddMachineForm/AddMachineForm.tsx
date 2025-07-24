import React, { useState } from "react";
import axios from "axios";

const AddMachineForm: React.FC = () => {
	const [formData, setFormData] = useState({
		name: "",
		image: null as File | null,
		level: 1,
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "level" ? parseInt(value) : value,
		}));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			image: e.target.files?.[0] || null,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name || !formData.image) {
			setMessage("Both name and image are required.");
			return;
		}

		const payload = new FormData();
		payload.append("name", formData.name);
		payload.append("image", formData.image);
		payload.append("level", formData.level.toString());

		setLoading(true);
		try {
			await axios.post("http://127.0.0.1:8000/machines/", payload, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setMessage("✅ Machine added successfully!");
			setFormData({ name: "", image: null, level: 1 });
		} catch (error) {
			setMessage("❌ Failed to add machine.");
		} finally {
			setLoading(false);
		}
	};

	return (
		// <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg w-full mx-auto mt-10 border border-gray-200">
		<div className='mb-10 p-6 bg-gray-50 rounded-lg'>
			<h2 className='text-xl font-semibold text-gray-700 mb-4'>
				Add New Machine
			</h2>

			{message && (
				<div className='mb-4 text-sm font-medium text-center text-green-600'>
					{message}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block text-sm font-semibold text-gray-600 mb-1'>
						Machine Name
					</label>
					<input
						type='text'
						name='name'
						value={formData.name}
						onChange={handleChange}
						placeholder='Enter machine name'
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm'
					/>
				</div>

				<div>
					<label className='block text-sm font-semibold text-gray-600 mb-1'>
						Level
					</label>
					<select
						name='level'
						value={formData.level}
						onChange={handleChange}
						className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm'
					>
						<option value={1}>Level 1</option>
						<option value={2}>Level 2</option>
						<option value={3}>Level 3</option>
						<option value={4}>Level 4</option>
					</select>
				</div>

				{/* <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 text-white font-semibold text-sm rounded-lg transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Uploading..." : "Add Machine"}
        </button> */}
				<div>
					<label className='block text-sm font-medium text-gray-600 mb-1'>
						Image
					</label>
					<input
						type='file'
						accept='image/*'
						onChange={handleImageChange}
						className='block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100'
					/>
				</div>

				<div className="flex justify-end">
          <button
            type='submit'
            disabled={loading}
            className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
                Uploading...
              </>
            ) : (
              "Add Machine"
            )}
          </button>
        </div>
			</form>
		</div>
	);
};

export default AddMachineForm;
