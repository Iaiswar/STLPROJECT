import React, { useEffect, useState } from "react";
import LineGraph from "../../LineGraph/linegraph";

interface DefectsProps {
  selectedPlant: string;
}

const Defects: React.FC<DefectsProps> = ({ selectedPlant }) => {
  const [data1, setData1] = useState<number[]>([]);
  const [data2, setData2] = useState<number[]>([]);

  const generateStrictlyGreaterData = (
    minPlan: number,
    maxPlan: number,
    count: number,
    buffer: number
  ) => {
    const plan: number[] = [];
    const actual: number[] = [];

    for (let i = 0; i < count; i++) {
      const p = Math.floor(Math.random() * (maxPlan - minPlan + 1)) + minPlan;
      const aMax = Math.max(p - buffer, 1);
      const a = Math.floor(Math.random() * (aMax - 1 + 1)) + 1;
      plan.push(p);
      actual.push(a);
    }

    return [plan, actual];
  };

  useEffect(() => {
    const count = 6;
    const buffer = 3;

    if (selectedPlant === "All Plants") {
      const [generated1, generated2] = generateStrictlyGreaterData(20, 50, count, buffer);
      setData1(generated1);
      setData2(generated2);
    } else {
      const plantNumber = parseInt(selectedPlant.replace("Plant ", ""));
      const baseMin = 10 + plantNumber;
      const baseMax = 40 + plantNumber;
      const [generated1, generated2] = generateStrictlyGreaterData(baseMin, baseMax, count, buffer);
      setData1(generated1);
      setData2(generated2);
    }
  }, [selectedPlant]);

  const title =
    selectedPlant === "All Plants"
      ? "Man Related Defects Trend at MSIL"
      : "Man Related Defects Trend at MSIL";

  return (
    <div style={{ width: "100%", height: "145px", margin: "auto" }}>
      <h5
        style={{
          color: "black",
          margin: "0 0 10px 0",
          padding: "10px",
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {title}
      </h5>

      <LineGraph
        labels={[
          "Jan 2024",
          "Feb 2024",
          "Mar 2024",
          "Apr 2024",
          "May 2024",
          "Jun 2024",
        ]}
        data1={data1}
        data2={data2}
        area={false}
        showSecondLine={true}
        label1="Overall Defects"
        label2="Defect from CTQ Stations"
      />
    </div>
  );
};

export default Defects;
