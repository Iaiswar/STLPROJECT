import styles from "./AttritionRateTrend.module.css";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, Line, Dot, LabelList } from "recharts";

const generateRandomAttritionData = () => {
  const baseData = [
    { month: "Apr 2024", attrition: 1 },
    { month: "May 2024", attrition: 1 },
    { month: "Jun 2024", attrition: 0 },
    { month: "Jul 2024", attrition: 1 },
    { month: "Aug 2024", attrition: 2 },
    { month: "Sep 2024", attrition: 2 },
    { month: "Oct 2024", attrition: 1 },
    { month: "Nov 2024", attrition: 2 },
    { month: "Dec 2024", attrition: 4 },
    { month: "Jan 2025", attrition: 3 },
    { month: "Feb 2025", attrition: 3 },
    { month: "Mar 2025", attrition: 1 },
  ];

  return baseData.map((entry) => ({
    ...entry,
    attrition: Math.floor(entry.attrition * (0.9 + Math.random() * 0.2)),
  }));
};

const AttritionRateTrend: React.FC = () => {
  const data = generateRandomAttritionData();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Attrition Rate Trend</h2>

      <ResponsiveContainer width="100%" className={styles.responsiveContainer}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
          {/* X-Axis Adjustments */}
          <XAxis 
            dataKey="month" 
            ticks={["Apr 2024", "Jul 2024", "Oct 2024", "Jan 2025"]}
            tick={{ fontSize: 12, fill: "#000" }}
            interval={0} // Ensure all labels appear
            textAnchor="start" // Center labels properly
          />
          <Tooltip />

          {/* Shaded Area with Data Labels */}
          <Area 
            type="linear" 
            dataKey="attrition" 
            stroke="#007bff" 
            fill="#007bff66" 
            strokeWidth={2} 
            dot={{ r: 4, fill: "#007bff", stroke: "#004bb5", strokeWidth: 1 }} 
          >
            <LabelList dataKey="attrition" position="insideTop" fill="#000" fontSize={12} fontWeight="bold" dy={20} />
          </Area>

          {/* Line with Blue Dots */}
          <Line 
            type="monotone" 
            dataKey="attrition" 
            stroke="#007bff" 
            strokeWidth={2}
            dot={({ cx, cy }) => (
              <Dot cx={cx} cy={cy} r={4} fill="#007bff" stroke="#004bb5" strokeWidth={1} />
            )}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttritionRateTrend;