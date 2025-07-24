import React, { useEffect, useState } from "react";
import BarChart from "../../Barchart/barchart";

interface PlanProps {
  selectedPlant: string;
}

const PlanTwo: React.FC<PlanProps> = ({ selectedPlant }) => {
  const [data1, setData1] = useState<number[]>(new Array(12).fill(2));
  const [data2, setData2] = useState<number[]>([]);

  useEffect(() => {
    // Generate `data2` with values 1 or 2 randomly
    const generateRandomData2 = () => {
      return new Array(12).fill(0).map(() => (Math.random() < 0.5 ? 1 : 2));
    };

    setData1(new Array(12).fill(2)); // `data1` is always `2`
    setData2(generateRandomData2()); // `data2` is either `1` or `2`
  }, [selectedPlant]);

  // Dynamic title based on selection
  const title = selectedPlant === "All Plants" 
    ? "No of Trainings Plan vs Actual - All Plants" 
    : `No of Trainings Plan vs Actual - ${selectedPlant}`;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <BarChart
        labels={[
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ]}
        data1={data1}
        data2={data2}
        groupLabels={["Plan", "Actual"]}
        title={title}
        color1="rgba(52, 152, 219, 0.8)" // Blue
        color2="rgba(13, 32, 160, 0.8)" // Dark Blue
      />
    </div>
  );
};

export default PlanTwo;
