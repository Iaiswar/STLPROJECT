import styles from "./DashboardHeader.module.css";

type DashboardHeaderProps = {
  title: string;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  return <div className={styles.header}>
    <div >NL TECHNOLOGIES</div>
    <div  className={styles.title}>{title}</div>
 
    </div>;
};

export default DashboardHeader;
