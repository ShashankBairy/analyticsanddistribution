import React from 'react';
import StatusCell from '../components/StatusCell';

/**
 * Custom hook for table column configuration
 * Extracts column definition logic from main component
 */
export const useTableColumns = () => {
  const columns = React.useMemo(
    () => [
      { accessorKey: "applicationNo", header: "Application No" },
      { accessorKey: "pro", header: "PRO" },
      { accessorKey: "campus", header: "Campus" },
      { accessorKey: "dgm", header: "DGM" },
      { accessorKey: "zone", header: "Zone" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row?.original?.status ?? "";
          return <StatusCell status={status} />;
        },
      },
    ],
    []
  );

  return columns;
};
