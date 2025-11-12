import { Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import * as apiService from "../../../../queries/application-status/ConfirmationApis";
import PaymentInformation from "./PaymentInformation/PaymentInformation";
import StudentInformation from "./StudentInformation/StudentInformation";
import SuccessPage from "../ConformationPage/SuccessPage";
import styles from "./ConformationHeader.module.css";

const ConformationHeader = ({ onStepChange, onSuccess, applicationData = {}, saleData = null }) => {
  const [step, setStep] = useState(0);
  const [isStudentInfoCompleted, setIsStudentInfoCompleted] = useState(false);
  const [studentInfoValues, setStudentInfoValues] = useState(null);
  const [applicationNo, setApplicationNo] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const totalSteps = 2;

  // Create fallback saleData from applicationData if saleData is null
  const effectiveSaleData = saleData || {
    applicationNo: applicationData.applicationNo,
    studAdmsNo: applicationData.applicationNo,
    admissionNo: applicationData.applicationNo,
    studentName: applicationData.studentName,
    firstName: applicationData.studentName,
    fatherName: applicationData.fatherName,
    motherName: applicationData.motherName,
    amount: applicationData.amount,
    campus: applicationData.campus
  };

  // Debug logging
  console.log("🔍 ConfirmationHeader received props:", {
    applicationData,
    saleData,
    saleDataApplicationNo: saleData?.applicationNo,
    saleDataAdmissionNo: saleData?.admissionNo,
    saleDataStudAdmsNo: saleData?.studAdmsNo
  });
  
  console.log("🔍 ConfirmationHeader saleData details:", {
    saleDataType: typeof saleData,
    saleDataIsNull: saleData === null,
    saleDataKeys: saleData ? Object.keys(saleData) : 'N/A',
    saleDataFull: saleData
  });

  console.log("🔍 ConfirmationHeader effectiveSaleData:", {
    effectiveSaleData,
    effectiveApplicationNo: effectiveSaleData?.applicationNo,
    effectiveStudAdmsNo: effectiveSaleData?.studAdmsNo
  });

  const updateStep = (newStep) => {
    setStep(newStep);
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  const handleChange = (_e, newValue) => {
    if (newValue === 0) {
      setStep(0);
      return;
    }
    if (newValue === 1) return;
  };

  const handlePaymentSubmit = async (paymentValues) => {
    setSaveError(null);

    // Normalize incoming payload (can be either the form's paymentInformation directly
    // or wrapped inside confirmationData.paymentInformation)
    const payloadRoot = paymentValues?.confirmationData ? paymentValues.confirmationData : paymentValues;
    const paymentInfo = payloadRoot?.paymentInformation || {};
    const studentInfo = studentInfoValues || payloadRoot?.studentInformation || {};

    const combinedConfirmation = {
      studentInformation: studentInfo,
      paymentInformation: paymentInfo,
    };
    console.log("Confirmation Data (Student + Payment):", combinedConfirmation);

    // Map food preference label to backend enum (fallback to 0 if unknown)
    const foodTypeMap = { "Vegetarian": 2, "Non-vegetarian": 3 };
    const resolvedFoodType =
      typeof paymentInfo?.foodPreferenceId === "number"
        ? paymentInfo.foodPreferenceId
        : foodTypeMap[paymentInfo?.foodPreference] ?? 0;

    // Construct the API request body
    // Ensure parentName is an actual name, not a relation label
    const candidateParentName = studentInfo?.parentName || studentInfo?.fatherName || studentInfo?.motherName || "";
    const sanitizedParentName = ["Father", "Mother"].includes((candidateParentName || "").trim())
      ? (studentInfo?.fatherName || studentInfo?.motherName || "")
      : candidateParentName;

    const requestBody = {
      admissionNo: String(studentInfo?.admissionNo || saleData?.applicationNo || "N/A"),
      firstName: studentInfo?.studentName || "",
      lastName: studentInfo?.surname || "",
      parentName: sanitizedParentName,
      gender: studentInfo?.gender === "Female" ? 2 : studentInfo?.gender === "Male" ? 1 : 0,
      // relationId: parseInt(studentInfo?.parentRelationId) || 0,
      concessions: [
        ...(studentInfo?.firstYearConcession && parseFloat(studentInfo.firstYearConcession) > 0
          ? [{
              concessionTypeId: 0,
              concessionAmount: parseFloat(studentInfo.firstYearConcession),
              reasonId: studentInfo.reasonId || 0,
            }]
          : []),
        ...(studentInfo?.secondYearConcession && parseFloat(studentInfo.secondYearConcession) > 0
          ? [{
              concessionTypeId: 0,
              concessionAmount: parseFloat(studentInfo.secondYearConcession),
              reasonId: studentInfo.reasonId || 0,
            }]
          : []),
        ...(studentInfo?.thirdYearConcession && parseFloat(studentInfo.thirdYearConcession) > 0
          ? [{
              concessionTypeId: 0,
              concessionAmount: parseFloat(studentInfo.thirdYearConcession),
              reasonId: studentInfo.reasonId || 0,
            }]
          : []),
      ],
      streamId: parseInt(paymentInfo?.streamId) || 0,
      programId: parseInt(paymentInfo?.programId) || 0,
      examProgramId: parseInt(paymentInfo?.examProgramId) || 0,
      orientationId: parseInt(paymentInfo?.orientationTrackId) || 0,
      batchId: parseInt(paymentInfo?.batchId) || 0,
      sectionId: parseInt(paymentInfo?.sectionId) || 0,
      app_conf_date: new Date().toISOString(),
      foodType: parseInt(resolvedFoodType) || 2,
      languages: [
        ...(studentInfo?.firstLanguage
          ? [{ langId: parseInt(studentInfo.firstLanguageId) || 1, languageName: studentInfo.firstLanguage }]
          : []),
        ...(studentInfo?.secondLanguage
          ? [{ langId: parseInt(studentInfo.secondLanguageId) || 1, languageName: studentInfo.secondLanguage }]
          : []),
        ...(studentInfo?.thirdLanguage
          ? [{ langId: parseInt(studentInfo.thirdLanguageId) || 1, languageName: studentInfo.thirdLanguage }]
          : []),
      ],
    };

    // Validate required IDs
    const requiredIds = {
      streamId: requestBody.streamId,
      programId: requestBody.programId,
      examProgramId: requestBody.examProgramId,
      orientationId: requestBody.orientationId,
      batchId: requestBody.batchId,
    };
    const missingIds = Object.entries(requiredIds).filter(([key, value]) => value === 0);
    if (missingIds.length > 0) {
      const errorMessage = `Missing or invalid IDs: ${missingIds.map(([key]) => key).join(", ")}`;
      console.error(errorMessage);
      setSaveError(errorMessage);
      return;
    }

    console.log("API Request Body:", requestBody);

    try {
      const response = await apiService.saveConfirmationData(requestBody);
      console.log("API Response:", response);
      setShowSuccess(true);
      if (onSuccess) {
        onSuccess(combinedConfirmation);
      }
    } catch (err) {
      console.error("Failed to save confirmation data:", err);
      setSaveError(err.response?.data?.message || "Failed to save confirmation data. Please try again.");
    }
  };

  if (showSuccess) {
    return (
      <SuccessPage
        applicationNo={applicationData.applicationNo || studentInfoValues?.admissionNo || "N/A"}
        studentName={studentInfoValues?.studentName || applicationData.studentName || "N/A"}
        amount={applicationData.amount || "N/A"}
        campus={applicationData.campus || saleData?.campusName || "N/A"}
        onBack={() => setShowSuccess(false)}
        statusType="confirmation"
      />
    );
  }

  return (
    <div className={styles.Conformation_Header_stepper_container}>
      {saveError && <Typography className={styles.error_message}>{saveError}</Typography>}
      <Tabs
        value={step}
        onChange={handleChange}
        variant="fullWidth"
        className={styles.Conformation_Header_tabs_root}
        TabIndicatorProps={{ style: { display: 'none' } }}

      >
        <Tab
          component="div"
          onClick={() => updateStep(0)}
          TabIndicatorProps={{ style: { display: "none" } }}
          label={
            <div
              className={`${styles.Conformation_Header_tab_label} ${
                step === 0 ? styles.Conformation_Header_active : step > 0 ? styles.Conformation_Header_completed : ""
              }`}
            >
              <div
                className={`${styles.Conformation_Header_tab_circle} ${
                  step === 0 ? styles.Conformation_Header_active : step > 0 ? styles.Conformation_Header_completed : ""
                }`}
              >
                1
              </div>
              Student Information
            </div>
          }
          className={`${styles.Conformation_Header_tab_item} ${styles.Conformation_Header_left} ${
            step === 0 ? styles.Conformation_Header_active : step > 0 ? styles.Conformation_Header_completed : ""
          }`}
        />
        <Tab
          component="div"
          TabIndicatorProps={{ style: { display: "none" } }}
          label={
            <div
              className={`${styles.Conformation_Header_tab_label} ${
                step === 1 ? styles.Conformation_Header_active : ""
              } ${!isStudentInfoCompleted ? styles.Conformation_Header_disabled : ""}`}
            >
              <div
                className={`${styles.Conformation_Header_tab_circle} ${
                  step === 1 ? styles.Conformation_Header_active : ""
                }`}
              >
                2
              </div>
              Orientation Information
            </div>
          }
          className={`${styles.Conformation_Header_tab_item} ${styles.Conformation_Header_right} ${
            step === 1 ? styles.Conformation_Header_active : ""
          } ${!isStudentInfoCompleted ? styles.Conformation_Header_disabled : ""}`}
        />
      </Tabs>

      <div>
        {step === 0 && (
          <>
            {console.log("🔍 Passing to StudentInformation:", {
              saleData,
              effectiveSaleData,
              saleDataApplicationNo: saleData?.applicationNo,
              saleDataStudAdmsNo: saleData?.studAdmsNo,
              effectiveApplicationNo: effectiveSaleData?.applicationNo,
              effectiveStudAdmsNo: effectiveSaleData?.studAdmsNo
            })}
            <StudentInformation
              saleData={effectiveSaleData}
              onNext={(vals) => {
                setStudentInfoValues(vals);
                setApplicationNo(vals.admissionNo || "");
                setIsStudentInfoCompleted(true);
                setStep(1);
                updateStep(1);
              }}
            />
          </>
        )}
        {step === 1 && isStudentInfoCompleted && (
          <PaymentInformation
            onSubmit={handlePaymentSubmit}
            saleData={effectiveSaleData}
            applicationNo={applicationNo || applicationData.applicationNo || effectiveSaleData?.applicationNo}
            handleBack={() => {
              setStep(0);
              updateStep(0);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConformationHeader;