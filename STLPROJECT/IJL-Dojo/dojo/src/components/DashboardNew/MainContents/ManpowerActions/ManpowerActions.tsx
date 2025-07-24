import { useState } from "react";
import styles from "./ManpowerActions.module.css";

type ManpowerActionsProps = {
  title: string;
  data: string[];
};

const ManpowerActions: React.FC<ManpowerActionsProps> = ({ title, data }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
  <div className={styles.list}>
    {data.map((action, index) => (
      <div key={index} className={styles.item}>
        {action}
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default ManpowerActions;
