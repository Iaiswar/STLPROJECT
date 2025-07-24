import React from 'react';
import { Construction } from 'lucide-react';
// import Nav from '../HomeNav/nav';

const UnderDevelopment: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* <Nav /> */}

      <div className="flex-grow flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="bg-white border border-gray-300 shadow-lg rounded-2xl max-w-2xl w-full p-10">
          <div className="flex justify-center mb-6">
            <Construction className="w-20 h-20 text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Page Under Development
          </h1>
          <p className="text-lg text-gray-600">
            🚧 This feature is currently being built. We're working hard to make it awesome. Please check back later!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;



// import { FaHardHat, FaTools } from 'react-icons/fa';

// const UnderConstruction = ({ moduleName = "this module" }) => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
//       <div className="bg-yellow-100 p-8 rounded-lg max-w-md w-full border-2 border-yellow-300">
//         <div className="flex justify-center text-yellow-500 mb-4">
//           <FaHardHat size={48} />
//           <FaTools size={48} className="ml-2" />
//         </div>
//         <h2 className="text-2xl font-bold text-yellow-700 mb-2">Under Construction</h2>
//         <p className="text-yellow-600 mb-4">
//           {moduleName} is currently being built. Please check back soon!
//         </p>
//         <div className="animate-pulse text-yellow-500 text-sm">
//           Our team is working hard to bring you this feature
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UnderConstruction;