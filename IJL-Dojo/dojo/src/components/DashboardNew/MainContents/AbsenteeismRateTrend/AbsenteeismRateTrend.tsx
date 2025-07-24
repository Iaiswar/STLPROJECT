import styles from "./AbsenteeismRateTrend.module.css";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, LabelList } from "recharts";

const generateRandomData = () => {
    const baseData = [
        { month: "Apr 2024", value: 8 },
        { month: "Aug 2024", value: 5 },
        { month: "Dec 2024", value: 5 },
        { month: "Feb 2025", value: 8 },
        { month: "Jan 2025", value: 0 },
        { month: "Jul 2024", value: 5 },
        { month: "Jun 2024", value: 7 },
        { month: "Mar 2025", value: 7 },
        { month: "May 2024", value: 7 },
        { month: "Nov 2024", value: 4 },
        { month: "Oct 2024", value: 6 },
        { month: "Sep 2024", value: 9 }
    ];
    
    return baseData.map(entry => ({
        ...entry,
        value: Math.max(0, Math.floor(entry.value * (0.8 + Math.random() * 0.4)))
    }));
};

const AbsenteeismRateTrend: React.FC = () => {
    const data = generateRandomData();
    
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Absenteeism Rate Trend</h2>
            <ResponsiveContainer width="100%" className={styles.responsiveContainer}>
                <AreaChart data={data}>
                    <XAxis
                        dataKey="month"
                        ticks={["Apr 2024", "Jul 2024", "Oct 2024", "Jan 2025"]}
                    />
                    <Tooltip />
                    <Area type="linear" dataKey="value" stroke="#007bff" fill="#007bff66" strokeWidth={2}>
                        <LabelList dataKey="value" position="top" formatter={(value : number) => (value === 0 ? "" : value.toString())} dy={-10} />
                    </Area>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AbsenteeismRateTrend;