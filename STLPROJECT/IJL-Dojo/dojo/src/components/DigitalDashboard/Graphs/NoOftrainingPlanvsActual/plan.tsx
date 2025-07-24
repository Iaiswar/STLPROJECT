import React, { useEffect, useState } from "react";
import BarChart from "../../Barchart/barchart";

interface PlanProps {
  selectedPlant: string;
}

const Plan: React.FC<PlanProps> = ({ selectedPlant }) => {
  const [data1, setData1] = useState<number[]>([]);
  const [data2, setData2] = useState<number[]>([]);

  useEffect(() => {
    const count = 12;

    const generateStrictlyGreaterData = (min: number, max: number, buffer: number) => {
      const data1: number[] = [];
      const data2: number[] = [];

      for (let i = 0; i < count; i++) {
        const plan = Math.floor(Math.random() * (max - min + 1)) + min;
        const actualMax = plan - buffer; // Ensure actual is less than plan by at least buffer
        const actual = Math.floor(Math.random() * (actualMax - 20 + 1)) + 20; // Ensure actual >= 20
        data1.push(plan);
        data2.push(actual);
      }

      return [data1, data2];
    };

    if (selectedPlant === "All Plants") {
      const [generated1, generated2] = generateStrictlyGreaterData(60, 100, 5);
      setData1(generated1);
      setData2(generated2);
    } else {
      const plantNumber = parseInt(selectedPlant.replace("Plant ", ""));
      const [generated1, generated2] = generateStrictlyGreaterData(
        40 + plantNumber * 2,
        90 + plantNumber * 2,
        5
      );
      setData1(generated1);
      setData2(generated2);
    }
  }, [selectedPlant]);

  const title =
    selectedPlant === "All Plants"
      ? "No of Trainings Plan vs Actual - All Plants"
      : `No of Trainings Plan vs Actual`;

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
        color1="rgba(52, 152, 219, 0.8)"
        color2="rgba(13, 32, 160, 0.8)"
      />
    </div>
  );
};

export default Plan;
