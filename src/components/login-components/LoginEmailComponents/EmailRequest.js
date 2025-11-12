import React, { useState } from "react";
import styles from "./EmailRequest.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Inputbox from "../../../widgets/Inputbox/FormInputBox";
import LoginButton from "../../../widgets/Button/LoginButton";
import { checkEmailId } from "../TestingLogging";
import { useNavigate } from "react-router-dom";


const EmailRequest = ({setSentOtpAnimation}) => {
  // const [showAnimation, setShowAnimation] = useState(false);
  const [serverEmailErrors, setServerEmailErrors] = useState(null);
  const navigate = useNavigate();

  const emailInitialValues = {
    emailId: "",
  };

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.emailId) {
      errors.emailId = "Email is required";
    } else if (!emailRegex.test(values.emailId)) {
      errors.emailId = "Invalid email format";
    }
    return errors;
  };

  const handleSendingOtpToEmail = async (values, { setSubmitting }) => {
    try {
      console.log("Form submitted with values:", values);
      const result = await checkEmailId(values); // Assume checkEmailId is async
      if (!result) {
        setServerEmailErrors("Invalid Email Id");
        setSentOtpAnimation(false);
      } else {
        setServerEmailErrors(null);
        setSentOtpAnimation(true); // Show animation on success
        setTimeout(() => {
          setSentOtpAnimation(false); // Reset animation state
          navigate("/login/otpverification"); // Navigate after animation
        }, 2000); // Delay to allow animation to play
      }
    } catch (error) {
      setServerEmailErrors("An error occurred. Please try again.");
      setSentOtpAnimation(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.emailrequest_container}>
      <Formik
          initialValues={emailInitialValues}
          validate={validate}
          onSubmit={handleSendingOtpToEmail}
          validateOnBlur={true}
          validateOnChange={false}
        >
          {({ isSubmitting, values }) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValidEmailFormat = emailRegex.test(values.emailId);
            const isFormValid = isValidEmailFormat;

            return (
              <Form className={styles.emailrequestpageform}>
                <div className={styles.email_request_fields}>
                  <Field
                    name="emailId"
                    type="email"
                    placeholder="Enter Email Id"
                    aria-label="Email Address"
                    component={Inputbox}
                  />
                  <ErrorMessage
                    name="emailId"
                    component="div"
                    className={styles.error}
                  />
                  {serverEmailErrors && (
                    <div className={styles.error}>{serverEmailErrors}</div>
                  )}
                </div>
                <LoginButton
                  buttonName="Reset Password"
                  initialStage={!isFormValid && !isSubmitting}
                  proceedStage={isValidEmailFormat && !isSubmitting}
                  loadingStage={isSubmitting}
                />
              </Form>
            );
          }}
        </Formik>
    </div>
  );
};

export default EmailRequest;