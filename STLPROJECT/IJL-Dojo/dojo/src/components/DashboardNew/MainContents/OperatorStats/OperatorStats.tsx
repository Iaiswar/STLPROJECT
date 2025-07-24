import styles from "./OperatorStats.module.css";

type OperatorStatsProps = {
  level: string;
  required: number;
  available: number;
};

const OperatorStats: React.FC<{ data: OperatorStatsProps[] }> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Operators Required Vs Available</h2>
      <div className={styles.grid}>
        {data.map((stat, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.card}>
              <h3 className={styles.value}>{stat.required}</h3>
              <p className={styles.label}>{stat.level} Required</p>
            </div>
            <div className={styles.cardAvailable}>
              <h3 className={styles.value}>{stat.available}</h3>
              <p className={styles.label}>{stat.level} Available</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatorStats;
