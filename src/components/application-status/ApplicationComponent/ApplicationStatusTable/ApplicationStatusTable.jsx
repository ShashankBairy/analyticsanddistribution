import React from "react";
import ApplicationStatusDataTable from "../../../../widgets/ApplicationStatusDataTable/ApplicationStatusDataTable";
import { useTableColumns } from "./hooks/useTableColumns";
import { useTableData } from "./hooks/useTableData";
import { useTableNavigation } from "./hooks/useTableNavigation";
import styles from "./ApplicationStatusTable.module.css";

const ApplicationStatusTable = ({ filteredData, setData, pageIndex, setPageIndex }) => {
  const pageSize = 10;

  // Custom hooks for different concerns
  const columns = useTableColumns();
  const { handleSelectRow, paginatedData } = useTableData(filteredData, setData, pageIndex, pageSize);
  const { handleNavigateToSale, handleNavigateToConfirmation, handleNavigateToDamage } = useTableNavigation();

  return (
    <div className={styles.Application_Status_Table_application_status_table}>
      <ApplicationStatusDataTable
        columns={columns}
        data={paginatedData}
        onSelectRow={handleSelectRow}
        onNavigateToSale={handleNavigateToSale}
        onNavigateToConfirmation={handleNavigateToConfirmation}
        onNavigateToDamage={handleNavigateToDamage}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        totalData={filteredData.length}
      />
    </div>
  );
};

export default ApplicationStatusTable;