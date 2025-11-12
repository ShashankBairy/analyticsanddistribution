// DistributionUpdateForm.jsx
import React, { useMemo } from "react";
import { Modal } from "@mui/material";
import { useLocation } from "react-router-dom";
import crossicon from "../../assets/application-distribution/crossicon";
import styles from "./DistributionUpdateForm.module.css";

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`; // Format: dd/mm/yyyy
};
 
// --- helper: normalize any date-ish to dd/mm/yyyy ---
const toDDMMYYYY = (val) => {
  if (!val) return "";
  if (typeof val === "string") {
    // already dd/mm/yyyy?
    const ddmm = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(val);
    if (ddmm) return val;
 
    // yyyy-mm-dd or yyyy/mm/dd
    const ymd = /^(\d{4})[-/](\d{2})[-/](\d{2})$/.exec(val);
    if (ymd) {
      const [, y, m, d] = ymd;
      return `${d}/${m}/${y}`;
    }
  }
  // Date object or something parseable
  const dt = new Date(val);
  if (!Number.isNaN(dt.valueOf())) {
    const d = String(dt.getDate()).padStart(2, "0");
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const y = dt.getFullYear();
    return `${d}/${m}/${y}`;
  }
  return "";
};
 
/**
 * Props:
 * - open, onClose
 * - row
 * - fieldMapping: { [tableField]: formField }
 * - onSubmit(updatedRow)
 * - forms: { zone?: ReactComp, dgm?: ReactComp, campus?: ReactComp }
 * - fallbackFormComponent?: ReactComp
 */
const DistributionUpdateForm = ({
  open,
  onClose,
  row,
  fieldMapping = {},
  onSubmit,
  forms = {},
  fallbackFormComponent: FallbackForm,
}) => {
  const { pathname } = useLocation();
 
  const section = useMemo(() => {
    const p = pathname?.toLowerCase() || "";
    if (p.includes("zone")) return "zone";
    if (p.includes("dgm")) return "dgm";
    if (p.includes("campus")) return "campus";
    return null;
  }, [pathname]);
 
  const FormComponent = forms[section] || FallbackForm || null;
 
  const heading = useMemo(() => {
    switch (section) {
      case "zone":
        return "Update Distribution to Zone";
      case "dgm":
        return "Update Distribution to DGM";
      case "campus":
        return "Update Distribution to Campus";
      default:
        return "Update Distribution";
    }
  }, [section]);
 
  const mapRowDataToInitialValues = (rowData) => {
  if (!rowData) return {}; // Early return if no rowData
 
  const mapped = {};
 
  // Map table fields to form fields based on the fieldMapping
  Object.entries(fieldMapping).forEach(([tableField, formField]) => {
    let v = rowData[tableField];
   
    // Normalize date for the issueDate field
    if (formField === "issueDate" && v) {
      v = toDDMMYYYY(v); // Ensure it's in dd/mm/yyyy format for the form
    }
    mapped[formField] = v ?? "";
  });
 
  // If applicationNoFrom and applicationNoTo are available, set them for the form
  if (mapped.applicationNoFrom && !mapped.availableAppNoFrom) {
    mapped.availableAppNoFrom = String(mapped.applicationNoFrom);
  }
  if (mapped.applicationNoTo && !mapped.availableAppNoTo) {
    mapped.availableAppNoTo = String(mapped.applicationNoTo);
  }
 
  // Ensure issueDate is set to today's date if it's missing
  if (!mapped.issueDate) {
    mapped.issueDate = getCurrentDate(); // Set to current date if missing
  }
 
  return { ...rowData, ...mapped }; // Return the merged object with mapped values
};
 
 
  const handleFormSubmit = (values) => {
    const updatedRow = { ...(row || {}) };
    Object.entries(fieldMapping).forEach(([tableField, formField]) => {
      const next = values?.[formField];
      if (next !== undefined) updatedRow[tableField] = next;
    });
    onSubmit?.(updatedRow);
    onClose?.();
  };
 
  return (
    <Modal open={!!open} onClose={onClose}>
      <div className={styles.modal_root}>
        <div className={styles.modal}>
          <div className={styles.modal_top}>
            <div className={styles.modal_top_left}>
              <p className={styles.modal_heading}>{heading}</p>
              <p className={styles.modal_sub}>
                Distribute Applications to all Zones, DGM, and Campuses
              </p>
            </div>
            <div className={styles.xicon} onClick={onClose}>
              {crossicon}
            </div>
          </div>
 
          <div className={styles.modal_form}>
            {row && FormComponent ? (
              <FormComponent
                onSubmit={handleFormSubmit}
                initialValues={mapRowDataToInitialValues(row)}
                isUpdate={true}
                editId={row?.id}
              />
            ) : (
              <div>No form available for this route.</div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
 
export default DistributionUpdateForm;