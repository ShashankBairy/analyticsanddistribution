import React from 'react';
import { mapBackendStatusToDisplay } from '../../ApplicationStatus/utils/statusMapping';
import styles from '../ApplicationStatusTable.module.css';

/**
 * StatusCell component for rendering status badges
 * Extracts status mapping logic from main component
 */
const StatusCell = ({ status }) => {
  const displayStatus = mapBackendStatusToDisplay(status);
  
  return (
    <span
      className={`${styles.Application_Status_Table_status_badge} ${
        styles[displayStatus.replace(/\s+/g, "").toLowerCase()] || ""
      }`}
    >
      {displayStatus}
    </span>
  );
};

export default StatusCell;
