import styles from "./ManpowerAvailability.module.css";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const generateRandomData = () => {
  const baseData = [
    { month: "April", required: 83, available: 66 },
    { month: "May", required: 83, available: 82 },
    { month: "June", required: 95, available: 83 },
    { month: "July", required: 83, available: 80 },
    { month: "August", required: 83, available: 83 },
    { month: "September", required: 95, available: 83 },
    { month: "October", required: 92, available: 83 },
    { month: "November", required: 83, available: 83 },
    { month: "December", required: 90, available: 83 },
    { month: "January", required: 83, available: 82 },
    { month: "February", required: 83, available: 82 },
    { month: "March", required: 83, available: 80 },
  ];

  return baseData.map((entry) => ({
    ...entry,
    required: Math.floor(entry.required * (0.9 + Math.random() * 0.2)),
    available: Math.floor(entry.available * (0.9 + Math.random() * 0.2)),
  }));
};

const ManpowerAvailability: React.FC = () => {
  const data = generateRandomData();

  const monthYearMap: { [key: string]: number } = {
    April: 2024, May: 2024, June: 2024, July: 2024, August: 2024,
    September: 2024, October: 2024, November: 2024, December: 2024,
    January: 2025, February: 2025, March: 2025,
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manpower Availability Trend</h2>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.requiredDot}></span> Required
        </div>
        <div className={styles.legendItem}>
          <span className={styles.availableDot}></span> Available
        </div>
      </div>

      <ResponsiveContainer width="100%" className={styles.responsiveContainer}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }} barGap={0}>
          <Tooltip />
          <XAxis 
            dataKey="month" 
            tick={({ x, y, payload }) => {
              const month = payload.value;
              const year = monthYearMap[month];
              return (
                <g transform={`translate(${x},${y})`}>
                  <text x={0} y={0} dy={10} textAnchor="end" fontSize={10} fill="#000000" transform="rotate(-90)">
                    {month}
                  </text>
                  {(month === "January" || month === "April") && (
                    <text x={20} y={50} dy={10} textAnchor="middle" fontSize={12} fill="#000000">
                      {year}
                    </text>
                  )}
                </g>
              );
            }}
            interval={0}
            axisLine={false}
          />
          <Bar dataKey="required" fill="#007bff" name="Required">
            <LabelList dataKey="required" position="top" fill="#000000" fontSize={12} />
          </Bar>
          <Bar dataKey="available" fill="#002366" name="Available">
            <LabelList dataKey="available" position="top" fill="#000000" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ManpowerAvailability;
