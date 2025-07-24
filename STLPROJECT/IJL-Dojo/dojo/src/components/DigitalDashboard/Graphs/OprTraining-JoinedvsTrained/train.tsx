import React, { useEffect, useState } from "react";
import LineGraph from "../../LineGraph/linegraph"; // Adjust path as needed

interface TrainingProps {
    selectedPlant: string;
    operatorsTrainingData?: {
        month: string;
        operatorsJoined: number;
        operatorsTrained: number;
    }[];
}

const Training: React.FC<TrainingProps> = ({ selectedPlant, operatorsTrainingData }) => {
    const [data1, setData1] = useState<number[]>([10, 20, 15, 30, 25, 35]);
    const [data2, setData2] = useState<number[]>([5, 15, 10, 25, 20, 30]);
    const [labels, setLabels] = useState<string[]>(["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024"]);
    
    // Use the operatorsTrainingData if provided
    useEffect(() => {
        if (operatorsTrainingData && operatorsTrainingData.length > 0) {
            const months = operatorsTrainingData.map(item => item.month);
            const joined = operatorsTrainingData.map(item => item.operatorsJoined);
            const trained = operatorsTrainingData.map(item => item.operatorsTrained);
    
            setLabels(months);
            setData1(joined);
            setData2(trained);
            return;
        }
    
        const count = 6;
    
        const generateDataSets = (min2: number, max2: number, maxOffset: number) => {
            const d1: number[] = [];
            const d2: number[] = [];
    
            for (let i = 0; i < count; i++) {
                const val2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
                const offset = Math.floor(Math.random() * maxOffset) + 1;
                const val1 = val2 + offset;
    
                d2.push(val2);
                d1.push(val1);
            }
    
            return { d1, d2 };
        };
    
        if (selectedPlant === "All Plants") {
            const { d1, d2 } = generateDataSets(10, 35, 8); // All plants logic
            setData1(d1);
            setData2(d2);
        } else {
            const plantNumber = parseInt(selectedPlant.replace("Plant ", ""));
            const min2 = 5 + plantNumber;
            const max2 = 35 + plantNumber;
            const offsetRange = 6;
            const { d1, d2 } = generateDataSets(min2, max2, offsetRange);
            setData1(d1);
            setData2(d2);
        }
    }, [selectedPlant, operatorsTrainingData]);
    

    const title = selectedPlant === "All Plants"
        ? "Operators Training - Joined vs Trained - All Plants"
        : `Operators Training - Joined vs Trained - ${selectedPlant}`;
        
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
    );
};

export default Training;