// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// interface Factory {
//   id: number;
//   name: string;
// }

// const DepartmentForm: React.FC = () => {
//   const [factories, setFactories] = useState<Factory[]>([]);
//   const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
//   const [name, setName] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     axios.get<Factory[]>('http://127.0.0.1:8000/factories/')
//       .then(response => setFactories(response.data))
//       .catch(error => console.error('Error fetching factories:', error));
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedFactory || !name.trim()) return;

//     try {
//       await axios.post('http://127.0.0.1:8000/departments/', {
//         factory: selectedFactory,
//         name
//       });
//       setSuccessMessage('Department saved successfully!');
//       setName('');
//       setSelectedFactory(null);
//     } catch (error) {
//       console.error('Error saving department:', error);
//     }
//   };

//   return (
//     // <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
//     //   <h2 className="text-2xl font-semibold mb-4">Add Department</h2>
//     //   <form onSubmit={handleSubmit} className="space-y-4">
//     //     <div>
//     //       <label className="block mb-1 font-medium">Select Factory</label>
//     //       <select
//     //         value={selectedFactory ?? ''}
//     //         onChange={(e) => setSelectedFactory(Number(e.target.value))}
//     //         className="w-full border border-gray-300 rounded px-3 py-2"
//     //         required
//     //       >
//     //         <option value="">-- Select a Factory --</option>
//     //         {factories.map(factory => (
//     //           <option key={factory.id} value={factory.id}>
//     //             {factory.name}
//     //           </option>
//     //         ))}
//     //       </select>
//     //     </div>
//     //     <div>
//     //       <label className="block mb-1 font-medium">Department Name</label>
//     //       <input
//     //         type="text"
//     //         value={name}
//     //         onChange={e => setName(e.target.value)}
//     //         className="w-full border border-gray-300 rounded px-3 py-2"
//     //         placeholder="Enter department name"
//     //         required
//     //       />
//     //     </div>
//     //     <button
//     //       type="submit"
//     //       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//     //     >
//     //       Save Department
//     //     </button>
//     //     {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
//     //   </form>
//     // </div>

//     <div className="container mx-auto px-4 py-8">
//   <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//     <h1 className="text-3xl font-bold text-gray-800 mb-6">Department Management</h1>
    
//     <section className="mb-10 p-6 bg-gray-50 rounded-lg">
//       <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Department</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="factory-select" className="block text-sm font-medium text-gray-600 mb-1">
//               Select Factory <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="factory-select"
//               value={selectedFactory ?? ''}
//               onChange={(e) => setSelectedFactory(Number(e.target.value))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               required
//             >
//               <option value="">-- Select a Factory --</option>
//               {factories.map(factory => (
//                 <option key={factory.id} value={factory.id}>
//                   {factory.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="department-name" className="block text-sm font-medium text-gray-600 mb-1">
//               Department Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="department-name"
//               type="text"
//               value={name}
//               onChange={e => setName(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter department name"
//               required
//             />
//           </div>
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             Save Department
//           </button>
//         </div>
//       </form>
//       {successMessage && (
//         <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
//           <p className="text-sm text-green-700">{successMessage}</p>
//         </div>
//       )}
//     </section>
//   </div>
// </div>
//   );
// };

// export default DepartmentForm;


import React, { useState, useEffect } from 'react';

interface Factory {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  factory: number;
}

const DepartmentForm: React.FC = () => {
  const formRef = React.useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    factory: ''
  });
  const [factories, setFactories] = useState<Factory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [factoriesRes, departmentsRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/factories/'),
        fetch('http://127.0.0.1:8000/departments/')
      ]);
      
      if (!factoriesRes.ok || !departmentsRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const factoriesData = await factoriesRes.json();
      const departmentsData = await departmentsRes.json();
      
      setFactories(factoriesData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.factory) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const url = isEditing 
        ? `http://127.0.0.1:8000/departments/${formData.id}/`
        : 'http://127.0.0.1:8000/departments/';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          factory: Number(formData.factory)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save department');
      }

      setSuccessMessage(`Department ${isEditing ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving department:', error);
      setErrorMessage(`Failed to ${isEditing ? 'update' : 'create'} department. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      factory: ''
    });
    setIsEditing(false);
  };

  const handleEdit = (department: Department) => {
    setFormData({
      id: department.id.toString(),
      name: department.name,
      factory: department.factory.toString()
    });
    setIsEditing(true);

    if (formRef.current) {
      const offsetTop = formRef.current.getBoundingClientRect().top + window.scrollY - 50;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/departments/${id}/`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete department');
        }

        setSuccessMessage('Department deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting department:', error);
        setErrorMessage('Failed to delete department. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="max-w-[1440px] mx-auto mt-6  bg-white">
      <div ref={formRef} className="bg-gray-50 p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {isEditing ? 'Edit Department' : 'Add New Department'}
        </h2>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        <div onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="factory" className="block text-sm font-medium text-gray-700 mb-2">
                  Factory *
                </label>
                <select
                  id="factory"
                  name="factory"
                  value={formData.factory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                  required
                >
                  <option value="">Select Factory</option>
                  {factories.map(factory => (
                    <option key={factory.id} value={factory.id.toString()}>
                      {factory.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department name"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 font-medium"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : isEditing ? 'Update Department' : 'Add Department'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Departments List</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && departments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : departments.length > 0 ? (
                departments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {department.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {factories.find(factory => factory.id === department.factory)?.name || 'Unknown Factory'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                      <button
                        onClick={() => handleEdit(department)}
                        className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;
