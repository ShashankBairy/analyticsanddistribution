import React from 'react';
import { Formik, Form } from 'formik';
import StepperTabs from '../../../../../widgets/StepperTabs/StepperTabs';
import GeneralInfoSection from '../../GeneralInfoSection/GeneralInfoSectionClean';
import ConcessionInfoSectionRefactored from '../../Concession/ConcessionInfoSectionRefactored';
import AddressInfoSectionRefactored from '../../../Existing_Components/AddressInfoSection/AddressInfoSectionRefactored';
import PaymentInfoSection from '../../PaymentInfoSection/PaymentInfoSection';
import { createCombinedValidationSchema } from '../utils/validationSchemas';
import styles from '../ApplicationStatusForm.module.css';

const SaleStatusForm = ({
  initialValues,
  activeStep,
  steps,
  onStepChange,
  onSubmit,
  onNext,
  onBack,
  onCouponSubmit,
  isSubmitting,
  showCouponModal,
  setShowCouponModal,
  couponDetails,
  setCouponDetails
}) => {
  // TEMPORARY: Disable validation for testing
  // const currentValidationSchema = createCombinedValidationSchema();
  const currentValidationSchema = null;
  
  console.log("🔍 SaleStatusForm rendering with activeStep:", activeStep);
  console.log("🔍 SaleStatusForm currentValidationSchema:", currentValidationSchema);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={currentValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ values, errors, touched, setFieldValue, handleChange, handleSubmit, validateForm, setTouched }) => (
        <Form className={styles.Application_Status_Form_main_application_form}>
          <div className={styles.Application_Status_Form_main_form_wrapper}>
            <StepperTabs 
              steps={steps} 
              activeStep={activeStep} 
              onStepChange={onStepChange} 
            />
            
            {activeStep === 0 && (
              <GeneralInfoSection
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setTouched}
                validateForm={validateForm}
                activeStep={activeStep}
                setActiveStep={onStepChange}
                steps={steps}
                handleNext={() => onNext(values, setFieldValue, validateForm, setTouched)}
                handleBack={onBack}
              />
            )}
            
            {activeStep === 1 && (
              <ConcessionInfoSectionRefactored
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setTouched}
                validateForm={validateForm}
                showCouponModal={showCouponModal}
                setShowCouponModal={setShowCouponModal}
                couponDetails={couponDetails}
                setCouponDetails={setCouponDetails}
                onCouponSubmit={() => onCouponSubmit(setFieldValue)}
                activeStep={activeStep}
                setActiveStep={onStepChange}
                steps={steps}
                handleNext={() => onNext(values, setFieldValue, validateForm, setTouched)}
                handleBack={onBack}
              />
            )}
            
            {activeStep === 2 && (
              <AddressInfoSectionRefactored
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setTouched}
                validateForm={validateForm}
                activeStep={activeStep}
                setActiveStep={onStepChange}
                steps={steps}
                handleNext={() => onNext(values, setFieldValue, validateForm, setTouched)}
                handleBack={onBack}
              />
            )}
            
            {activeStep === 3 && (
              <PaymentInfoSection
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setTouched}
                validateForm={validateForm}
                activeStep={activeStep}
                setActiveStep={onStepChange}
                steps={steps}
                handleNext={() => onNext(values, setFieldValue, validateForm, setTouched)}
                handleBack={onBack}
                handleSubmit={handleSubmit}
                finishDisabled={isSubmitting}
                onContinue={(backendResponse) => {
                  console.log("🔍 onContinue called with backend response:", backendResponse);
                  console.log("🔍 Backend response type:", typeof backendResponse);
                 
                  // Since backend returns a string, we'll use the existing application number
                  // The backend has already created the record with the studAdmsNo we sent
                  const admissionNo = values.applicationNo || values.studAdmsNo || initialValues.applicationNo;
                 
                  console.log("🔍 Using application number as admission number:", admissionNo);
                 
                  // Set sale data with the admission number and map fields for StudentInformation
                  const saleDataWithAdmission = {
                    ...values,
                    admissionNo: admissionNo,
                    studAdmsNo: admissionNo,
                    applicationNo: admissionNo,  // StudentInformation looks for this field
                    // Map form fields to StudentInformation expected fields
                    studentName: values.firstName || values.studentName || "",
                    surname: values.surname || "",
                    fatherName: values.fatherName || "",
                    motherName: values.motherName || "",
                    gender: values.gender || "1",
                    amount: values.amount || values.applicationFee || "",
                    appFeeAmount: values.applicationFee || "",
                    appFee: values.applicationFee || "",
                    yearConcession1st: values.yearConcession1st || "",
                    yearConcession2nd: values.yearConcession2nd || "",
                    yearConcession3rd: values.yearConcession3rd || "",
                    reason: values.reason || "",
                    reasonId: values.concessionReasonId || ""
                  };
                 
                  console.log("🔍 Setting sale data:", saleDataWithAdmission);
                  // This would be handled by the parent component
                  console.log("🔍 Setting selectedStatus to Confirmation");
                 
                  const pathSegment = "confirmation";
                  const appNo = admissionNo;
                 
                  console.log("🔍 Navigating to confirmation with admission number:", appNo);
                 
                  if (appNo) {
                    // This would be handled by the parent component
                    console.log("🔍 Navigation would happen here");
                  } else {
                    console.warn("⚠️ No admission number available for navigation");
                  }
                }}
              />
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SaleStatusForm;
