// Form field configurations
export const formFields = [
  {
    id: "doorNo",
    name: "doorNo",
    label: "Door No",
    placeholder: "Enter door no",
    type: "text",
    required: true
  },
  {
    id: "streetName",
    name: "streetName",
    label: "Street Name",
    placeholder: "Enter street name",
    type: "text",
    required: true
  },
  {
    id: "landmark",
    name: "landmark",
    label: "Landmark",
    placeholder: "Enter landmark",
    type: "text",
    required: false
  },
  {
    id: "area",
    name: "area",
    label: "Area",
    placeholder: "Enter area",
    type: "text",
    required: true
  },
  {
    id: "pincode",
    name: "pincode",
    label: "Pincode",
    placeholder: "Enter pincode",
    type: "text",
    required: true
  },
  {
    id: "state",
    name: "state",
    label: "State",
    placeholder: "Select State",
    type: "dropdown",
    required: false,
    options: "stateOptions"
  },
  {
    id: "district",
    name: "district",
    label: "District",
    placeholder: "Select District",
    type: "dropdown",
    required: false,
    options: "districtOptions"
  },
  {
    id: "mandal",
    name: "mandal",
    label: "Mandal",
    placeholder: "Select Mandal",
    type: "dropdown",
    required: true,
    options: "mandalOptions"
  },
  {
    id: "city",
    name: "city",
    label: "City",
    placeholder: "Select City",
    type: "dropdown",
    required: true,
    options: "cityOptions"
  },
  {
    id: "gpin",
    name: "gpin",
    label: "G-pin (Lattitude & Longitude)",
    placeholder: "Search address",
    type: "search",
    required: false
  }
];

// Dropdown options
export const mandalOptions = [
  { value: "mandal1", label: "Mandal 1" },
  { value: "mandal2", label: "Mandal 2" },
  { value: "mandal3", label: "Mandal 3" }
];

export const cityOptions = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bangalore", label: "Bangalore" }
];

export const districtOptions = [
  { value: "district1", label: "District 1" },
  { value: "district2", label: "District 2" },
  { value: "district3", label: "District 3" }
];

export const stateOptions = [
  { value: "state1", label: "State 1" },
  { value: "state2", label: "State 2" },
  { value: "state3", label: "State 3" }
];

// Initial form values
export const initialValues = {
  doorNo: "",
  area: "",
  mandal: "",
  streetName: "",
  pincode: "",
  city: "",
  landmark: "",
  district: "",
  gpin: ""
};
