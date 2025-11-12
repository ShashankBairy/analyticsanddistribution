import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StatusSelector.module.css";
 
const StatusSelector = ({ selectedStatus, onStatusSelect, showOnlyTitle = false, applicationNo }) => {
  const navigate = useNavigate();
  const statuses = ["Sale", "Confirmation", "Damaged"];
 
  const handleStatusClick = (status) => {
    // Call the original onStatusSelect if provided
    if (onStatusSelect) {
      onStatusSelect(status);
    }
   
    // Navigate to the appropriate route
    const pathSegment = status.toLowerCase();
    if (applicationNo) {
      navigate(`/scopes/application/status/${applicationNo}/${pathSegment}`);
    }
  };
 
  if (showOnlyTitle) {
    return (
      <div className={styles.status_section}>
        <h2 className={styles.status_title}>Application Status</h2>
      </div>
    );
  }
 
  return (
    <div className={styles.status_section}>
      <h2 className={styles.status_title}>Application Status</h2>
      <p className={styles.status_instruction}>Select Application Status</p>
      <nav className={styles.status_options}>
        <ul>
          {statuses.map((status) => (
            <li key={status}>
              <div
                className={`${styles.status_btn} ${
                  selectedStatus === status ? styles.active : ""
                }`}
                onClick={() => handleStatusClick(status)}
                role="tab"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleStatusClick(status)}
              >
                {status}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
 
export default StatusSelector;