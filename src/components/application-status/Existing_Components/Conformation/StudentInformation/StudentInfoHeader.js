import React from "react";
import styles from "./StudentInformation.module.css";

const StudentInfoHeader = ({ items }) => {
  return (
    <div className={styles.Student_Information_studentInfoHeader}>
      <div className={styles.Student_Information_studentTextHeader}>
        {items.map((item) => (
          <div key={item.label} className={styles.Student_Information_studentInfoItem}>
            <div className={styles.Student_Information_studentLabel}>{item.label}</div>
            <div className={styles.Student_Information_studentValue}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentInfoHeader;