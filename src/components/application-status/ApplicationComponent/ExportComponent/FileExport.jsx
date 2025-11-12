import React, { useState } from "react";
import styles from "./FileExport.module.css";
import {
  exportToPDF,
  exportToXLS,
  exportToDOC,
  getSelectedRecords,
  hasSelectedRecords,
} from "./utils/exportUtils";

const FileExport = ({ onExport, data = [], position = "middle" }) => {
  const [selectedType, setSelectedType] = useState("Pdf");
  const fileTypes = ["Pdf", ".xls", "doc"];

  const handleSelect = (type) => {
    setSelectedType(type);
    const selectedRecords = getSelectedRecords(data);

    if (selectedRecords.length === 0) {
      console.warn("Please select at least one record to export.");
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `application-status-${timestamp}`;

    switch (type) {
      case "Pdf":
        exportToPDF(selectedRecords, `${filename}.pdf`);
        break;
      case ".xls":
        exportToXLS(selectedRecords, `${filename}.xls`);
        break;
      case "doc":
        exportToDOC(selectedRecords, `${filename}.doc`);
        break;
      default:
        console.warn("Unknown export type:", type);
    }

    if (onExport) {
      onExport(type, selectedRecords);
    }
  };

  const hasSelection = hasSelectedRecords(data);

  return (
    <div
      className={`${styles.exportContainer} ${
        position === "left"
          ? styles.leftPosition
          : position === "right"
          ? styles.rightPosition
          : styles.middlePosition
      }`}
    >
      <div className={styles.fileTypeWrapper}>
        <span className={styles.fileTypeLabel}>File Type</span>
        <div className={styles.fileTypeOptions}>
          {fileTypes.map((type) => (
            <button
              key={type}
              className={`${styles.fileTypeBtn} ${
                selectedType === type ? styles.active : ""
              }`}
              onClick={() => handleSelect(type)}
              disabled={!hasSelection}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExport;
