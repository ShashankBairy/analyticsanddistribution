import React from 'react';
import styles from '../ApplicationStatus.module.css';
import searchIcon from '../../../../../assets/application-status/Group.svg';
import filterIcon from '../../../../../assets/application-status/Filter.svg';
import appliedFilterIcon from '../../../../../assets/application-status/Vector.svg';
import exportIcon from '../../../../../assets/application-status/Arrow up.svg';
import FilterPanel from '../../FilterComponent/FilterPanel';
import FileExport from '../../ExportComponent/FileExport';

const ApplicationStatusHeader = ({
  search,
  handleSearchChange,
  showFilter,
  setShowFilter,
  showExport,
  setShowExport,
  isFilterApplied,
  activeTab,
  setActiveTab,
  selectedCampus,
  setSelectedCampus,
  studentCategory,
  setStudentCategory,
  data = [] // Add data prop
}) => {
  return (
    <div className={styles["application-status__actions"]}>
      <div className={styles["application-status__search"]}>
        <figure className={styles["application-status__search-icon"]}>
          <img src={searchIcon} alt="Search" />
        </figure>
        <input
          type="text"
          placeholder="Search with application no"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      {!search && (
        <div className={styles["application-status__filter"]}>
          <button
            className={styles["application-status__filter-btn"]}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <span className={styles["application-status__filter-icon-wrapper"]}>
              <img
                src={isFilterApplied ? appliedFilterIcon : filterIcon}
                alt="Filter"
              />
              {isFilterApplied && (
                <span className={styles["application-status__filter-dot"]}></span>
              )}
            </span>
            Filter
          </button>
          {showFilter && (
            <FilterPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedCampus={selectedCampus}
              setSelectedCampus={setSelectedCampus}
              studentCategory={studentCategory}
              setStudentCategory={setStudentCategory}
            />
          )}
        </div>
      )}
      {!search && (
        <div className={styles["application-status__export"]}>
          <button
            className={styles["application-status__export-btn"]}
            onClick={() => setShowExport((prev) => !prev)}
          >
            <img src={exportIcon} alt="Export" /> Export
          </button>
          {showExport && (
            <FileExport 
            
              onExport={(type, selectedRecords) => {
                console.log("Export:", type, "Records:", selectedRecords.length);
                setShowExport(false); // Close dropdown after export
              }} 
              data={data}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusHeader;
