import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import StatusSelector from "../../../../widgets/StatusSelector/StatusSelector";
import ProgressHeader from "../../../../widgets/ProgressHeader/ProgressHeader";
import StatusHeader from "../../StatusHeader/StatusHeader";
import SaleStatusForm from "./components/SaleStatusForm";
import ConfirmationStatusForm from "./components/ConfirmationStatusForm";
import DamagedStatusForm from "./components/DamagedStatusForm";
import SuccessStatusForm from "./components/SuccessStatusForm";
import { useFormHandlers } from "./hooks/useFormHandlers";
import backButton from "../../../../assets/application-status/BakArrow.svg";
import styles from "./ApplicationStatusForm.module.css";

const ApplicationStatusFormRefactored = ({ onBack, initialData = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationInitialValues = (location && location.state && location.state.initialValues) ? location.state.initialValues : {};
 
  // Debug logging for location state
  
  const { applicationNo, status } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [activeConfirmationStep, setActiveConfirmationStep] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(status ? status.charAt(0).toUpperCase() + status.slice(1) : "");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successStatusType, setSuccessStatusType] = useState("sale");
  const [couponDetails, setCouponDetails] = useState({ mobile: "", code: "" });
  const [persistentData, setPersistentData] = useState({ campus: "", zone: "" });

  // Set selectedStatus from URL parameter
  useEffect(() => {
    if (status) {
      const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
      setSelectedStatus(capitalizedStatus);
    }
  }, [status]);

  const steps = [
    "General Information",
    "Concession Information",
    "Address Information",
    "Payment Information",
  ];

  // Default initial values
  const defaultInitialValues = {
    siblingInformation: [],
    status: "",
    additionalCourseFee: "",
    scoreAppNo: "",
    marks: "",
    camp: "",
    admissionReferredBy: "",
    category: 1,
    htNo: "",
    aadhaar: "",
    appType: "",
    appFee: "",
    applicationFee: "500",
    surname: "",
    studentName: "",
    fatherName: "",
    occupation: "",
    phoneNumber: "",
    studentType: "",
    dob: "",
    gender: "",
    joinedCampus: "",
    city: "",
    joinInto: "",
    course: "",
    courseBatch: "",
    courseDates: "",
    fee: "",
    schoolState: "",
    schoolDistrict: "",
    schoolType: "",
    schoolName: "",
    totalFee: "",
    yearConcession1st: "",
    yearConcession2nd: "",
    yearConcession3rd: "",
    givenBy: "",
    givenById: "",
    description: "",
    authorizedBy: "",
    authorizedById: "",
    reason: "",
    concessionReasonId: "",
    concessionWritten: "",
    couponMobile: "",
    couponCode: "",
    doorNo: "",
    street: "",
    landmark: "",
    area: "",
    addressCity: "",
    district: "",
    mandal: "",
    pincode: "",
    payMode: 1,
    paymentDate: null,
    amount: "",
    receiptNumber: "",
    appFeeReceived: false,
    appFeePayMode: 1,
    appFeePayDate: null,
    appFeeAmount: "",
    appFeeReceiptNo: "",
    applicationNo: initialData.applicationNo || applicationNo || "257000006",
    zoneName: "",
    campusName: "",
    dgmName: "",
    quota: "",
    foodprefrence: "",
    mobileNumber: "",
    coupon: "",
    section: "", // Added section
    mainDdPayDate: null,
    mainDdAmount: "",
    mainDdReceiptNumber: "",
    mainDdOrganisationName: "",
    mainDdNumber: "",
    mainDdCityName: "",
    mainDdBankName: "",
    mainDdBranchName: "",
    mainDdIfscCode: "",
    mainDdDate: null,
    mainChequePayDate: null,
    mainChequeAmount: "",
    mainChequeReceiptNumber: "",
    mainChequeOrganisationName: "",
    mainChequeNumber: "",
    mainChequeCityName: "",
    mainChequeBankName: "",
    mainChequeBranchName: "",
    mainChequeIfscCode: "",
    mainChequeDate: null,
    feeDdPayDate: null,
    feeDdAmount: "",
    feeDdReceiptNumber: "",
    feeDdOrganisationName: "",
    feeDdNumber: "",
    feeDdCityName: "",
    feeDdBankName: "",
    feeDdBranchName: "",
    feeDdIfscCode: "",
    feeDdDate: null,
    feeChequePayDate: null,
    feeChequeAmount: "",
    feeChequeReceiptNumber: "",
    feeChequeOrganisationName: "",
    feeChequeNumber: "",
    feeChequeCityName: "",
    feeChequeBankName: "",
    feeChequeBranchName: "",
    feeChequeIfscCode: "",
    feeChequeDate: null,
    // Hidden/system fields
    // proId: 4095,
    statusId: 2,
    createdBy: 2,
  };

  // Merge initial values
  const initialValues = useMemo(() => ({
    ...defaultInitialValues,
    ...initialData,
    ...locationInitialValues
  }), [defaultInitialValues, initialData, locationInitialValues]);

  // Form handlers
  const {
    handleSubmit,
    handleStepChange: baseHandleStepChange,
    handleNext: baseHandleNext,
    handleBack,
    handleCouponSubmit,
    handleConfirmationSuccess,
    getApplicationData,
    isSubmitting,
    saleData,
    applicationData
  } = useFormHandlers(initialData);

  // Enhanced handleNext that actually changes the step
  const handleNext = useCallback(async (values, setFieldValue, validateForm, setTouched) => {
    const result = await baseHandleNext(values, setFieldValue, validateForm, setTouched);
    if (result) {
      setActiveStep(prev => prev + 1);
    }
    return result;
  }, [baseHandleNext, activeStep]);

  // Enhanced handleStepChange that actually changes the step
  const handleStepChange = useCallback((step) => {
    setActiveStep(step);
  }, []);

  // Handle back to previous step (not previous page)
  const handleBackToPreviousStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  }, [activeStep]);

  // Header data
  const headerCampus = initialValues.campusName || initialValues.campus || initialValues.joinedCampus || persistentData.campus || "";
  const headerZone = initialValues.zoneName || initialValues.zone || initialValues.district || persistentData.zone || "";

  // Handle back navigation
  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      handleBack();
    }
  };

  // Handle status selection
  const handleStatusSelect = (newStatus) => {
    if (showSuccess) return;
    setSelectedStatus(newStatus);
    const pathSegment = newStatus.toLowerCase();
    const appNo = initialValues.applicationNo || applicationNo || "";
    if (appNo) {
      // Pass current application data through navigation state to ensure StatusHeader visibility
      // Use current resolved values and persistent data as fallback to preserve data
      const currentData = {
        applicationNo: applicationData?.applicationNo || initialValues.applicationNo || applicationNo || "",
        zoneName: initialValues.zoneName || initialValues.zone || initialValues.district || headerZone || persistentData.zone || "",
        zone: initialValues.zoneName || initialValues.zone || initialValues.district || headerZone || persistentData.zone || "",
        zoneEmpId: initialValues.zoneEmpId || "",
        campusName: initialValues.campusName || initialValues.campus || initialValues.joinedCampus || headerCampus || persistentData.campus || "",
        campus: initialValues.campusName || initialValues.campus || initialValues.joinedCampus || headerCampus || persistentData.campus || "",
        campusId: initialValues.campusId || "",
        proName: initialValues.proName || "",
        dgmName: initialValues.dgmName || "",
        dgmEmpId: initialValues.dgmEmpId || "",
        status: initialValues.status || "",
        statusId: initialValues.statusId || "",
        reason: initialValues.reason || "",
      };
     
      navigate(`/scopes/application/status/${appNo}/${pathSegment}`, {
        state: {
          initialValues: currentData,
        },
      });
    }
  };

 
  return (
    <div className={styles.Application_Status_Form_main_app_status_container}>
      <div className={styles.Application_Status_Form_main_app_status_header}>
        <div className={styles.Application_Status_Form_main_app_status_header_back_btn}>
          <div className={styles.Application_Status_Form_main_back_btn} onClick={handleBackClick}>
            <img src={backButton} alt="back" />
          </div>
        </div>
        <div className={styles.Application_Status_Form_main_app_status_header_status_header}>
          {!showSuccess && (
            <StatusHeader
              applicationNo={applicationData?.applicationNo || initialValues.applicationNo || applicationNo || ""}
              campusName={headerCampus}
              zoneName={headerZone}
            />
          )}
        </div>
      </div>
      <div className={styles.Application_Status_Form_main_layout_wrapper}>
        <StatusSelector
          selectedStatus={selectedStatus}
          onStatusSelect={handleStatusSelect}
          showOnlyTitle={showSuccess}
          currentStatus={showSuccess ? "Confirmation" : ""}
          applicationNo={initialValues.applicationNo || applicationNo || ""}
        />
        {!showSuccess && selectedStatus === "Sale" && <ProgressHeader step={activeStep} totalSteps={steps.length} />}
        {!showSuccess && selectedStatus === "Confirmation" && <ProgressHeader step={activeConfirmationStep} totalSteps={2} />}
      </div>
      
      {showSuccess ? (
        <SuccessStatusForm
          applicationNo={initialValues.applicationNo}
          studentName={initialValues.studentName}
          amount={initialValues.amount}
          campus={initialValues.campusName || initialValues.joinedCampus || initialValues.campus || ""}
          zone={initialValues.zoneName || initialValues.district || initialValues.zone || ""}
          onBack={() => navigate("/scopes/application")}
          statusType={successStatusType}
        />
      ) : selectedStatus === "Confirmation" ? (
        <ConfirmationStatusForm
          onSuccess={handleConfirmationSuccess}
          applicationData={getApplicationData()}
          onStepChange={(step) => setActiveConfirmationStep(step)}
          saleData={saleData}
        />
      ) : selectedStatus === "Sale" ? (
        <SaleStatusForm
          initialValues={initialValues}
          activeStep={activeStep}
          steps={steps}
          onStepChange={handleStepChange}
          onSubmit={handleSubmit}
          onNext={handleNext}
          onBack={handleBackToPreviousStep}
          onCouponSubmit={handleCouponSubmit}
          isSubmitting={isSubmitting}
          showCouponModal={showCouponModal}
          setShowCouponModal={setShowCouponModal}
          couponDetails={couponDetails}
          setCouponDetails={setCouponDetails}
        />
      ) : selectedStatus === "Damaged" ? (
        <DamagedStatusForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
};

export default ApplicationStatusFormRefactored;
