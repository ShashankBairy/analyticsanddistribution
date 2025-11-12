import React, { useState, useEffect } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Inputbox from "../../../Widgets/Inputbox/Input_box";
import Dropdown from "../../../Widgets/Dropdown/Dropdown";
import Button from "../../../Widgets/Button/Button";
import { ReactComponent as TrendingUpIcon } from "../../../Asserts/ApplicationStatus/Trending up.svg";
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
import {
  getJoinYears,
  getStreams,
  getCourses,
  getProgramsByStream,
  getBatchesByCourse
} from "../../../Bakend/apis"; // ✅ keep using centralized APIs

// Input fields
const inputFields = [
  { label: "Course Batch Start Date", name: "startDate", type: "date", required: true },
  { label: "Course Batch End Date", name: "endDate", type: "date", required: true },
  { label: "Course Fee", name: "courseFee", placeholder: "Enter Fee", required: true },
];

const headerItems = [
  { label: "Application No", value: "MPC" },
  { label: "PRO Name", value: "Direct Walkin" },
  { label: "PRO Mobile No", value: "Inter with NPL" },
  { label: "PRO Campus", value: "Residential" },
];

const validationSchema = Yup.object().shape({
  joinYear: Yup.string().required("This field is required"),
  courseName: Yup.string().required("This field is required"),
  stream: Yup.string().required("This field is required"),
  program: Yup.string().required("This field is required"),
  examProgram: Yup.string().required("This field is required"),
  batchName: Yup.string().required("This field is required"),
  section: Yup.string().required("This field is required"),
  startDate: Yup.date().required("This field is required"),
  endDate: Yup.date()
    .required("This field is required")
    .min(Yup.ref("startDate"), "End date must be after start date."),
  courseFee: Yup.number()
    .typeError("Invalid fee amount.")
    .positive("Invalid fee amount.")
    .required("This field is required"),
});

const PaymentInformation = ({ onBack, onSubmit, saleData = null }) => {
  const [joinYearOptions, setJoinYearOptions] = useState([]);
  const [defaultJoinYear, setDefaultJoinYear] = useState("");
  const [yearIdMap, setYearIdMap] = useState({});

  const [courseOptions, setCourseOptions] = useState([]);
  const [courseIdMap, setCourseIdMap] = useState({});

  const [streamOptions, setStreamOptions] = useState([]);
  const [streamIdMap, setStreamIdMap] = useState({});

  const [programOptions, setProgramOptions] = useState([]);
const [programIdMap, setProgramIdMap] = useState({});

const [batchOptions, setBatchOptions] = useState([]);
const [batchMap, setBatchMap] = useState({});


  // Fetch join years
  useEffect(() => {
    const fetchJoinYears = async () => {
      try {
        const data = await getJoinYears();
        if (data?.options) {
          const options = data.options.map((o) => o.academicYear);
          const map = {};
          data.options.forEach((o) => {
            map[o.academicYear] = o.acdcYearId;
          });
          setJoinYearOptions(options);
          setYearIdMap(map);

          if (data.default?.academicYear) {
            setDefaultJoinYear(data.default.academicYear);
          }
        }
      } catch (err) {
        console.error("Failed to fetch join years:", err);
      }
    };
    fetchJoinYears();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        if (Array.isArray(data)) {
          const options = data.map((c) => c.course_track_name);
          const map = {};
          data.forEach((c) => {
            map[c.course_track_name] = c.courseTrackId;
          });
          setCourseOptions(options);
          setCourseIdMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const initialValues = {
    joinYear: defaultJoinYear,
    joinYearId: yearIdMap[defaultJoinYear] || "",
    courseName: "",
    courseId: "",
    stream: "",
    streamId: "",
    program: "",
    examProgram: "",
    batchName: "",
    section: "",
    startDate: "",
    endDate: "",
    courseFee: "",
  };

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = [
        {
          head: "Tuition",
          amount: 5000,
          receiptNo: "R123",
          mode: "Cash",
          status: "Paid",
          date: "2025-08-01",
        },
        {
          head: "Admission",
          amount: 2000,
          receiptNo: "R124",
          mode: "Card",
          status: "Pending",
          date: "2025-08-05",
        },
      ];
      setPayments(data);
      setLoading(false);
    }, 500);
  }, []);

  const handleSubmit = (values) => {
    const confirmationDataObject = {
      paymentInformation: {
        joinYear: values.joinYear,
        joinYearId: yearIdMap[values.joinYear] || "",
        courseName: values.courseName,
        courseId: values.courseId || "",
        stream: values.stream,
        streamId: values.streamId || "",
        program: values.program,
        examProgram: values.examProgram,
        batchName: values.batchName,
        section: values.section,
        startDate: values.startDate,
        endDate: values.endDate,
        courseFee: values.courseFee,
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

  return (
    <div className={styles.Payment_Information_payment_information}>
      <StudentInfoHeader items={headerItems} />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className={styles.Payment_Information_form}>
            <div className={styles.Payment_Information_form_grid}>
              {/* Join Year */}
              <div>
                <Dropdown
                  dropdownname="Join Year"
                  name="joinYear"
                  value={values.joinYear}
                  onChange={(e) => {
                    setFieldValue("joinYear", e.target.value);
                    setFieldValue("joinYearId", yearIdMap[e.target.value] || "");
                  }}
                  results={joinYearOptions}
                  required
                />
                <ErrorMessage name="joinYear" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>

              {/* Course Name */}
             {/* Course Name */}
<div>
  <Dropdown
    dropdownname="Course Name"
    name="courseName"
    value={values.courseName}
    onChange={async (e) => {
      const selectedCourse = e.target.value;
      setFieldValue("courseName", selectedCourse);
      const courseId = courseIdMap[selectedCourse] || "";
      setFieldValue("courseId", courseId);

      if (courseId) {
        // ✅ Fetch Streams
        try {
          const data = await getStreams(courseId);
          if (Array.isArray(data)) {
            const options = data.map((s) => s.streamName);
            const map = {};
            data.forEach((s) => {
              map[s.streamName] = s.streamId;
            });
            setStreamOptions(options);
            setStreamIdMap(map);
          }
        } catch (err) {
          console.error("Failed to fetch streams by course:", err);
        }

        // ✅ Fetch Batches
        try {
          const batches = await getBatchesByCourse(courseId);
          if (Array.isArray(batches)) {
            const options = batches.map((b) => b.courseBatchName);
            const map = {};
            batches.forEach((b) => {
              map[b.courseBatchName] = b; // store full object
            });
            setBatchOptions(options);
            setBatchMap(map);
          }
        } catch (err) {
          console.error("Failed to fetch batches:", err);
        }
      }
    }}
    results={courseOptions}
    searchable={true}
    required
  />
  <ErrorMessage name="courseName" component="div" style={{ color: "red", fontSize: "12px" }} />
</div>


              {/* Stream */}
              <div>
  <Dropdown
    dropdownname="Stream"
    name="stream"
    value={values.stream}
    onChange={async (e) => {
      const selectedStream = e.target.value;
      setFieldValue("stream", selectedStream);
      setFieldValue("streamId", streamIdMap[selectedStream] || "");

      const streamId = streamIdMap[selectedStream];
      if (streamId) {
        try {
          const programs = await getProgramsByStream(streamId);
          if (Array.isArray(programs)) {
            const options = programs.map((p) => p.programName);
            const map = {};
            programs.forEach((p) => {
              map[p.programName] = p.programId;
            });
            setProgramOptions(options);
            setProgramIdMap(map);
          }
        } catch (err) {
          console.error("Failed to fetch programs:", err);
        }
      }
    }}
    results={streamOptions}
    required
  />
  <ErrorMessage name="stream" component="div" style={{ color: "red", fontSize: "12px" }} />
</div>

              {/* Exam Program */}
              <div>
  <Dropdown
    dropdownname="Program"
    name="program"
    value={values.program}
    onChange={(e) => {
      setFieldValue("program", e.target.value);
      setFieldValue("programId", programIdMap[e.target.value] || "");
    }}
    results={programOptions}
    required
  />
  <ErrorMessage name="program" component="div" style={{ color: "red", fontSize: "12px" }} />
</div>

              {/* Batch Name */}
              {/* Batch Name */}
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
      if (batch) {
        setFieldValue("batchId", batch.courseBatchId);
        setFieldValue("startDate", batch.start_date || "");
        setFieldValue("endDate", batch.end_date || "");
      }
    }}
    results={batchOptions}
    searchable
    required
  />
  <ErrorMessage name="batchName" component="div" style={{ color: "red", fontSize: "12px" }} />
</div>



              {/* Section */}
              <div>
                <Dropdown
                  dropdownname="Section"
                  name="section"
                  value={values.section}
                  onChange={handleChange}
                  results={["A", "B"]}
                  required
                />
                <ErrorMessage name="section" component="div" style={{ color: "red", fontSize: "12px" }} />
              </div>



              {/* Input Fields */}
              {inputFields.map((f) => (
                <div key={f.name}>
                  <Inputbox
                    label={f.label}
                    type={f.type || "text"}
                    name={f.name}
                    placeholder={f.placeholder}
                    value={values[f.name]}
                    onChange={handleChange}
                    required={f.required || false}
                  />
                  <ErrorMessage name={f.name} component="div" style={{ color: "red", fontSize: "12px" }} />
                </div>
              ))}
            </div>

            {/* Payment Table */}
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

            {/* Submit Button */}
            <div className={styles.Payment_Information_submit_wrapper}>
              <Button
                type="submit"
                variant="primary"
                buttonname="Submit"
                righticon={<TrendingUpIcon />}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PaymentInformation;
