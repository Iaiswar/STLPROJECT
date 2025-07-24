import styles from "./BufferManpowerAvailability.module.css";
import { ComposedChart, Area, XAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const generateRandomData = () => {
  const baseData = [
    { month: "Apr 2024", available: 9 },
    { month: "May 2024", available: 8 },
    { month: "Jun 2024", available: 9 },
    { month: "Jul 2024", available: 8 },
    { month: "Aug 2024", available: 7 },
    { month: "Sep 2024", available: 7 },
    { month: "Oct 2024", available: 7 },
    { month: "Nov 2024", available: 8 },
    { month: "Dec 2024", available: 8 },
    { month: "Jan 2025", available: 8 },
    { month: "Feb 2025", available: 9 },
    { month: "Mar 2025", available: 9 }
  ];

  return baseData.map(entry => ({
    ...entry,
    required: 10, // Required manpower is always 10
    available: Math.max(5, Math.min(10, Math.floor(entry.available * (0.9 + Math.random() * 0.2))))
  }));
};

const BufferManpowerAvailability: React.FC = () => {
  const data = generateRandomData();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Buffer Manpower Availability Trend</h2>

      {/* Legend for Available & Required */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.circle} style={{ backgroundColor: "#00aaff" }}></span> Required
        </div>
        <div className={styles.legendItem}>
          <span className={styles.circle} style={{ backgroundColor: "#040457" }}></span> Available
        </div>
      </div>
      <ResponsiveContainer width="100%" className={styles.responsiveContainer}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
          <XAxis dataKey="month" ticks={["Apr 2024", "Jul 2024", "Oct 2024", "Jan 2025"]} />
          <Tooltip />
          
          {/* Required Manpower Area */}
          <Area 
            type="linear" 
            dataKey="required" 
            stroke="#00aaff" 
            fill="#00aaff66" 
            strokeWidth={2} 
            name="Required Manpower"
          >
            <LabelList 
              dataKey="required" 
              position="top" 
              fill="#000000" 
              fontSize={12} 
              fontWeight="bold" 
              offset={10}
            />
          </Area>

          {/* Available Manpower Area */}
          <Area 
            type="linear" 
            dataKey="available" 
            stroke="#040457" 
            fill="#04045766" 
            strokeWidth={3} 
            dot={false}
            activeDot={false}
            name="Available Manpower"
          >
            <LabelList 
              dataKey="available" 
              position="top" 
              fill="#000000" 
              fontSize={12} 
              fontWeight="bold" 
              offset={10}
            />
          </Area>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BufferManpowerAvailability;