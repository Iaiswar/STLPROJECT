// import React, { useEffect, useState } from "react";
// import LineGraph from "../../LineGraph/linegraph";
// import axios from "axios";

// interface DefectsRejectedProps {
//   selectedPlant: string;
// }

// interface DefectData {
//   id: number;
//   month: string;
//   total_defects: number;
//   ctq_defects: number;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const DefectsRejected: React.FC<DefectsRejectedProps> = ({ selectedPlant }) => {
//   const [data1, setData1] = useState<number[]>([]);
//   const [data2, setData2] = useState<number[]>([]);
//   const [labels, setLabels] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDefectsData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // console.log(`Fetching CTQ defects data for ${selectedPlant}`);
//         const response = await axios.get<DefectData[]>(`${API_BASE_URL}/ctq-defects-all-plants/`, {
//           params: {
//             plant: selectedPlant === "All Plants" ? "all" : selectedPlant
//           }
//         });

//         // console.log("CTQ Defects API Response:", response.data);

//         if (response.data && response.data.length > 0) {
//           // Sort data by month
//           const sortedData = response.data.sort((a, b) => 
//             new Date(a.month).getTime() - new Date(b.month).getTime()
//           );

//           // Format month labels
//           const monthLabels = sortedData.map(item => {
//             const date = new Date(item.month);
//             return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
//           });

//           // Extract defects data
//           const allStationsDefects = sortedData.map(item => item.total_defects);
//           const ctqStationsDefects = sortedData.map(item => item.ctq_defects);

//           setLabels(monthLabels);
//           setData1(allStationsDefects);
//           setData2(ctqStationsDefects);
//         } else {
//           console.log("No CTQ defects data available");
//           setLabels(["No data"]);
//           setData1([0]);
//           setData2([0]);
//         }
//       } catch (err) {
//         console.error("Error fetching CTQ defects data:", err);
//         setError("Failed to load CTQ defects data");
//         setLabels(["Error"]);
//         setData1([0]);
//         setData2([0]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDefectsData();
//   }, [selectedPlant]);

//   const title = selectedPlant === "All Plants" 
//     ? "CTQ Related Defects - All Plants" 
//     : `CTQ Related Defects - ${selectedPlant}`;

//   return (
//     <div style={{ width: "100%", height: "145px", margin: "auto" }}>
//       <h5 style={{
//         color: "black",
//         margin: "0 0 10px 0",
//         padding: "10px",
//         fontSize: "16px",
//         fontFamily: "Arial, sans-serif"
//       }}>
//         {title}
//       </h5>

//       {loading ? (
//         <div style={{ 
//           height: "100px", 
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "center",
//           color: "#666"
//         }}>
//           Loading CTQ defects data...
//         </div>
//       ) : error ? (
//         <div style={{ 
//           height: "100px", 
//           display: "flex", 
//           alignItems: "center", 
//           justifyContent: "center",
//           color: "red"
//         }}>
//           {error}
//         </div>
//       ) : (
//         <LineGraph
//           labels={labels}
//           data1={data1}
//           data2={data2}
//           area={false}
//           showSecondLine={true}
//           label1="All Stations"
//           label2="CTQ Stations"
//         />
//       )}
//     </div>
//   );
// };

// export default DefectsRejected;


import React, { useEffect, useState } from "react";
import LineGraph from "../../LineGraph/linegraph";
import axios from "axios";

interface DefectData {
  month_year: string;
  total_internal_rejection: number;
  ctq_internal_rejection: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const DefectsRejected: React.FC = () => {
  const [data1, setData1] = useState<number[]>([]);
  const [data2, setData2] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefectsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<DefectData>(`${API_BASE_URL}/current-month/defects-data/`);
        
        // console.log("API Response:", response.data);

        if (response.data) {
          // Convert single object to array with one element
          const dataArray = [response.data];
          
          // Format month label
          const date = new Date(dataArray[0].month_year);
          const monthShort = date.toLocaleString('default', { month: 'short' });
          const yearShort = date.getFullYear().toString().slice(-2);
          const monthLabel = `${monthShort} ${yearShort}`;

          setLabels([monthLabel]);
          setData1([dataArray[0].total_internal_rejection]);
          setData2([dataArray[0].ctq_internal_rejection]);
        } else {
          // console.warn("No valid data received");
          setLabels(["No data available"]);
          setData1([0]);
          setData2([0]);
        }
      } catch (err) {
        console.error("Error fetching CTQ defects data:", err);
        setError("Failed to load CTQ defects data");
        setLabels(["Error loading data"]);
        setData1([0]);
        setData2([0]);
      } finally {
        setLoading(false);
      }
    };

    fetchDefectsData();
  }, []);

  const title = "Total Rejections - MSIL";

  return (
    <div style={{ width: "100%", height: "145px", margin: "auto" }}>
      <h5 style={{
        color: "black",
        margin: "0 0 10px 0",
        padding: "10px",
        fontSize: "16px",
        fontFamily: "Arial, sans-serif"
      }}>
        {title}
      </h5>

      {loading ? (
        <div style={{
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666"
        }}>
          Loading CTQ defects data...
        </div>
      ) : error ? (
        <div style={{
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red"
        }}>
          {error}
        </div>
      ) : (
        <div style={{ height: "100%" }}>
          <LineGraph
            labels={labels}
            data1={data1}
            data2={data2}
            area={false}
            showSecondLine={true}
            label1="All Stations"
            label2="CTQ Stations"
          />
        </div>
      )}
    </div>
  );
};

export default DefectsRejected;