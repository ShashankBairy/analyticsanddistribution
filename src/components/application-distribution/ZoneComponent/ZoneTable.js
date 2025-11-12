import React, { useEffect, useMemo, useState } from "react";
import TableWidget from "../../../widgets/Table/TableWidget";
import ZoneForm from "./ZoneForm";
import DistributionUpdateForm from "../DistributionUpdateForm";
import { useGetTableDetailsByEmpId } from "../../../queries/application-distribution/dropdownqueries";

const ZoneTable = ({ onSelectionChange }) => {

  const empId = localStorage.getItem("empId");

  const {
    data: tableData,
    isLoading,
    error,
  } = useGetTableDetailsByEmpId(empId);

  // Normalize API -> table rows
  const transformedData = useMemo(
    () =>
      (tableData || []).map((item, index) => ({
        id: item.appDistributionId || index + 1,
        applicationForm: String(item.appStartNo ?? ""),
        applicationTo: String(item.appEndNo ?? ""),
        totalApplications: item.totalAppCount,
        amount: item.amount,
        issuedName: item.issuedToName,
        zoneName: item.zoneName,
      })),
    [tableData]
  );

  const columns = [
    {
      accessorKey: "applicationForm",
      header: "Application Form",
      cell: ({ row }) => row.original.applicationForm,
    },
    {
      accessorKey: "applicationTo",
      header: "Application To",
      cell: ({ row }) => row.original.applicationTo,
    },
    {
      accessorKey: "totalApplications",
      header: "Total Applications",
      cell: ({ row }) => row.original.totalApplications,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) =>
        `${row.original.amount?.toLocaleString?.() ?? row.original.amount}`,
    },
    {
      accessorKey: "issuedName",
      header: "Issued Name",
      cell: ({ row }) => row.original.issuedName,
    },
    {
      accessorKey: "zoneName",
      header: "Zone Name",
      cell: ({ row }) => row.original.zoneName,
    },
  ];

  // Local state + paging
  const [data, setData] = useState(transformedData);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [selectedRows, setSelectedRows] = useState([]); // This state is actually redundant now

  // Keep local data synced with API data
  useEffect(() => {
    setData(transformedData);
    setPageIndex(0); // reset to first page when fresh data arrives
  }, [transformedData]);

  // 🔑 UPDATED: Row selection toggle using functional update for reliability
  const handleSelectRow = (rowData, checked) => {
    // Use functional update to ensure we operate on the freshest state
    setData(prevData => {
        const updatedData = prevData.map((item) =>
            item.id === rowData.id ? { ...item, isSelected: checked } : item
        );

        // Find all selected rows in the calculated next state
        const selected = updatedData.filter((item) => item.isSelected);

        // 🔼 Send selected rows back to parent (DistributeTable)
        if (onSelectionChange) {
            onSelectionChange(selected);
        }
        
        // Return the new state
        return updatedData;
    });
  };


  // Apply updates returned from the form (and/or call your update API here)
  const handleUpdate = (updatedRow) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === updatedRow.id
          ? {
              ...item,
              applicationForm:
                updatedRow.applicationNoFrom || item.applicationForm,
              issuedName: updatedRow.issuedTo || item.issuedName,
              zoneName: updatedRow.zoneName || item.zoneName,
              academicYear: updatedRow.academicYear || item.academicYear,
              cityName: updatedRow.cityName || item.cityName,
              range: updatedRow.range || item.range,
              applicationNoTo:
                updatedRow.applicationNoTo || item.applicationNoTo,
              issueDate: updatedRow.issueDate || item.issueDate,
              mobileNumber: updatedRow.mobileNumber || item.mobileNumber,
              stateName: updatedRow.stateName || item.stateName,
            }
          : item
      )
    );
  };

  // ---- Modal wiring (outside TableWidget) ----
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // TableWidget calls this when user clicks "Update" for a row
  const handleRowUpdateClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  // Map table fields -> form fields for initialValues
  const fieldMapping = {
    applicationForm: "applicationNoFrom",
    issuedName: "issuedTo",
    zoneName: "zoneName",
    academicYear: "academicYear",
    cityName: "cityName",
    range: "range",
    applicationTo: "applicationNoTo",
    issueDate: "issueDate",
    mobileNumber: "mobileNumber",
    stateName: "stateName",
  };

  // ---- Loading & error states ----
  if (isLoading) {
    return <div style={{ padding: 16 }}>Table data is loading…</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: "#b00020" }}>
        Failed to load table data.
      </div>
    );
  }

  return (
    <>
      <TableWidget
        columns={columns}
        data={data}
        onSelectRow={handleSelectRow}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        totalData={data.length}
        // Keep TableWidget generic: it shouldn't know about forms or modals
        onRowUpdateClick={handleRowUpdateClick}
      />

      <DistributionUpdateForm
        open={open}
        onClose={() => setOpen(false)}
        row={selectedRow}
        fieldMapping={fieldMapping}
        onSubmit={handleUpdate}
        forms={{ zone: ZoneForm }}
      />
    </>
  );
};

export default ZoneTable;