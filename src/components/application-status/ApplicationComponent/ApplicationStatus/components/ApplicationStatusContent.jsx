import React from 'react';
import styles from '../ApplicationStatus.module.css';
import ApplicationStatusTable from '../../ApplicationStatusTable/ApplicationStatusTable';
import SearchCards from '../../SearchComponent/SearchCards';

const ApplicationStatusContent = ({
  search,
  filteredData,
  pageIndex,
  setPageIndex,
  handleCardClick,
  setData
}) => {
  if (search) {
    return filteredData.length === 0 ? (
      <p className={styles["application-status__no-results"]}>
        No results found for "{search}"
      </p>
    ) : (
      <SearchCards
        data={filteredData}
        maxResults={5}
        onCardClick={handleCardClick}
      />
    );
  }

  if (filteredData.length === 0) {
    return (
      <p className={styles["application-status__no-results"]}>
        No results found
      </p>
    );
  }

  return (
    <ApplicationStatusTable
      filteredData={filteredData}
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
      setData={setData}
    />
  );
};

export default ApplicationStatusContent;
