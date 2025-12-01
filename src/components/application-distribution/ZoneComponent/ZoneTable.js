import React, { useEffect, useMemo, useState } from "react";
import TableWidget from "../../../widgets/Table/TableWidget";
import ZoneForm from "./ZoneForm";
import DistributionUpdateForm from "../DistributionUpdateForm";
import { useGetTableDetailsByEmpId ,useGetApplicationSeriesForEmpId,useGetDistributionId, useGetAllFeeAmounts} from "../../../queries/application-distribution/dropdownqueries";
import Spinner from "../../commoncomponents/Spinner";

const ZoneTable = ({ onSelectionChange}) => {

  const empId = localStorage.getItem("empId");
  const {
    data: tableData,
    isLoading,
    error,
  } = useGetTableDetailsByEmpId(empId,2);


  console.log("Table Data: ", tableData);

  // Normalize API -> table rows
  const transformedData = useMemo(
    () =>
      (tableData || []).map((item, index) => ({
        id: item.appDistributionId || index + 1,
        applicationNoFrom: String(item.appStartNo ?? ""),
        applicationNoTo: String(item.appEndNo ?? ""),
        applicationCount: item.totalAppCount,
        // applicationFee: item.amount,
        issuedName: item.issuedToName,
        zoneName: item.zoneName,
        applicationFee: item.amount,
        applicationSeries: item.displaySeries,
        applicationCount: item.totalAppCount,
         // 🔥 Add these (needed for next API)
      issuedToEmpId: item.issued_to_emp_id,
      academicYearId: item.acdc_year_id,
      stateId: item.state_id,
      cityId: item.city_id,
      zoneId: item.zone_id,
      stateName:item.statename,
      cityName:item.cityname,
      mobileNumber:item.mobileNmuber,
      })),
    [tableData]
  );

  const columns = [
    {
      accessorKey: "applicationNoFrom",
      header: "Application From",
      cell: ({ row }) => row.original.applicationNoFrom,
    },
    {
      accessorKey: "applicationNoTo",
      header: "Application To",
      cell: ({ row }) => row.original.applicationNoTo,
    },
    {
      accessorKey: "applicationCount",
      header: "Total Applications",
      cell: ({ row }) => row.original.applicationCount,
    },
    {
      accessorKey: "applicationFee",
      header: "Amount",
      cell: ({ row }) =>
        `${row.original.applicationFee?.toLocaleString?.() ?? row.original.applicationFee}`,
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
  const [openingForm, setOpeningForm] = useState(false);

  // Keep local data synced with API data
  useEffect(() => {
    setData(transformedData);
    setPageIndex(0); // reset to first page when fresh data arrives
  }, [transformedData]);

  const [feeOptions, setFeeOptions] = useState([]);
const [seriesOptions, setSeriesOptions] = useState([]);

  const {
  data: seriesData,
  refetch: refetchApplicationSeries
} = useGetApplicationSeriesForEmpId(
  null, // receiverId (dynamic)
  null, // academicYear (dynamic)
  null, // amount (dynamic)
  false // isPro default
);

const {data: amounts,refetch: refetchApplicationFeeAmount} = useGetAllFeeAmounts(null, null);

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
              applicationNoFrom:
                updatedRow.applicationNoFrom || item.applicationNoFrom,
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
  const handleRowUpdateClick = async (row) => {
  console.log("Row Selected:", row);
  // const distributionId = await useGetDistributionId()
  setOpeningForm(true);
  setSelectedRow(row);


  setOpen(true);
  setOpeningForm(false);
};

  // Map table fields -> form fields for initialValues
  const fieldMapping = {
    applicationNoFrom: "applicationNoFrom",
    issuedName: "issuedTo",
    zoneName: "zoneName",
    academicYear: "academicYear",
    cityName: "cityName",
    range: "range",
    applicationNoTo: "applicationNoTo",
    issueDate: "issueDate",
    mobileNumber: "mobileNumber",
    stateName: "stateName",
  };

  // ---- Loading & error states ----
 
  // ---------------------------------------------------
  // TABLE LOADING STATE
  // ---------------------------------------------------
   if (isLoading) return <div style={{ padding: 16 }}>Table data is loading…</div>;
  if (error) {
    return <div style={{ padding: 16, color: "red" }}>Failed to load data.</div>;
  }

  console.log("Selected Row: ", selectedRow);

  return (
    <>

  {openingForm && (
        <div
          style={{
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size="large" />
        </div>
      )}

 {!openingForm && (
        <TableWidget
          columns={columns}
          data={data}
          onSelectRow={() => {}}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          totalData={data.length}
          onRowUpdateClick={handleRowUpdateClick}
        />
      )}

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