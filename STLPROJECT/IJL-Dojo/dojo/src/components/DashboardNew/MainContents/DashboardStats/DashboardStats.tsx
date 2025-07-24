import styles from "./DashboardStats.module.css";

type StatCardProps = {
    value: number;
    label: string;
    color?: string; // Now allows any string
  }
const StatCard: React.FC<StatCardProps> = ({ value, label, color = "dark" }) => {
    
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <h2 className={styles.value}>{value}</h2>
      <p className={styles.label}>{label}</p>
    </div>
  );
};

type DashboardStatsProps = {
    data: StatCardProps[];
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  return (
    <div className={styles.dashboard}>
      {data.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
