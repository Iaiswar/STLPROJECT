// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// interface HQ {
//   id: number;
//   name: string;
// }

// const FactoryForm: React.FC = () => {
//   const [hqs, setHqs] = useState<HQ[]>([]);
//   const [selectedHQ, setSelectedHQ] = useState<number | null>(null);
//   const [factoryName, setFactoryName] = useState('');
//   const [message, setMessage] = useState<string | null>(null);

//   // Fetch HQs on mount
//   useEffect(() => {
//     const fetchHQs = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/hq/');
//         setHqs(response.data);
//       } catch (error) {
//         console.error('Error fetching HQs:', error);
//         setMessage('Failed to load HQs.');
//       }
//     };

//     fetchHQs();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedHQ) {
//       setMessage('Please select an HQ.');
//       return;
//     }

//     try {
//       await axios.post('http://127.0.0.1:8000/factories/', {
//         name: factoryName,
//         hq: selectedHQ,
//       });
//       setMessage('Factory saved successfully!');
//       setFactoryName('');
//       setSelectedHQ(null);
//     } catch (error) {
//       console.error(error);
//       setMessage('Failed to save factory.');
//     }
//   };

//   return (
//     // <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
//     //   <h2 className="text-xl font-bold mb-4">Add Factory</h2>
//     //   <form onSubmit={handleSubmit} className="space-y-4">
//     //     <select
//     //       value={selectedHQ ?? ''}
//     //       onChange={e => setSelectedHQ(Number(e.target.value))}
//     //       className="w-full p-2 border rounded"
//     //       required
//     //     >
//     //       <option value="">Select HQ</option>
//     //       {hqs.map(hq => (
//     //         <option key={hq.id} value={hq.id}>
//     //           {hq.name}
//     //         </option>
//     //       ))}
//     //     </select>

//     //     <input
//     //       type="text"
//     //       name="factoryName"
//     //       value={factoryName}
//     //       onChange={e => setFactoryName(e.target.value)}
//     //       placeholder="Enter factory name"
//     //       className="w-full p-2 border rounded"
//     //       required
//     //     />

//     //     <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//     //       Save
//     //     </button>
//     //   </form>

//     //   {message && <p className="mt-4 text-blue-700">{message}</p>}
//     // </div>
//     <div className="container mx-auto px-4 py-8">
//   <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//     <h1 className="text-3xl font-bold text-gray-800 mb-6">Factory Management</h1>
    
//     <section className="mb-10 p-6 bg-gray-50 rounded-lg">
//       <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Factory</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="hq-select" className="block text-sm font-medium text-gray-600 mb-1">
//               Select HQ <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="hq-select"
//               value={selectedHQ ?? ''}
//               onChange={e => setSelectedHQ(Number(e.target.value))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               required
//             >
//               <option value="">Select HQ</option>
//               {hqs.map(hq => (
//                 <option key={hq.id} value={hq.id}>
//                   {hq.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="factory-name" className="block text-sm font-medium text-gray-600 mb-1">
//               Factory Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="factory-name"
//               type="text"
//               name="factoryName"
//               value={factoryName}
//               onChange={e => setFactoryName(e.target.value)}
//               placeholder="Enter factory name"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             Save Factory
//           </button>
//         </div>
//       </form>
//       {message && (
//         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//           <p className="text-sm text-blue-700">{message}</p>
//         </div>
//       )}
//     </section>
//   </div>
// </div>
//   );
// };

// export default FactoryForm;

import React, { useState, useEffect } from 'react';

interface HQ {
  id: number;
  name: string;
}

interface Factory {
  id: number;
  name: string;
  hq: number; // Changed from object to number
}

const FactoryForm: React.FC = () => {
  const formRef = React.useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    hq: ''
  });
  const [hqs, setHQs] = useState<HQ[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
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
      const [hqsRes, factoriesRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/hq/'),
        fetch('http://127.0.0.1:8000/factories/')
      ]);
      
      if (!hqsRes.ok || !factoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const hqsData = await hqsRes.json();
      const factoriesData = await factoriesRes.json();
      
      setHQs(hqsData);
      setFactories(factoriesData);
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
    
    if (!formData.name || !formData.hq) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const url = isEditing 
        ? `http://127.0.0.1:8000/factories/${formData.id}/`
        : 'http://127.0.0.1:8000/factories/';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          hq: Number(formData.hq) // Convert to number
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save factory');
      }

      setSuccessMessage(`Factory ${isEditing ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving factory:', error);
      setErrorMessage(`Failed to ${isEditing ? 'update' : 'create'} factory. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      hq: ''
    });
    setIsEditing(false);
  };

const handleEdit = (factory: Factory) => {
  setFormData({
    id: factory.id.toString(),
    name: factory.name,
    hq: factory.hq.toString()
  });
  setIsEditing(true);

  // Scroll to the form with offset (optional)
  if (formRef.current) {
    const offsetTop = formRef.current.getBoundingClientRect().top + window.scrollY - 50;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  }
};

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this factory?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/factories/${id}/`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete factory');
        }

        setSuccessMessage('Factory deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting factory:', error);
        setErrorMessage('Failed to delete factory. Please try again.');
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
          {isEditing ? 'Edit Factory' : 'Add New Factory'}
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="hq" className="block text-sm font-medium text-gray-700 mb-2">
                  HQ *
                </label>
                <select
                  id="hq"
                  name="hq"
                  value={formData.hq}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                  required
                >
                  <option value="">Select HQ</option>
                  {hqs.map(hq => (
                    <option key={hq.id} value={hq.id.toString()}>
                      {hq.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Factory Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter factory name"
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
                ) : isEditing ? 'Update Factory' : 'Add Factory'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Factories List</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factory Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HQ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && factories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : factories.length > 0 ? (
                factories.map((factory) => (
                  <tr key={factory.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {factory.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {factory.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {hqs.find(hq => hq.id === factory.hq)?.name || 'Unknown HQ'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                      <button
                        onClick={() => handleEdit(factory)}
                        className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(factory.id)}
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
                    No factories found
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

export default FactoryForm;
