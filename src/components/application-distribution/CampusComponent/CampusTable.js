import React, { useEffect, useMemo, useState } from "react";
import TableWidget from "../../../widgets/Table/TableWidget";
import CampusForm from "./CampusForm";
import DistributionUpdateForm from "../DistributionUpdateForm";
import { useGetTableDetailsByEmpId,useGetApplicationSeriesForEmpId,useGetDistributionId } from "../../../queries/application-distribution/dropdownqueries";
import Spinner from "../../commoncomponents/Spinner";

const fieldMapping = {
  applicationForm: "applicationNoFrom",
  issuedName: "issuedTo",
  campusName: "campusName",
  academicYear: "academicYear",
  cityName: "cityName",
  zoneName: "zoneName",
  range: "range",
  applicationTo: "applicationNoTo",
  issueDate: "issueDate",
  mobileNumber: "mobileNumber",
  campaignDistrictName: "campaignDistrictName",
  campaignAreaName: "campaignAreaName",
};

// 🔑 Accept onSelectionChange prop
const CampusTable = ({ onSelectionChange }) => {

  const empId = localStorage.getItem("empId");

  const {
    data: tableData,
    isLoading,
    error,
  } = useGetTableDetailsByEmpId(empId,4);

  console.log("Table Data: ",tableData);

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
        campusName: item.campusName,
        campaignDistrictName: item.districtName,
        cityName: item.cityName,
        campaignAreaName: item.campaignAreaName,
         applicationFee: item.amount,
        applicationSeries: item.displaySeries,
        applicationCount: item.totalAppCount,
        campaignDistrictName:item.districtname,
        cityName:item.cityname,
        mobileNumber:item.mobileNumber,
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
        `${row.original.amount?.toLocaleString?.() ?? row.original.amount ?? ""}`,
    },
    {
      accessorKey: "issuedName",
      header: "Issued Name",
      cell: ({ row }) => row.original.issuedName,
    },
    {
      accessorKey: "campusName",
      header: "Campus Name",
      cell: ({ row }) => row.original.campusName,
    },
  ];

  // Local table state
  const [data, setData] = useState(transformedData);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  // Sync local rows when API data changes
  useEffect(() => {
    setData(transformedData);
    setPageIndex(0); // reset to first page on fresh data
  }, [transformedData]);

  // 🔑 FIXED: Row selection logic using functional update
  const handleSelectRow = (rowData, checked) => {
    // Use functional update to prevent stale state issue during bulk selection
    setData(prevData => {
        const updatedData = prevData.map((item) =>
            item.id === rowData.id ? { ...item, isSelected: checked } : item
        );
        
        // Find all selected rows in the calculated next state
        const selected = updatedData.filter((item) => item.isSelected);

        // Send selected rows back to parent
        if (onSelectionChange) {
            onSelectionChange(selected);
        }

        return updatedData; // Return the new state
    });
  };

  // Apply updates from the form
  const handleUpdate = (updatedRow) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === updatedRow.id
          ? {
              ...item,
              applicationForm:
                updatedRow.applicationNoFrom || item.applicationForm,
              issuedName: updatedRow.issuedTo || item.issuedName,
              campusName: updatedRow.campusName || item.campusName,
              academicYear: updatedRow.academicYear || item.academicYear,
              cityName: updatedRow.cityName || item.cityName,
              zoneName: updatedRow.zoneName || item.zoneName,
              range: updatedRow.range || item.range,
              applicationNoTo:
                updatedRow.applicationNoTo || item.applicationNoTo,
              issueDate: updatedRow.issueDate || item.issueDate,
              mobileNumber: updatedRow.mobileNumber || item.mobileNumber,
              campaignDistrictName:
                updatedRow.campaignDistrictName || item.campaignDistrictName,
              campaignAreaName:
                updatedRow.campaignAreaName || item.campaignAreaName,
            }
          : item
      )
    );
  };
const { data: seriesData, refetch: refetchApplicationSeries} = useGetApplicationSeriesForEmpId(
      null, // receiverId (dynamic)
      null, // academicYear (dynamic)
      null, // amount (dynamic)
      false // isPro default
    );

const {data:distributionId,refetch: refetchDistributionId} = useGetDistributionId(
  null,
  null,
  null,
  null,
  false,
)

  // Modal wiring (outside TableWidget)
    const [openingForm, setOpeningForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowUpdateClick = async (row) => {
  console.log("Row Selected:", row);
  setOpeningForm(true);
  setSelectedRow(row);

  setOpen(true);
  setOpeningForm(false);
};

  // Loading & error states
  if (isLoading) return <div style={{ padding: 16 }}>Table data is loading…</div>;
  if (error)
    return (
      <div style={{ padding: 16, color: "#b00020" }}>
        Failed to load table data.
      </div>
    );

  return (
    <>{openingForm && (
        <div
          style={{
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size="large" />
        </div>)}
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
        forms={{ campus: CampusForm }}
      />
    </>
  );
};

export default CampusTable;