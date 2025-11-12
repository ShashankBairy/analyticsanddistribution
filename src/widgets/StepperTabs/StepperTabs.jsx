import React from "react";
import styles from "./StepperTabs.module.css";

const StepperTabs = ({ steps, activeStep, onStepChange }) => {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        let tabClass = "";
        if (activeStep === index) {
          tabClass = styles.active;
        } else if (index < activeStep) {
          tabClass = styles.completed;
        }
        return (
          <div
            key={index}
            className={`${styles.stepper_step_tab} ${tabClass}`}
            onClick={() => onStepChange(index)}
          >
            <span className={styles.stepper_step_number}>{index + 1}</span>
            <span className={styles.stepper_step_label}>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StepperTabs;
