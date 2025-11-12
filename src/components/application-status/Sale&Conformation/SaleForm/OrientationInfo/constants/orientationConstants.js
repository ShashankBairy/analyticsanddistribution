// Form field configurations
export const formFields = [
  {
    id: "academicYear",
    name: "academicYear",
    label: "Academic Year",
    placeholder: "A.Y 2025-2026",
    type: "text",
    required: true
  },
  {
    id: "branch",
    name: "branch",
    label: "Branch",
    placeholder: "Select Branch",
    type: "dropdown",
    required: true,
    options: "branchOptions"
  },
  {
    id: "branchType",
    name: "branchType",
    label: "Branch Type",
    placeholder: "Select branch type",
    type: "dropdown",
    required: false,
    options: "branchTypeOptions"
  },
  {
    id: "city",
    name: "city",
    label: "City",
    placeholder: "Select City",
    type: "dropdown",
    required: false,
    options: "cityOptions"
  },
  {
    id: "studentType",
    name: "studentType",
    label: "Student Type",
    placeholder: "Select Type",
    type: "dropdown",
    required: true,
    options: "studentTypeOptions"
  },
  {
    id: "joiningClass",
    name: "joiningClass",
    label: "Joining Class",
    placeholder: "Select Class",
    type: "dropdown",
    required: true,
    options: "classOptions"
  },
  {
    id: "orientationName",
    name: "orientationName",
    label: "Orientation Name",
    placeholder: "Select Orientation Name",
    type: "dropdown",
    required: true,
    options: "orientationOptions"
  },
  // {
  //   id: "admissionType",
  //   name: "admissionType",
  //   label: "Admission Type",
  //   placeholder: "Select admission type",
  //   type: "dropdown",
  //   required: true,
  //   options: "admissionTypeOptions"
  // },
  // {
  //   id: "proReceiptNo",
  //   name: "proReceiptNo",
  //   label: "PRO Receipt No",
  //   placeholder: "Enter Receipt No",
  //   type: "text",
  //   required: true
  // }
];

// Dropdown options
// Removed fallback classOptions - using API data only

export const branchTypeOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "medical", label: "Medical" },
  { value: "arts", label: "Arts" }
];

export const branchOptions = [
  { value: "cse", label: "Computer Science" },
  { value: "ece", label: "Electronics" },
  { value: "mech", label: "Mechanical" }
];

export const orientationOptions = [
  { value: "orientation1", label: "Orientation 1" },
  { value: "orientation2", label: "Orientation 2" }
];

export const admissionTypeOptions = [
  { value: "regular", label: "Regular" },
  { value: "lateral", label: "Lateral" }
];

export const studentTypeOptions = [
  { value: "fulltime", label: "Full Time" },
  { value: "parttime", label: "Part Time" }
];

export const cityOptions = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bangalore", label: "Bangalore" }
];

// Initial form values
export const initialValues = {
  academicYear: "A.Y 2025-2026",
  joiningClass: "",
  branchType: "",
  branch: "",
  orientationName: "",
  admissionType: "",
  studentType: "",
  city: "",
  proReceiptNo: ""
};
