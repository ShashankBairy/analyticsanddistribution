import { useMemo } from 'react';

/**
 * Custom hook for table data management
 * Handles data transformation and row selection logic
 */
export const useTableData = (filteredData, setData, pageIndex, pageSize = 10) => {
  // Helper functions for row handling
  const unwrapRow = (rowOrRowObject) => rowOrRowObject?.original ?? rowOrRowObject ?? {};
  const extractId = (rowObj) => rowObj?.applicationNo ?? rowObj?.id ?? null;

  // Handle row selection
  const handleSelectRow = (row, checked) => {
    const rowObj = unwrapRow(row);
    const idToToggle = extractId(rowObj);
    if (idToToggle == null) return;
    setData((prevData) =>
      prevData.map((item) => {
        const itemId = extractId(item);
        if (itemId === idToToggle) {
          return { ...item, isSelected: checked };
        }
        return item;
      })
    );
  };

  // Paginated data
  const paginatedData = useMemo(() => {
    return filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [filteredData, pageIndex, pageSize]);

  return {
    handleSelectRow,
    paginatedData,
    unwrapRow,
    extractId,
  };
};
