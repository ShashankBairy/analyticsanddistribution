import { useEffect, useRef, useState } from "react";
import styles from "./FilterPanel.module.css";
 
const FilterPanel = ({
  activeTab,
  setActiveTab,
  selectedCampus,
  setSelectedCampus,
  studentCategory,
  setStudentCategory,
}) => {
  const [isCampusOpen, setIsCampusOpen] = useState(false);
  const [campusSearch, setCampusSearch] = useState("");
 
  const panelRef = useRef(null);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsCampusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const handleCategoryChange = (category) => {
    setStudentCategory((prev) => {
      if (category === "all") {
        return {
          all: !prev.all,
          sold: false,
          confirmed: false,
          unsold: false,
          withPro: false,
          damaged: false,
        };
      } else {
        const newState = { ...prev, [category]: !prev[category], all: false };
        const noOtherCategoriesSelected =
          !newState.sold &&
          !newState.confirmed &&
          !newState.unsold &&
          !newState.withPro &&
          !newState.damaged;
        if (noOtherCategoriesSelected) {
          newState.all = true;
        }
        return newState;
      }
    });
  };
 
  const handleResetFilters = () => {
    setSelectedCampus("All Campuses");
    setStudentCategory({
      all: true,
      sold: false,
      confirmed: false,
      unsold: false,
      withPro: false,
      damaged: false,
    });
    setActiveTab("campus");
  };
 
  const filteredCampuses = [
    "All Campuses",
    "Campus A",
    "Campus B",
    "Campus C",
    "Campus D",
  ].filter((campus) =>
    campus.toLowerCase().includes(campusSearch.toLowerCase())
  );
 
  return (
    <div className={styles.filter_panel} ref={panelRef}>
  
 
      {/* Student Category */}
      <div className={styles.filter_panel__student_category}>
        <label className={styles.filter_panel__student_category_label}>
          Application Category
        </label>
        <div className={styles.filter_panel__student_category_grid}>
          {[
            { key: "all", label: "All" },
            { key: "sold", label: "Sold" },
            { key: "confirmed", label: "Confirmed" },
            { key: "unsold", label: "Unsold" },
            { key: "withPro", label: "With PRO" },
            { key: "damaged", label: "Damaged" },
          ].map(({ key, label }) => (
            <div className={styles.filter_panel__category_item} key={key}>
              <input
                type="checkbox"
                className={styles.filter_panel__checkbox}
                id={key}
                checked={studentCategory[key]}
                onChange={() => handleCategoryChange(key)}
              />
              <label
                htmlFor={key}
                className={styles.filter_panel__checkbox_label}
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default FilterPanel;
 