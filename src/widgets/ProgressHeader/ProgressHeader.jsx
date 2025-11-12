import React from "react";
import styles from "../../widgets/ProgressHeader/ProgressHeader.module.css";

const ProgressHeader = ({ step, totalSteps }) => {
  const barWidth = 35 * totalSteps + "px";

  return (
    <div className={styles.ProgressHeader}>
      {/* Step text */}
      <div className={styles.steptext}>
        Step: <span className={styles.stepnumber}>{step + 1}</span>
      </div>

      {/* Step blocks */}
      <div className={styles.steps} style={{ width: barWidth }}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const currentStep = index + 1;
          const isActive = currentStep <= step + 1;

          let className = `${styles.stepblock}`;
          if (index === 0) className += ` ${styles.first}`;
          else if (index === totalSteps - 1) className += ` ${styles.last}`;
          else className += ` ${styles.middle}`;

          if (isActive) className += ` ${styles.active}`;

          return <div key={index} className={className} />;
        })}
      </div>
    </div>
  );
};

export default ProgressHeader;
