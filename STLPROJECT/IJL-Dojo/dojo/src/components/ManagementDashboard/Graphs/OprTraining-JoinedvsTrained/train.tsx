// import React, { useEffect, useState } from "react";
// import LineGraph from "../../LineGraph/linegraph";
// import axios from "axios";

// interface TrainingProps {
//     selectedPlant: string;
// }

// interface TrainingData {
//     month: string;
//     new_operators_joined: number;
//     new_operators_trained: number;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const Training: React.FC<TrainingProps> = ({ selectedPlant }) => {
//     const [data1, setData1] = useState<number[]>([]);
//     const [data2, setData2] = useState<number[]>([]);
//     const [labels, setLabels] = useState<string[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
    
//  useEffect(() => {
//   const fetchTrainingData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.get<TrainingData[]>(`${API_BASE_URL}/operators-joined-vs-trained/`, {
//         params: {
//           plant: selectedPlant === "All Plants" ? "all" : selectedPlant
//         }
//       });

//       // console.log("Fetched Training Data:", response.data); 

//       if (response.data && response.data.length > 0) {
//         const sortedData = response.data.sort((a, b) =>
//           new Date(a.month).getTime() - new Date(b.month).getTime()
//         );

//         const months = sortedData.map(item => {
//           const date = new Date(item.month);
//           return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
//         });

//         const joined = sortedData.map(item => item.new_operators_joined);
//         const trained = sortedData.map(item => item.new_operators_trained);

//         // console.log("Months:", months);       
//         // console.log("Joined:", joined);        
//         // console.log("Trained:", trained);      

//         setLabels(months);
//         setData1(joined);
//         setData2(trained);
//       } else {
//         setLabels(["No data available"]);
//         setData1([0]);
//         setData2([0]);
//       }
//     } catch (err) {
//       console.error("Error fetching training data:", err);
//       setError("Failed to load training data");
//       setLabels(["Error loading data"]);
//       setData1([0]);
//       setData2([0]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchTrainingData();
// }, [selectedPlant]);


//     const title = selectedPlant === "All Plants"
//         ? "Operators Training - Joined vs Trained - All Plants"
//         : `Operators Training - Joined vs Trained - ${selectedPlant}`;
        
//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-4 border-b border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//             </div>
//             <div className="p-4">
//                 {loading ? (
//                     <div className="w-full h-36 flex items-center justify-center">
//                         <p className="text-gray-500">Loading data...</p>
//                     </div>
//                 ) : error ? (
//                     <div className="w-full h-36 flex items-center justify-center">
//                         <p className="text-red-500">{error}</p>
//                     </div>
//                 ) : (
//                     <div className="w-full h-36">
//                         <LineGraph
//                             labels={labels}
//                             data1={data1} 
//                             data2={data2}  
//                             area={true}
//                             showSecondLine={true}
//                             label1="Operators Joined"
//                             label2="Operators Trained"
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Training;




import React, { useEffect, useState } from "react";
import LineGraph from "../../LineGraph/linegraph";
import axios from "axios";

interface TrainingData {
    month_year: string;
    operators_joined: number;
    operators_trained: number;
    year: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const Training: React.FC = () => {
    const [data1, setData1] = useState<number[]>([]);
    const [data2, setData2] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchTrainingData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get<TrainingData[]>(`${API_BASE_URL}/chart/operators/`);

                // console.log("Fetched Training Data:", response.data); 

                if (response.data && response.data.length > 0) {
                    const sortedData = response.data.sort((a, b) =>
                        new Date(a.month_year).getTime() - new Date(b.month_year).getTime()
                    );

                    const months = sortedData.map(item => {
                        const date = new Date(item.month_year);
                        const monthShort = date.toLocaleString('default', { month: 'short' });
                        const yearShort = date.getFullYear().toString().slice(-2);
                        return `${monthShort} ${yearShort}`;
                    });

                    const joined = sortedData.map(item => item.operators_joined);
                    const trained = sortedData.map(item => item.operators_trained);

                    // console.log("Months:", months);       
                    // console.log("Joined:", joined);        
                    // console.log("Trained:", trained);      

                    setLabels(months);
                    setData1(joined);
                    setData2(trained);
                } else {
                    setLabels(["No data available"]);
                    setData1([0]);
                    setData2([0]);
                }
            } catch (err) {
                console.error("Error fetching training data:", err);
                setError("Failed to load training data");
                setLabels(["Error loading data"]);
                setData1([0]);
                setData2([0]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingData();
    }, []);

    const title = "Operators Training - Joined vs Trained";
        
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="p-4">
                {loading ? (
                    <div className="w-full h-36 flex items-center justify-center">
                        <p className="text-gray-500">Loading data...</p>
                    </div>
                ) : error ? (
                    <div className="w-full h-36 flex items-center justify-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="w-full h-36">
                        <LineGraph
                            labels={labels}
                            data1={data1} 
                            data2={data2}  
                            area={true}
                            showSecondLine={true}
                            label1="Operators Joined"
                            label2="Operators Trained"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Training;