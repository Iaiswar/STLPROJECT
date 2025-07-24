import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

// Import the datalabels plugin
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register components and plugin
ChartJS.register(
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend,
  ChartDataLabels
);

interface BarChartProps {
  labels: string[]; // Months and years on x-axis
  data1: number[]; // First dataset
  data2: number[]; // Second dataset
  groupLabels: string[]; // Labels for bars (e.g., "Group A", "Group B")
  title: string; // Chart title
  color1?: string; // First bar color (optional with default)
  color2?: string; // Second bar color (optional with default)
}

const BarChart: React.FC<BarChartProps> = ({
  labels,
  data1,
  data2,
  groupLabels,
  title,
  color1 = "#FF8C42", // Default orange color
  color2 = "#140b78", // Default light yellow color
}) => {
  const chartData: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: groupLabels[0],
        data: data1,
        backgroundColor: color1,
        borderColor: color1,
        borderWidth: 1,
        borderRadius: 0,
        barPercentage: 0.9, // Slightly reduced to prevent crowding
        categoryPercentage: 0.7,
      },
      {
        label: groupLabels[1],
        data: data2,
        backgroundColor: color2,
        borderColor: color2,
        borderWidth: 1,
        borderRadius: 0,
        barPercentage: 0.9, // Slightly reduced to prevent crowding
        categoryPercentage: 0.7,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: 'start',
        labels: {
          padding: 10, // Increased padding between legend items
          boxWidth: 12, // Smaller color boxes for compactness
          font: {
            size: 10, // Smaller font size for legend
          }
        },
        title: {
          display: false, // No legend title to save space
        }
      },
      title: {
        display: true,
        text: title,
        font: { 
          size: 14, // Smaller title font size
          weight: 'bold'
        },
        padding: {
          top: 5,
          bottom: 10, // Reduced padding below title
        },
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'top',
        formatter: (value) => value,
        font: {
          weight: 'bold',
          size: 10, // Smaller data label font size
        },
        color: '#333',
        offset: -7, // Reduced offset to prevent labels going out of bounds
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: { display: false },
        ticks: {
          padding: 5, // Padding between x-axis labels and chart
          font: {
            size: 9, // Smaller x-axis label font size
          },
          maxRotation: 0, // Prevent label rotation
          autoSkip: false, // Don't skip labels
        },
      },
      y: {
        ticks: { display: false },
        grid: { display: false },
        min: 0,
      },
    },
    layout: {
      padding: {
        left: 2,
        right: 2,
        top: 20, // Reduced top padding
        bottom: 5  // Reduced bottom padding
      }
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      padding: '0',
      margin: '0'
    }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;