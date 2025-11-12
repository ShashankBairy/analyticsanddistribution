import React, { useState } from "react";
import styles from "./OtpVerification.module.css";
import { Formik, Form } from "formik";
import { otpValue } from "../TestingLogging";
import OtpInput from "../../../widgets/Inputbox/OtpInput";
import LoginButton from "../../../widgets/Button/LoginButton";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [otpErrors, setOtpErrors] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loadingStage, setLoadingStage] = useState(false);
  const navigate = useNavigate();

  const handleOtp = (values, { setSubmitting }) => {
    setLoadingStage(true);
    const result = otpValue(values);
    if (result) {
      setOtpErrors(null);
      setLoadingStage(false);
      setOtpVerified(true);
      setTimeout(() => {
        navigate("/login/passwordreset");
      }, 10000);
    } else {
      setOtpErrors("Invalid Otp");
      setSubmitting(false);
      setLoadingStage(false);
    }
  };

  return (
    <Formik initialValues={{ otp: "" }} onSubmit={handleOtp}>
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className={styles.otpForm}>
          <OtpInput
            length={6}
            value={values.otp}
            onChange={(val) => {
              setFieldValue("otp", val);
              if (otpErrors) setOtpErrors(null); // <-- clear error on input change
            }}
            error={!!otpErrors}
            success={otpVerified}
          />
          {otpErrors && (
            <div>
              <p className={styles.error}>{otpErrors}</p>
            </div>
          )}
          {otpVerified && (
            <div>
              <p className={styles.success}>Otp Verified Successfully</p>
            </div>
          )}
          <LoginButton
            buttonName={"Verify"}
            initialStage={values.otp.length !== 6 && !isSubmitting}
            proceedStage={values.otp.length === 6 && !isSubmitting}
            loadingStage={loadingStage}
            successedStage={otpVerified}
            successMessage={"Verified"}
          />
        </Form>
      )}
    </Formik>
  );
};

export default OtpVerification;
