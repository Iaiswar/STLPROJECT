// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// interface MachineAllocation {
//   id: number;
//   machine_name: string;
//   employee_name: string;
//   allocated_at: string;
//   approval_status: string;
// }

// const ApprovalList: React.FC = () => {
//   const [allocations, setAllocations] = useState<MachineAllocation[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchAllocations = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/machine-allocations/');
//         setAllocations(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch machine allocations');
//         setLoading(false);
//         console.error(err);
//       }
//     };

//     fetchAllocations();
//   }, []);

//   const handleApproval = async (id: number, status: 'approved' | 'rejected') => {
//     try {
//       await axios.patch(`http://127.0.0.1:8000/machine-allocations/${id}/`, {
//         approval_status: status
//       });
      
//       // Update the local state to reflect the change
//       setAllocations(allocations.map(allocation => 
//         allocation.id === id ? { ...allocation, approval_status: status } : allocation
//       ));
//     } catch (err) {
//       console.error('Failed to update approval status', err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//         <strong className="font-bold">Error: </strong>
//         <span className="block sm:inline">{error}</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Machine Allocation Approvals</h1>
      
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated At</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {allocations.map((allocation) => (
//               <tr key={allocation.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{allocation.machine_name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{allocation.employee_name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {new Date(allocation.allocated_at).toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                     ${allocation.approval_status === 'approved' ? 'bg-green-100 text-green-800' : 
//                       allocation.approval_status === 'rejected' ? 'bg-red-100 text-red-800' : 
//                       'bg-yellow-100 text-yellow-800'}`}>
//                     {allocation.approval_status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {allocation.approval_status === 'pending' && (
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleApproval(allocation.id, 'approved')}
//                         className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
//                       >
//                         Accept
//                       </button>
//                       <button
//                         onClick={() => handleApproval(allocation.id, 'rejected')}
//                         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ApprovalList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../HomeNav/nav';

interface MachineAllocation {
  id: number;
  machine: {
    id: number;
    name: string;
    image: string;
    level: number;
    process: string;
    created_at: string;
    updated_at: string;
  };
  employee: string;
  allocated_at: string;
  approval_status: string;
}

const ApprovalList: React.FC = () => {
  const [allocations, setAllocations] = useState<MachineAllocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/machine-allocations/');
        setAllocations(response.data);
        setLoading(false);
        console.log(response.data)
      } catch (err) {
        setError('Failed to fetch machine allocations');
        setLoading(false);
        console.error(err);
      }
    };

    fetchAllocations();
  }, []);

  const handleApproval = async (id: number, status: 'approved' | 'rejected') => {
    try {
      // Use the custom action endpoint
      await axios.put(`http://127.0.0.1:8000/machine-allocation-approval/${id}/set-status/`, {
        approval_status: status
      });

      // Update the local state to reflect the change
      setAllocations(allocations.map(allocation => 
        allocation.id === id ? { ...allocation, approval_status: status } : allocation
      ));
    } catch (err) {
      console.error('Failed to update approval status', err);
      alert('Failed to update approval status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
 console.log(allocations)
  return (
    <><Nav /><div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Machine Allocation Approvals</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allocations.map((allocation) => (
              <tr key={allocation.id}>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{allocation.machine.name}</td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{allocation.employee}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{allocation.machine.process}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(allocation.allocated_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${allocation.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                      allocation.approval_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                    {allocation.approval_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {allocation.approval_status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproval(allocation.id, 'approved')}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(allocation.id, 'rejected')}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div></>
  );
};

export default ApprovalList;