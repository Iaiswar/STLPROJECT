import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface StatisticsProps {
  selectedProfile: string;
}

// Employee names
const employeeNames = [
  "Amit Sharma", "Priya Verma", "Ravi Kumar", "Neha Singh", "Suresh Iyer",
  "Vikram Patel", "Ananya Nair", "Manoj Mehta", "Sneha Reddy", "Rahul Choudhary",
  "Kiran Joshi", "Siddharth Rao", "Pooja Desai", "Arun Menon", "Meera Kapoor",
  "Tarun Bhatia", "Swati Saxena", "Deepak Malhotra", "Roshni Pillai", "Anil Agrawal"
];

// Generate mock training data dynamically
const generateRandomTrainingData = (): number[] => 
  Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1); // Random hours (1-6)

const trainingData: Record<string, number[]> = employeeNames.reduce((acc, name) => {
  acc[name] = generateRandomTrainingData();
  return acc;
}, {} as Record<string, number[]>);

const Statistics: React.FC<StatisticsProps> = ({ selectedProfile }) => {
  const [chartData, setChartData] = useState<number[]>(trainingData[selectedProfile] || []);
  
  useEffect(() => {
    // Update chart data when the selected profile changes
    setChartData(trainingData[selectedProfile] || []);
  }, [selectedProfile]);
  
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Total Training Hours',
        data: chartData, // Use dynamic data
        backgroundColor: '#344BFd',
        borderRadius: 5,
        barPercentage: 1.0,
        categoryPercentage: 0.9,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `${tooltipItem.dataset.label}: ${tooltipItem.raw} hours`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 },
        grid: { display: false },
      },
      y: {
        display: true,
        title: { display: true, text: 'Total Hours' },
        grid: { display: true },
        beginAtZero: true,
        ticks: { padding: 12 },
      },
    },
  };
  
  return (
    <div className="flex-1 min-w-[200px] h-full p-5 rounded-lg shadow-md text-center">
      <h2 className="text-lg font-bold mb-2 text-[#16163e]">Weekly Training Hours</h2>
      <div className="relative  mt-5">
        <Bar data={data} options={options} />
      </div>
      {/* <button className="bg-blue-100 text-blue-600 rounded px-2 py-2 cursor-pointer text-sm mt-2 w-20 h-10 relative -bottom-8 hover:bg-gray-200">
        View
      </button> */}
    </div>
  );
};

export default Statistics;