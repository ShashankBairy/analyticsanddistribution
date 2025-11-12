import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import PasswordInputBox from "../../../widgets/Inputbox/PasswordInputBox";
import LoginButton from "../../../widgets/Button/LoginButton";
import styles from "./PasswordReset.module.css";
import { useNavigate } from "react-router-dom";

// Yup validation schema for new password
const newPasswordValidateSchema = Yup.string()
  .required("New password is required")
  .matches(/^[A-Z]/, "Password must start with a capital letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  )
  .min(8, "Password must be at least 8 characters")
  .max(12, "Password must be at most 12 characters");

const PasswordReset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState(""); // Track the password input
  const navigate = useNavigate();
  const [loadingStage, setLoadingStage] = useState(false);

  // Password validation rules
  const passwordValidation = {
    startsWithCapital: /^[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    lengthValid: password.length >= 8 && password.length <= 12,
  };

  const allValid = Object.values(passwordValidation).every((rule) => rule);

  // Handle password reset on form submission
  const handlePasswordReset = (values, { setSubmitting }) => {
    // Simulate an API call delay with setTimeout
    setLoadingStage(true);
    setTimeout(() => {
      console.log("Password reset successful!");
      navigate("/login")
      // Perform your actual API call here to reset the password
      setSubmitting(false);
    }, 2000); // Simulate a 2-second delay for API call
  };

  return (
    <Formik
      initialValues={{ newPassword: "", confirmPassword: "" }}
      onSubmit={handlePasswordReset}
      validateOnChange={false}
      validateOnBlur={true}
      validationSchema={Yup.object({
        newPassword: newPasswordValidateSchema,
        confirmPassword: Yup.string()
          .required("Confirm password is required")
          .test(
            "password-required",
            "Password is required",
            (value, context) => {
              // Check if confirmPassword has value and newPassword is empty
              return !(value && !context.parent.newPassword);
            }
          ),
        // Removed .oneOf to handle matching manually and avoid errors while typing
      })}
    >
      {({
        values,
        setFieldValue,
        errors,
        touched,
        isSubmitting,
        validateForm,
      }) => {
        const passwordsMatch = values.newPassword === values.confirmPassword;
        const isFormValid =
          values.newPassword &&
          values.confirmPassword &&
          passwordsMatch &&
          !errors.newPassword &&
          !errors.confirmPassword;

        return (
          <Form className={styles.form}>
            <div className={styles.formFields}>
              {/* New Password */}
              <Field
                name="newPassword"
                as={PasswordInputBox}
                type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                error={errors.newPassword && touched.newPassword}
                success={!errors.newPassword && touched.newPassword}
                isEyeIconClicked={showPassword}
                toggleEye={() => setShowPassword((prev) => !prev)}
                onChange={(e) => {
                  setFieldValue("newPassword", e.target.value);
                  setPassword(e.target.value); // Track password for validation
                }}
              />

              {/* Show password validation rules unless all are valid */}
              {!allValid && (
                <div className={styles.passwordValidations}>
                  <p
                    className={
                      passwordValidation.startsWithCapital
                        ? styles.valid
                        : styles.invalid
                    }
                  >
                    Must start with a capital letter
                  </p>
                  <p
                    className={
                      passwordValidation.hasLowercase
                        ? styles.valid
                        : styles.invalid
                    }
                  >
                    Must contain at least one lowercase letter
                  </p>
                  <p
                    className={
                      passwordValidation.hasNumber
                        ? styles.valid
                        : styles.invalid
                    }
                  >
                    Must contain at least one number
                  </p>
                  <p
                    className={
                      passwordValidation.hasSpecialChar
                        ? styles.valid
                        : styles.invalid
                    }
                  >
                    Must contain at least one special character
                  </p>
                  <p
                    className={
                      passwordValidation.lengthValid
                        ? styles.valid
                        : styles.invalid
                    }
                  >
                    Must be between 8 to 12 characters
                  </p>
                </div>
              )}

              {/* Display newPassword error */}
              {errors.newPassword && touched.newPassword && (
                <div className={styles.errorMessage}>{errors.newPassword}</div>
              )}
            </div>

            {/* Confirm Password */}
            <Field name="confirmPassword">
              {({ field, form }) => {
                const confirmValue = field.value;
                const newPass = form.values.newPassword;
                const isPrefixMatch =
                  newPass.slice(0, confirmValue.length) === confirmValue;
                const showConfirmSuccess =
                  confirmValue.length > 0 && isPrefixMatch;
                const showConfirmError =
                  confirmValue.length > 0 && !isPrefixMatch;

                return (
                  <PasswordInputBox
                    {...field}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm New Password"
                    error={
                      showConfirmError ||
                      (form.errors.confirmPassword &&
                        form.touched.confirmPassword)
                    }
                    success={
                      showConfirmSuccess &&
                      !(
                        form.errors.confirmPassword &&
                        form.touched.confirmPassword
                      )
                    }
                    isEyeIconClicked={showConfirm}
                    toggleEye={() => setShowConfirm((prev) => !prev)}
                  />
                );
              }}
            </Field>

            {/* Display confirmPassword error (required or password required) */}
            {errors.confirmPassword && touched.confirmPassword && (
              <div className={styles.errorMessage}>{errors.confirmPassword}</div>
            )}

            {/* Manual mismatch error, shown on blur if not matching */}
            {touched.confirmPassword && values.confirmPassword && !passwordsMatch && (
              <div className={styles.invalid}>Passwords do not match</div>
            )}

            {/* Success message when passwords match */}
            {passwordsMatch && values.confirmPassword && (
              <div className={styles.valid}>Passwords match</div>
            )}

            {/* Reset Password Button */}
            <LoginButton
              buttonName="Reset Password"
              initialStage={!isFormValid || isSubmitting}
              loadingStage={isSubmitting}
              proceedStage={isFormValid && !isSubmitting}
              onClick={() => {
                // Trigger validation when button is clicked
                validateForm();
              }}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default PasswordReset;