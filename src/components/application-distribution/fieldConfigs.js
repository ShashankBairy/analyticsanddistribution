import RangeInputBox from "../../widgets/Range/RangeInputBox";
import CurrentDate from "../../widgets/DateWidgets/CurrentDate/CurrentDate"

export const commonFields = [
  { name: "academicYear", label: "Academic Year", options: ["2021", "2022"] },
  {
    name: "cityName",
    label: "City Name",
    options: ["Hitect City", "Madhapur"],
  },
  { name: "issuedTo", label: "Issued To", options: ["Person 1", "Person 2"] },
  {
    name: "availableAppNoFrom",
    label: "Available Appno From",
    type: "text",
    disabled: true,
    placeholder: "Available Appno From",
  },
  {
    name: "availableAppNoTo",
    label: "Available Appno To",
    type: "text",
    disabled: true,
    placeholder: "Available Appno To",
  },
  {
    name: "applicationNoFrom",
    label: "Application No From",
    type: "text",
    disabled: true,
    placeholder: "Enter Application no From",
  },
  { name: "range", label: "Range", component: RangeInputBox },
  {
    name: "applicationNoTo",
    label: "Application No To",
    type: "text",
    disabled: true,
    placeholder: "Application No To",
  },
  { name: "issueDate", label: "Issue Date",component: CurrentDate },
  {
    name: "mobileNumber",
    label: "Mobile Number",
    type: "tel",
    disabled: true,
    placeholder: "Mobile Number",
  },
  {
    name:"applicationCount",
    label:"Application Count",
    type:"text",
    disabled:true,
    placeholder:"No of Applications",
  },
  {
    name: "applicationFee",
    label: "Application Fee",
    options: ["10000","50000","3000","0"],
  },
  {
    name: "applicationSeries",
    label: "Application Series",
    options: ["10000","50000","3000","0"],
  },
];

export const zoneFields = [
  {
    name: "stateName",
    label: "State Name",
    options: ["Telangana", "Andhra Pradesh"],
  },
  { name: "zoneName", label: "Zone Name", options: ["Zone 1", "Zone 2"] },
];

export const dgmFields = [
  {
    name: "campusName",
    label: "Branch Name",
    options: ["Campus 1", "Campus 2"],
  },
  { name: "zoneName", label: "Zone Name", options: ["Zone 1", "Zone 2"] },
];

export const campusFields = [
  {
    name: "campusName",
    label: "Branch Name",
    options: ["Campus 1", "Campus 2"],
  },
  {
    name: "campaignDistrictName",
    label: "Campaign District",
    options: ["District 1", "District 2"],
  },
];

export const fieldLayouts = {
  Zone: [
    { id: "row-1", fields: ["academicYear", "stateName"] },
    { id: "row-2", fields: ["cityName", "zoneName"] },
    { id: "row-3", fields: ["issuedTo","applicationFee"]},
    { id: "row-4", fields: ["applicationSeries", "applicationCount"] },
    { id: "row-5", fields: ["availableAppNoFrom", "availableAppNoTo"] },
    { id: "row-6", fields: ["applicationNoFrom", "range"] },
    { id: "row-7", fields: ["applicationNoTo", "issueDate"] },
    { id: "row-8", fields: ["mobileNumber"] },
  ],
  DGM: [
    { id: "row-1", fields: ["academicYear", "cityName"] },
    { id: "row-2", fields: ["zoneName", "campusName"] },
    { id: "row-3", fields: ["issuedTo", "applicationFee"] },
    { id: "row-4", fields: ["applicationSeries", "applicationCount"] },
    { id: "row-5", fields: ["availableAppNoFrom", "availableAppNoTo"] },
    { id: "row-6", fields: ["applicationNoFrom", "range"] },
    { id: "row-7", fields: ["applicationNoTo", "issueDate"] },
    { id: "row-8", fields: ["mobileNumber"] },
  ],
  Campus: [
    { id: "row-1", fields: ["academicYear", "campaignDistrictName"] },
    { id: "row-2", fields: ["cityName", "campusName"] },
    { id: "row-3", fields: ["issuedTo", "applicationFee"] },
    { id: "row-4", fields: ["applicationSeries", "applicationCount"] },
    { id: "row-5", fields: ["availableAppNoFrom", "availableAppNoTo"] },
    { id: "row-6", fields: ["applicationNoFrom", "range"] },
    { id: "row-7", fields: ["applicationNoTo", "issueDate"] },
    { id: "row-8", fields: ["mobileNumber"] },
  ],
};

export const getFieldsForType = (formType) => {
  switch (formType) {
    case "Zone":
      return [...commonFields, ...zoneFields];
    case "DGM":
      return [...commonFields, ...dgmFields];
    case "Campus":
      return [...commonFields, ...campusFields];
    default:
      return commonFields;
  }
};