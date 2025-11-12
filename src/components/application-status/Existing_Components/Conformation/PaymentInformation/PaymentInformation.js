import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import Inputbox from "../../../../../widgets/Inputbox/InputBox";
import Dropdown from "../../../../../widgets/Dropdown/Dropdown";
import Button from "../../../../../widgets/Button/Button";
import { ReactComponent as TrendingUpIcon } from "../../../../../assets/application-status/Trending up.svg";
import SkipIcon from "../../../../../assets/application-status/SkipIcon.svg";
import { ReactComponent as BackArrow } from "../../../../../assets/application-status/Backarrow.svg";
import VegIcon from "../../../../../assets/application-status/VegIcon.png";
import NonVegIcon from "../../../../../assets/application-status/NonVegIcon.png";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import styles from "./PaymentInformation.module.css";
import StudentInfoHeader from "../StudentInformation/StudentInfoHeader";
import * as apiService from "../../../../../queries/application-status/ConfirmationApis";
import { useLocation } from "react-router-dom";

// Utility function to format ISO date to YYYY-MM-DD
const formatDate = (isoDate) => {
  if (!isoDate || isNaN(new Date(isoDate))) {
    console.warn("Invalid or missing date:", isoDate);
    return "";
  }
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
};

// Component to handle API data fetching
const DataFetcher = ({
  campusId,
  setOrientationOptions,
  setOrientationIdMap,
  setOrientationLoading,
  setStreamOptions,
  setStreamIdMap,
  setStreamLoading,
  setProgramOptions,
  setProgramIdMap,
  setProgramLoading,
  setExamProgramOptions,
  setExamProgramIdMap,
  setExamProgramLoading,
  setBatchOptions,
  setBatchMap,
  setBatchLoading,
  setFoodTypeOptions,
  setFoodTypeIdMap,
  setFoodTypeLoading,
}) => {
  const { values } = useFormikContext();

  // Fetch orientations
  useEffect(() => {
    const fetchOrientations = async () => {
      setOrientationLoading(true);
      try {
        const data = await apiService.getOrientations(campusId);
        console.log("Orientations API response for campus:", campusId, data);
        if (Array.isArray(data) && data.length > 0) {
          const options = data.map((c) => c.name);
          const map = {};
          data.forEach((c) => {
            map[c.name] = c.id;
          });
          setOrientationOptions(options);
          setOrientationIdMap(map);
          console.log("Orientation map:", map);
        } else {
          console.warn("No orientations found for campus:", campusId);
          setOrientationOptions(["No orientations available"]);
          setOrientationIdMap({});
        }
      } catch (err) {
        console.error("Failed to fetch orientations:", err);
        setOrientationOptions(["Error loading orientations"]);
        setOrientationIdMap({});
      } finally {
        setOrientationLoading(false);
      }
    };
    fetchOrientations();
  }, [campusId, setOrientationOptions, setOrientationIdMap, setOrientationLoading]);

  // Fetch streams
  useEffect(() => {
    const fetchStreams = async () => {
      const orientationTrackId = values.orientationTrackId;
      if (orientationTrackId) {
        setStreamLoading(true);
        try {
          const streamData = await apiService.getStreams(orientationTrackId);
          console.log("Streams API response for orientation:", orientationTrackId, streamData);
          if (Array.isArray(streamData)) {
            const options = streamData.map((s) => s.name);
            const map = {};
            streamData.forEach((s) => {
              map[s.name] = s.id;
            });
            setStreamOptions(options);
            setStreamIdMap(map);
            console.log("Stream map:", map);
          } else {
            setStreamOptions(["No streams available"]);
            setStreamIdMap({});
          }
        } catch (err) {
          console.error("Failed to fetch streams by orientation:", err);
          setStreamOptions(["Error loading streams"]);
          setStreamIdMap({});
        } finally {
          setStreamLoading(false);
        }
      }
    };
    fetchStreams();
  }, [values.orientationTrackId, setStreamOptions, setStreamIdMap, setStreamLoading]);

  // Fetch programs
  useEffect(() => {
    const fetchPrograms = async () => {
      const orientationTrackId = values.orientationTrackId;
      if (orientationTrackId) {
        setProgramLoading(true);
        try {
          const programData = await apiService.getProgramsByOrientation(orientationTrackId);
          console.log("Programs API response for orientation:", orientationTrackId, programData);
          if (Array.isArray(programData)) {
            const options = programData.map((p) => p.name);
            const map = {};
            programData.forEach((p) => {
              map[p.name] = p.id;
            });
            setProgramOptions(options);
            setProgramIdMap(map);
            console.log("Program map:", map);
          } else {
            setProgramOptions(["No programs available"]);
            setProgramIdMap({});
          }
        } catch (err) {
          console.error("Failed to fetch programs by orientation:", err);
          setProgramOptions(["Error loading programs"]);
          setProgramIdMap({});
        } finally {
          setProgramLoading(false);
        }
      }
    };
    fetchPrograms();
  }, [values.orientationTrackId, setProgramOptions, setProgramIdMap, setProgramLoading]);

  // Fetch exam programs
  useEffect(() => {
    const fetchExamPrograms = async () => {
      const programId = values.programId;
      if (programId) {
        setExamProgramLoading(true);
        try {
          const examPrograms = await apiService.getExamProgramsByProgram(programId);
          console.log("Exam Programs API response for program:", programId, examPrograms);
          if (Array.isArray(examPrograms)) {
            const options = examPrograms.map((ep) => ep.name);
            const map = {};
            examPrograms.forEach((ep) => {
              map[ep.name] = ep.id;
            });
            setExamProgramOptions(options);
            setExamProgramIdMap(map);
            console.log("Exam Program map:", map);
          } else {
            setExamProgramOptions(["No exam programs available"]);
            setExamProgramIdMap({});
          }
        } catch (err) {
          console.error("Failed to fetch exam programs:", err);
          setExamProgramOptions(["Error loading exam programs"]);
          setExamProgramIdMap({});
        } finally {
          setExamProgramLoading(false);
        }
      }
    };
    fetchExamPrograms();
  }, [values.programId, setExamProgramOptions, setExamProgramIdMap, setExamProgramLoading]);

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      const orientationTrackId = values.orientationTrackId;
      if (orientationTrackId) {
        setBatchLoading(true);
        try {
          const batchData = await apiService.getBatchesByOrientation(orientationTrackId);
          console.log("Batches API response for orientation:", orientationTrackId, batchData);
          if (Array.isArray(batchData) && batchData.length > 0) {
            const options = batchData.map((b) => b.name || b.batchName);
            const map = {};
            batchData.forEach((b) => {
              const batchId = b.batchId || b.id;
              if (batchId) {
                map[b.name || b.batchName] = { ...b, batchId };
              } else {
                console.warn("Batch missing batchId:", b);
              }
            });
            setBatchOptions(options);
            setBatchMap(map);
            console.log("Batch map:", map);
          } else {
            console.warn("No batches found for orientation:", orientationTrackId);
            setBatchOptions(["No batches available"]);
            setBatchMap({});
          }
        } catch (err) {
          console.error("Failed to fetch batches by orientation:", err);
          setBatchOptions(["Error loading batches"]);
          setBatchMap({});
        } finally {
          setBatchLoading(false);
        }
      }
    };
    fetchBatches();
  }, [values.orientationTrackId, setBatchOptions, setBatchMap, setBatchLoading]);

  // Fetch food types
  useEffect(() => {
    const fetchFoodTypes = async () => {
      setFoodTypeLoading(true);
      try {
        const data = await apiService.getAllFoodTypes();
        console.log("Food Types API response:", data);
        if (Array.isArray(data) && data.length > 0) {
          const options = data.map((food) => ({
            label: food.food_type,
            id: food.food_type_id,
            type: food.food_type,
            icon: food.food_type === 'Vegetarian' ? VegIcon : NonVegIcon,
            // iconColor: food.food_type === 'Vegetarian' ? 'green' : 'red'
          }));
          const map = {};
          data.forEach((food) => {
            map[food.food_type] = food.food_type_id;
          });
          setFoodTypeOptions(options);
          setFoodTypeIdMap(map);
          console.log("Food Type map:", map);
        } else {
          console.warn("No food types found");
          setFoodTypeOptions([]);
          setFoodTypeIdMap({});
        }
      } catch (err) {
        console.error("Failed to fetch food types:", err);
        setFoodTypeOptions([]);
        setFoodTypeIdMap({});
      } finally {
        setFoodTypeLoading(false);
      }
    };
    fetchFoodTypes();
  }, [setFoodTypeOptions, setFoodTypeIdMap, setFoodTypeLoading]);

  return null;
};

const CourseFeeWatcher = ({ campusId }) => {
  const { values, setFieldValue, setFieldError } = useFormikContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseFee = async () => {
      const orientationId = values.orientationTrackId;
      const batchId = values.batchId;
      console.log("CourseFeeWatcher - Fetching with:", { campusId, orientationId, batchId });

      if (campusId && orientationId && batchId) {
        setLoading(true);
        setError(null);
        try {
          const details = await apiService.getBatchDetailsByOrientationAndBatch(orientationId, batchId);
          console.log("CourseFeeWatcher - API response:", details);
          if (Array.isArray(details) && details.length > 0) {
            const { startDate, endDate, fee } = details[0];
            const formattedStartDate = startDate ? formatDate(startDate) : "";
            const formattedEndDate = endDate ? formatDate(endDate) : "";
            console.log("CourseFeeWatcher - Setting values:", {
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              fee,
            });
            setFieldValue("startDate", formattedStartDate);
            setFieldValue("endDate", formattedEndDate);
            setFieldValue("orientationFee", fee || "");
            setFieldError("startDate", null);
            setFieldError("endDate", null);
            setFieldError("orientationFee", null);
          } else {
            console.warn("CourseFeeWatcher - No batch details returned");
            setError("No batch details available for the selected orientation and batch.");
            setFieldValue("startDate", "");
            setFieldValue("endDate", "");
            setFieldValue("orientationFee", "");
          }
        } catch (err) {
          console.error("CourseFeeWatcher - Failed to fetch batch details:", err);
          setError("Failed to fetch batch details. Please try again.");
          setFieldValue("startDate", "");
          setFieldValue("endDate", "");
          setFieldValue("orientationFee", "");
        } finally {
          setLoading(false);
        }
      } else {
        console.log("CourseFeeWatcher - Skipping fetch due to missing values:", {
          campusId,
          orientationId,
          batchId,
        });
      }
    };

    fetchCourseFee();
  }, [values.orientationTrackId, values.batchId, setFieldValue, setFieldError, campusId]);

  return (
    <div>
      {loading && <Typography className={styles.loading_message}>Loading batch details...</Typography>}
      {error && <Typography className={styles.error_message}>{error}</Typography>}
    </div>
  );
};

// Define validationSchema with Yup
const validationSchema = Yup.object().shape({
  joinYear: Yup.string().required("This field is required"),
  orientationName: Yup.string().required("This field is required"),
  stream: Yup.string().required("This field is required"),
  program: Yup.string().required("This field is required"),
  examProgram: Yup.string().required("This field is required"),
  batchName: Yup.string().required("This field is required"),
  section: Yup.string().required("This field is required"),
  startDate: Yup.date().when(["orientationTrackId", "batchId"], {
    is: (orientationTrackId, batchId) => orientationTrackId && batchId,
    then: (schema) => schema.required("This field is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  endDate: Yup.date().when(["orientationTrackId", "batchId"], {
    is: (orientationTrackId, batchId) => orientationTrackId && batchId,
    then: (schema) =>
      schema
        .required("This field is required")
        .min(Yup.ref("startDate"), "End date must be after start date."),
    otherwise: (schema) => schema.notRequired(),
  }),
  orientationFee: Yup.number()
    .typeError("Amount must be a number")
    .when(["orientationTrackId", "batchId"], {
      is: (orientationTrackId, batchId) => orientationTrackId && batchId,
      then: (schema) => schema.required("Orientation Fee is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  foodPreference: Yup.string().required("Food preference is required"),
});

const CustomFoodDropdown = ({ value, onChange, error, foodOptions = [], loading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    onChange(option.label, option.id);
    setIsOpen(false);
    console.log("Food Preference selected:", { label: option.label, id: option.id });
  };

  return (
    <div className={styles.custom_dropdown} ref={wrapperRef}>
      <div className={styles.dropdown_header} onClick={() => setIsOpen(!isOpen)}>
        {value || (loading ? "Loading food types..." : "Select Food Type")}
        <span className={styles.dropdown_arrow}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5335 1.59961L5.86686 6.26628L1.2002 1.59961" stroke="#98A2B3" stroke-width="1.92" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdown_options}>
          {loading ? (
            <div className={styles.dropdown_option}>Loading food types...</div>
          ) : foodOptions.length === 0 ? (
            <div className={styles.dropdown_option}>No food types available</div>
          ) : (
            foodOptions.map((option) => (
              <div
                key={option.id}
                className={styles.dropdown_option}
                onClick={() => handleOptionSelect(option)}
              >
                <img
                  src={option.icon}
                  alt={option.type}
                  className={styles.option_icon}
                  style={{ width: '16px', height: '16px' }}
                />
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

const PaymentInformation = ({ onBack, onSubmit, saleData = null, handleBack, applicationNo }) => {
  const [headerItems, setHeaderItems] = useState([
    { label: "Application No", value: "" },
    { label: "PRO Name", value: "" },
    { label: "PRO Mobile No", value: "" },
    { label: "PRO Campus", value: "" },
  ]);
  const [joinYearOptions, setJoinYearOptions] = useState([]);
  const [defaultJoinYear, setDefaultJoinYear] = useState("");
  const [yearIdMap, setYearIdMap] = useState({});
  const [orientationOptions, setOrientationOptions] = useState([]);
  const [orientationIdMap, setOrientationIdMap] = useState({});
  const [orientationLoading, setOrientationLoading] = useState(true);
  const [streamOptions, setStreamOptions] = useState([]);
  const [streamIdMap, setStreamIdMap] = useState({});
  const [streamLoading, setStreamLoading] = useState(false);
  const [programOptions, setProgramOptions] = useState([]);
  const [programIdMap, setProgramIdMap] = useState({});
  const [programLoading, setProgramLoading] = useState(false);
  const [examProgramOptions, setExamProgramOptions] = useState([]);
  const [examProgramIdMap, setExamProgramIdMap] = useState({});
  const [examProgramLoading, setExamProgramLoading] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [batchMap, setBatchMap] = useState({});
  const [batchLoading, setBatchLoading] = useState(false);
  const [sectionOptions, setSectionOptions] = useState(["Not Allocated"]);
  const [sectionIdMap, setSectionIdMap] = useState({ "Not Allocated": 0 });
  const [sectionLoading, setSectionLoading] = useState(false);
  const [foodTypeOptions, setFoodTypeOptions] = useState([]);
  const [foodTypeIdMap, setFoodTypeIdMap] = useState({});
  const [foodTypeLoading, setFoodTypeLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const [admissionNo, setAdmissionNo] = useState(
    applicationNo || 
    location.state?.initialValues?.applicationNo || 
    location.state?.applicationNo || 
    saleData?.applicationNo || 
    ""
  );

  // Use campusId from location state, saleData, or fallback to a default
  const campusId = location.state?.initialValues?.campusId || saleData?.campusId || location.state?.campusId || 1;

  // Dynamic default join year based on current date (September 12, 2025)
  const currentDate = new Date("2025-09-12");
  const currentYear = currentDate.getFullYear();
  const defaultJoinYearStr = `${currentYear}-${currentYear + 1}`;

  // Log initial admissionNo and campusId for debugging
  useEffect(() => {
    console.log("PaymentInformation - Initial values:", { admissionNo, campusId, locationState: location.state, saleData, applicationNo });
  }, [admissionNo, campusId, location.state, saleData, applicationNo]);

  // Fetch header items
  useEffect(() => {
    const fetchHeaderItems = async () => {
      if (!admissionNo) {
        console.warn("No admissionNo provided for fetching employee details");
        setHeaderItems([
          { label: "Application No", value: "N/A" },
          { label: "PRO Name", value: "N/A" },
          { label: "PRO Mobile No", value: "N/A" },
          { label: "PRO Campus", value: "N/A" },
        ]);
        return;
      }

      try {
        const data = await apiService.getEmployeeDetails(admissionNo);
        console.log("Employee details fetched for admissionNo:", admissionNo, data);
        setHeaderItems([
          { label: "Application No", value: admissionNo || "N/A" },
          { label: "PRO Name", value: data.employeeName || "N/A" },
          { label: "PRO Mobile No", value: data.employeeMobileNo || "N/A" },
          { label: "PRO Campus", value: data.campusName || "N/A" },
        ]);
      } catch (err) {
        console.error("Failed to fetch employee details for admissionNo:", admissionNo, err);
        setHeaderItems([
          { label: "Application No", value: admissionNo || "N/A" },
          { label: "PRO Name", value: "N/A" },
          { label: "PRO Mobile No", value: "N/A" },
          { label: "PRO Campus", value: "N/A" },
        ]);
      }
    };

    fetchHeaderItems();
  }, [admissionNo]);

  // Fetch join years
  useEffect(() => {
    const fetchJoinYears = async () => {
      try {
        const data = await apiService.getJoinYears();
        console.log("Join Years API response:", data);
        if (data?.options) {
          const options = data.options.map((o) => o.academicYear);
          const map = {};
          data.options.forEach((o) => {
            map[o.academicYear] = o.acdcYearId;
          });
          setJoinYearOptions(options);
          setYearIdMap(map);
          setDefaultJoinYear(options.includes(defaultJoinYearStr) ? defaultJoinYearStr : options[0] || "");
          console.log("Join Year map:", map);
        }
      } catch (err) {
        console.error("Failed to fetch join years:", err);
        setDefaultJoinYear(defaultJoinYearStr);
        setJoinYearOptions([defaultJoinYearStr]);
        setYearIdMap({ [defaultJoinYearStr]: 1 });
      }
    };
    fetchJoinYears();
  }, []);

  // Mock payments load
  useEffect(() => {
    setTimeout(() => {
      const data = [
        { head: "Tuition", amount: 5000, receiptNo: "R123", mode: "Cash", status: "Paid", date: "2025-08-01" },
        { head: "Admission", amount: 2000, receiptNo: "R124", mode: "Card", status: "Pending", date: "2025-08-05" },
      ];
      setPayments(data);
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
    console.log("Selected Dropdown IDs on Submit:", {
      joinYearId: yearIdMap[values.joinYear] || 0,
      orientationTrackId: orientationIdMap[values.orientationName] || 0,
      streamId: streamIdMap[values.stream] || 0,
      programId: programIdMap[values.program] || 0,
      examProgramId: examProgramIdMap[values.examProgram] || 0,
      batchId: batchMap[values.batchName]?.batchId || 0,
      sectionId: sectionIdMap[values.section] || 0,
      foodPreferenceId: values.foodPreferenceId,
    });

    const confirmationDataObject = {
      paymentInformation: {
        campusId,
        joinYear: values.joinYear,
        joinYearId: yearIdMap[values.joinYear] || 0,
        orientationName: values.orientationName,
        orientationTrackId: orientationIdMap[values.orientationName] || 0,
        stream: values.stream,
        streamId: streamIdMap[values.stream] || 0,
        program: values.program,
        programId: programIdMap[values.program] || 0,
        examProgram: values.examProgram,
        examProgramId: examProgramIdMap[values.examProgram] || 0,
        batchName: values.batchName,
        batchId: batchMap[values.batchName]?.batchId || 0,
        section: "Not Allocated",
        sectionId: 0,
        startDate: values.startDate,
        endDate: values.endDate,
        orientationFee: values.orientationFee,
        foodPreference: values.foodPreference,
        foodPreferenceId: values.foodPreferenceId,
        paymentTableData: payments,
      },
      timestamp: new Date().toISOString(),
      flow: "Confirmation Flow Complete",
    };

    const completeFlowData = {
      saleData: saleData || {},
      confirmationData: confirmationDataObject,
      timestamp: new Date().toISOString(),
      flow: "Complete Sale to Confirmation Flow",
    };

    console.log("Submit Data:", completeFlowData);

    if (onSubmit) {
      onSubmit(completeFlowData);
    } else {
      alert("Confirmation Information Submitted!");
    }
  };

  const initialValues = {
    joinYear: defaultJoinYear,
    joinYearId: yearIdMap[defaultJoinYear] || "",
    orientationName: "",
    orientationTrackId: "",
    stream: "",
    streamId: "",
    program: "",
    programId: "",
    examProgram: "",
    examProgramId: "",
    batchName: "",
    batchId: "",
    section: "Not Allocated",
    sectionId: 0,
    startDate: "",
    endDate: "",
    campusId,
    orientationFee: "",
    foodPreference: "",
    foodPreferenceId: "",
  };

  return (
    <div className={styles.Payment_Information_payment_information}>
      <StudentInfoHeader items={headerItems} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={styles.Payment_Information_form}>
            {Object.keys(errors).length > 0 && console.log("Validation errors:", errors)}
            <CourseFeeWatcher campusId={campusId} />
            <DataFetcher
              campusId={campusId}
              setOrientationOptions={setOrientationOptions}
              setOrientationIdMap={setOrientationIdMap}
              setOrientationLoading={setOrientationLoading}
              setStreamOptions={setStreamOptions}
              setStreamIdMap={setStreamIdMap}
              setStreamLoading={setStreamLoading}
              setProgramOptions={setProgramOptions}
              setProgramIdMap={setProgramIdMap}
              setProgramLoading={setProgramLoading}
              setExamProgramOptions={setExamProgramOptions}
              setExamProgramIdMap={setExamProgramIdMap}
              setExamProgramLoading={setExamProgramLoading}
              setBatchOptions={setBatchOptions}
              setBatchMap={setBatchMap}
              setBatchLoading={setBatchLoading}
              setFoodTypeOptions={setFoodTypeOptions}
              setFoodTypeIdMap={setFoodTypeIdMap}
              setFoodTypeLoading={setFoodTypeLoading}
            />
            <div className={styles.Payment_Information_form_grid}>
              {/* Join Year */}
              <div>
                <Dropdown
                  dropdownname="Join Year"
                  name="joinYear"
                  value={values.joinYear}
                  onChange={(e) => {
                    const selectedYear = e.target.value;
                    setFieldValue("joinYear", selectedYear);
                    const joinYearId = yearIdMap[selectedYear] || "";
                    setFieldValue("joinYearId", joinYearId);
                    console.log("Join Year selected:", { label: selectedYear, id: joinYearId });
                  }}
                  results={joinYearOptions}
                  required
                />
                <ErrorMessage name="joinYear" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Orientation Name */}
              <div>
                <Dropdown
                  dropdownname="Orientation Name"
                  name="orientationName"
                  value={values.orientationName}
                  onChange={(e) => {
                    const selectedOrientation = e.target.value;
                    setFieldValue("orientationName", selectedOrientation);
                    const orientationTrackId = orientationIdMap[selectedOrientation] || "";
                    setFieldValue("orientationTrackId", orientationTrackId);
                    console.log("Orientation Name selected:", { label: selectedOrientation, id: orientationTrackId });

                    // Reset dependent fields
                    setFieldValue("stream", "");
                    setFieldValue("streamId", "");
                    setFieldValue("program", "");
                    setFieldValue("programId", "");
                    setFieldValue("examProgram", "");
                    setFieldValue("examProgramId", "");
                    setFieldValue("batchName", "");
                    setFieldValue("batchId", "");
                    setFieldValue("startDate", "");
                    setFieldValue("endDate", "");
                    setFieldValue("orientationFee", "");
                    setStreamOptions([]);
                    setProgramOptions([]);
                    setExamProgramOptions([]);
                    setBatchOptions([]);
                    setBatchMap({});
                  }}
                  results={orientationLoading ? ["Loading orientations..."] : orientationOptions}
                  searchable={true}
                  required
                  disabled={orientationLoading}
                />
                <ErrorMessage name="orientationName" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Stream */}
              <div>
                <Dropdown
                  dropdownname="Stream"
                  name="stream"
                  value={values.stream}
                  onChange={(e) => {
                    const selectedStream = e.target.value;
                    setFieldValue("stream", selectedStream);
                    const streamId = streamIdMap[selectedStream] || "";
                    setFieldValue("streamId", streamId);
                    console.log("Stream selected:", { label: selectedStream, id: streamId });
                  }}
                  results={streamLoading ? ["Loading streams..."] : streamOptions}
                  required
                  disabled={streamLoading}
                />
                <ErrorMessage name="stream" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Program */}
              <div>
                <Dropdown
                  dropdownname="Program"
                  name="program"
                  value={values.program}
                  onChange={(e) => {
                    const selectedProgram = e.target.value;
                    setFieldValue("program", selectedProgram);
                    const programId = programIdMap[selectedProgram] || "";
                    setFieldValue("programId", programId);
                    console.log("Program selected:", { label: selectedProgram, id: programId });
                    setFieldValue("examProgram", "");
                    setFieldValue("examProgramId", "");
                    setExamProgramOptions([]);
                  }}
                  results={programLoading ? ["Loading programs..."] : programOptions}
                  required
                  disabled={programLoading}
                />
                <ErrorMessage name="program" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Exam Program */}
              <div>
                <Dropdown
                  dropdownname="Exam Program"
                  name="examProgram"
                  value={values.examProgram}
                  onChange={(e) => {
                    const selectedExamProgram = e.target.value;
                    setFieldValue("examProgram", selectedExamProgram);
                    const examProgramId = examProgramIdMap[selectedExamProgram] || "";
                    setFieldValue("examProgramId", examProgramId);
                    console.log("Exam Program selected:", { label: selectedExamProgram, id: examProgramId });
                  }}
                  results={examProgramLoading ? ["Loading exam programs..."] : examProgramOptions}
                  required
                  disabled={examProgramLoading}
                />
                <ErrorMessage name="examProgram" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Batch Name */}
              <div>
                <Dropdown
                  dropdownname="Batch Name"
                  name="batchName"
                  value={values.batchName}
                  onChange={(e) => {
                    const selectedBatchName = e.target.value;
                    setFieldValue("batchName", selectedBatchName);
                    const batch = batchMap[selectedBatchName];
                    if (batch && (batch.batchId || batch.id)) {
                      const batchId = batch.batchId || batch.id;
                      setFieldValue("batchId", batchId);
                      setFieldValue("section", "Not Allocated");
                      setFieldValue("sectionId", 0);
                      console.log("Batch Name selected:", { label: selectedBatchName, id: batchId });
                      console.log("Section selected:", { label: "Not Allocated", id: 0 });
                    } else {
                      console.warn("No valid batchId for selected batch:", selectedBatchName, batch);
                      setFieldValue("batchId", "");
                      setFieldValue("section", "Not Allocated");
                      setFieldValue("sectionId", 0);
                      console.log("Batch Name selected: (none)", { label: selectedBatchName });
                      console.log("Section selected:", { label: "Not Allocated", id: 0 });
                    }
                  }}
                  results={batchLoading ? ["Loading batches..."] : batchOptions}
                  searchable
                  required
                  disabled={batchLoading}
                />
                <ErrorMessage name="batchName" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Section */}
              <div>
                <Dropdown
                  dropdownname="Section"
                  name="section"
                  value={values.section}
                  onChange={(e) => {
                    const selectedSection = e.target.value;
                    setFieldValue("section", selectedSection);
                    const sectionId = sectionIdMap[selectedSection] || 0;
                    setFieldValue("sectionId", sectionId);
                    console.log("Section selected:", { label: selectedSection, id: sectionId });
                  }}
                  results={sectionOptions}
                  required
                  disabled
                />
                <ErrorMessage name="section" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Start Date */}
              <div>
                <Inputbox
                  label="Orientation Batch Start Date"
                  type="date"
                  name="startDate"
                  value={values.startDate}
                  onChange={(e) => setFieldValue("startDate", e.target.value)}
                  required
                />
                <ErrorMessage name="startDate" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* End Date */}
              <div>
                <Inputbox
                  label="Orientation Batch End Date"
                  type="date"
                  name="endDate"
                  value={values.endDate}
                  onChange={(e) => setFieldValue("endDate", e.target.value)}
                  required
                />
                <ErrorMessage name="endDate" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Orientation Fee */}
              <div>
                <Inputbox
                  label="Orientation Fee"
                  name="orientationFee"
                  value={values.orientationFee}
                  onChange={(e) => setFieldValue("orientationFee", e.target.value)}
                  required
                />
                <ErrorMessage name="orientationFee" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Food Preference */}
              <div>
                <label className={styles.food_preference_lable}>Food Preference</label>
                <CustomFoodDropdown
                  value={values.foodPreference}
                  onChange={(label, id) => {
                    setFieldValue("foodPreference", label);
                    setFieldValue("foodPreferenceId", id);
                    console.log("Food Preference set in form:", { label, id });
                  }}
                  error={touched.foodPreference && errors.foodPreference ? errors.foodPreference : null}
                  foodOptions={foodTypeOptions}
                  loading={foodTypeLoading}
                />
              </div>
            </div>

            {/* Payments table */}
            <div className={styles.Payment_Information_table_wrapper}>
              {loading ? (
                <Typography>Loading payments...</Typography>
              ) : payments.length === 0 ? (
                <Typography color="error">
                  No payments found. Please complete the fee transaction before confirming admission.
                </Typography>
              ) : (
                <Table className={styles.Payment_Information_table}>
                  <TableHead>
                    <TableRow>
                      {["HEADS", "FEE AMOUNT", "RECEIPT NO", "PAYMENT MODE", "PAYMENT STATUS", "PAYMENT DATE"].map(
                        (h) => (
                          <TableCell key={h}>{h}</TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{p.head}</TableCell>
                        <TableCell>{p.amount}</TableCell>
                        <TableCell>{p.receiptNo}</TableCell>
                        <TableCell>{p.mode}</TableCell>
                        <TableCell>{p.status}</TableCell>
                        <TableCell>{p.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className={styles.Payment_Information_submit_wrapper}>
              <Button
                type="button"
                variant="secondary"
                buttonname="Back"
                lefticon={<BackArrow />}
                onClick={handleBack}
              />
              <Button
                type="submit"
                variant="primary"
                buttonname="Submit"
                righticon={<TrendingUpIcon />}
              />
            </div>

            <a href="#" className={styles.concessionLinkButton}>
              <figure style={{ margin: 0, display: "flex", alignItems: "center" }}>
                <img src={SkipIcon} alt="Skip" style={{ width: 24, height: 24 }} />
              </figure>
              Proceed to payments
            </a>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PaymentInformation;