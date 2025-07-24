import React, { useState, useEffect } from 'react';

const PlantSelector = () => {
  // List of plants (you can modify this as needed)
//   const plants = [
//     { id: 1, name: "Plant A - Bangalore", location: "Bangalore, India", employees: 450, stations: 8 },
//     { id: 2, name: "Plant B - Chennai", location: "Chennai, India", employees: 320, stations: 5 },
//     { id: 3, name: "Plant C - Hyderabad", location: "Hyderabad, India", employees: 380, stations: 7 },
//     { id: 4, name: "Plant D - Pune", location: "Pune, India", employees: 290, stations: 4 }
//   ];

//   // State to store the selected plant
//   const [selectedPlant, setSelectedPlant] = useState(null);

//   // Load the selected plant from localStorage on component mount
//   useEffect(() => {
//     const savedPlantId = localStorage.getItem('selectedPlantId');
//     if (savedPlantId) {
//       const plant = plants.find(p => p.id === parseInt(savedPlantId));
//       if (plant) {
//         setSelectedPlant(plant);
//         if (onPlantChange) onPlantChange(plant);
//       }
//     }
//   }, []);

//   // Handle plant selection change
//   const handlePlantChange = (e) => {
//     const plantId = parseInt(e.target.value);
//     const plant = plants.find(p => p.id === plantId);
    
//     if (plant) {
//       setSelectedPlant(plant);
//       localStorage.setItem('selectedPlantId', plantId);
//       if (onPlantChange) onPlantChange(plant);
//     } else {
//       setSelectedPlant(null);
//       localStorage.removeItem('selectedPlantId');
//       if (onPlantChange) onPlantChange(null);
//     }
//   };

  return (
    // <div className="plant-selector-container" style={{ marginBottom: '20px' }}>
    //   <div style={{ marginBottom: '10px' }}>
    //     <label htmlFor="plant-selector" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
    //       Select Plant:
    //     </label>
    //     <select 
    //       id="plant-selector"
    //       value={selectedPlant?.id || ''}
    //       onChange={handlePlantChange}
    //       style={{ 
    //         width: '100%', 
    //         padding: '8px', 
    //         borderRadius: '4px',
    //         border: '1px solid #ccc'
    //       }}
    //     >
    //       <option value="">-- Select Plant --</option>
    //       {plants.map(plant => (
    //         <option key={plant.id} value={plant.id}>
    //           {plant.name}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    //   {selectedPlant && (
    //     <div className="plant-details" style={{ 
    //       backgroundColor: '#f5f5f5', 
    //       padding: '10px', 
    //       borderRadius: '4px',
    //       border: '1px solid #e0e0e0'
    //     }}>
    //       <h4 style={{ margin: '0 0 10px 0' }}>{selectedPlant.name}</h4>
    //       <p style={{ margin: '5px 0' }}><strong>Location:</strong> {selectedPlant.location}</p>
    //       <p style={{ margin: '5px 0' }}><strong>Employees:</strong> {selectedPlant.employees}</p>
    //       <p style={{ margin: '5px 0' }}><strong>CTQ Stations:</strong> {selectedPlant.stations}</p>
    //     </div>
    //   )}
    // </div>
    <div></div>
  );
};

export default PlantSelector;