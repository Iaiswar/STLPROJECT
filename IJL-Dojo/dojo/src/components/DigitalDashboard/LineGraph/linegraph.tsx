import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface LineGraphProps {
  labels: string[]; // X-axis labels (Months)
  data1: number[]; // First line dataset
  data2?: number[]; // Second line dataset (Optional)
  area?: boolean; // Fill area under the lines
  showSecondLine?: boolean; // Show/Hide second line
  label1: string; // Label for first line
  label2?: string; // Label for second line
}

const LineGraph: React.FC<LineGraphProps> = ({
  labels,
  data1,
  data2,
  area = false,
  showSecondLine = true,
  label1,
  label2,
}) => {
  const chartData: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: label1,
        data: data1,
        borderColor: "#3498db",
        backgroundColor: area ? "rgba(98, 169, 217, 0.2)" : "transparent",
        fill: area,
        borderWidth: 2,
        pointRadius: 0  ,
        pointBackgroundColor: "#3498db",
        pointBorderColor: "#2980b9",
        pointBorderWidth: 2,
        pointStyle: "circle",
        tension: 0.1,
        borderJoinStyle: "miter" as CanvasLineJoin,
      },
      ...(showSecondLine && data2
        ? [
            {
              label: label2 || "Second Line",
              data: data2,
              borderColor: "rgba(15, 86, 132, 0.2)",
              backgroundColor: area ? "rgba(15, 86, 132, 0.2)" : "transparent",
              fill: area,
              borderWidth: 2,
              pointRadius: 0,
              pointBackgroundColor: "rgba(15, 86, 132, 0.2)",
              pointBorderColor: "#rgba(15, 86, 132, 0.2)",
              pointBorderWidth: 1,
              pointStyle: "circle",
              tension: 0.1,
              borderJoinStyle: "miter" as CanvasLineJoin,
            },
          ]
        : []),
    ],
  };
  
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          callback: function (value, index) {
            return index % 2 === 0 ? labels[index] : "";
          },
          color: "#333",
        },
      },
      y: {
        beginAtZero: true,
        ticks: { display: false },
        grid: { 
          display: false,
          drawTicks: false, 
          drawBorder: false 
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "start",
        labels: {
          color: "#333",
          font: { size: 12 },
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        displayColors: true,
      },
    },
  };

  return <Line data={chartData} options={options} plugins={[{
    id: 'dataLabels',
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (!meta.hidden) {
          meta.data.forEach((element, index) => {
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.font = 'bold 8px Arial';
            
            // const dataValue = dataset.data[index];
            // if (dataValue !== null && dataValue !== undefined) {
            //   // First dataset (index 0): Position labels ABOVE the points
            //   if (datasetIndex === 0) {
            //     ctx.textBaseline = 'bottom';
            //     ctx.fillText(dataValue.toString(), element.x, element.y - 10);
            //   } 
            //   // Second dataset (index 1): Position labels BELOW the points
            //   else if (datasetIndex === 1) {
            //     ctx.textBaseline = 'top';
            //     ctx.fillText(dataValue.toString(), element.x, element.y + 10);
            //   }
            // }
          });
        }
      });
    }
  }]} />;
};

export default LineGraph;