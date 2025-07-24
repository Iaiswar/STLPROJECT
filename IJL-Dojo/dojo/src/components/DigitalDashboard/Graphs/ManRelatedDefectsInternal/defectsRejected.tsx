import React from "react";
import LineGraph from "../../LineGraph/linegraph"; // Adjust path as needed

interface DefectsRejectedProps {
  selectedPlant: string;
  title?: string;
  data1: number[];
  data2: number[];
  labels: string[];
  label1?: string;
  label2?: string;
}

const DefectsRejected: React.FC<DefectsRejectedProps> = ({ 
  selectedPlant,
  title,
  data1,
  data2,
  labels,
  label1 = "All Stations",
  label2 = "CTQ Stations"
}) => {
  // Calculate the default title if none is provided
  const defaultTitle = selectedPlant === "All Plants" 
    ? "Man Related Defects Internal Rejection Overall & CTQ - All Plants" 
    : `Man Related Defects Internal Rejection Overall & CTQ - ${selectedPlant}`;
  
  // Use provided title or default
  const displayTitle = title || defaultTitle;

  return (
    <div style={{ width: "100%", height: "145px", margin: "auto" }}>
      <h5 
        style={{ 
          color: "black", 
          margin: "0 0 10px 0", 
          padding:"10px", 
          fontSize: "16px", 
          fontFamily: "Arial, sans-serif" 
        }}
      >
        {displayTitle}
      </h5>
      <LineGraph 
        labels={labels}
        data1={data1}
        data2={data2}
        area={false}
        showSecondLine={true}
        label1={label1}
        label2={label2}
      />
    </div>
  );
};

export default DefectsRejected;