import React from "react";
import styles from "./trainingcard.module.css";

interface BoxProps {
  number: number;
  text: string;
  bgColor: string;
}

interface TrainingSummaryCardProps {
  title: string;
  data: BoxProps[];
}

const   TrainingSummaryCard: React.FC<TrainingSummaryCardProps> = ({ title, data }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.boxContainer}>
        {data.map((item, index) => (
          <div
            key={index}
            className={styles.box}
            style={{ backgroundColor: item.bgColor }}
          >
            <span className={styles.number}>{item.number}</span>
            <span className={styles.text}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingSummaryCard;
