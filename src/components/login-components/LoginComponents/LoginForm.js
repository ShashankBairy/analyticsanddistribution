import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import InputBox from "../../../widgets/Inputbox/FormInputBox";
import PasswordInputBox from "../../../widgets/Inputbox/PasswordInputBox";
import LoginButton from "../../../widgets/Button/LoginButton";
import Checkbox from "../../../widgets/Checkbox/Checkbox";
import loginValidationSchema from "../loginValidationSchema";
import LoginError from "../LoginErrorComponents/loginError";

import { encryptAndManipulate } from "../encryptPassword";
import {
  loginSubmit,
  getScreenPermissions2,
} from "../../../queries/loginquery";
import { mergeAllRolePermissions } from "../../../utils/mergeAllRolePermissions";
import {
  setRolePermissions,
  setEmployeeId,
} from "../../../slices/authorizationSlice";
import { persistor } from "../../../redux/store";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [serverErrors, setServerErrors] = useState({
    emailId: null,
    password: null,
    general: null,
  });
  const [customErrorType, setCustomErrorType] = useState(null);

  const loginInitialValues = { emailId: "", password: "" };

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    setCustomErrorType(null);
    try {
      const { emailId, password } = values;
      console.log("[Login] values →", values);

      // 🔐 Encrypt password
      const encryptedPassword = encryptAndManipulate(password, 1);
      const payload = { emailId, password: encryptedPassword };
      console.log("[Login] payload →", payload);

      // Call login API
      const res = await loginSubmit(payload);
      const resp = res?.data ?? res; // normalize for axios/fetch

      const ERROR_MAP = {
        "Password Incorrect": (prev) => ({
          ...prev,
          emailId: null,
          password: "Incorrect password",
          general: null, // Show error beneath password field
        }),
        "User is not active": (prev) => {
          setCustomErrorType("deactivated");
          return { emailId: " ", password: " ", general: null }; 
        },
        "Email is not existed": (prev) => {
          setCustomErrorType("invalid");
          return { emailId: " ", password: " ", general: null }; 
        },
      };

      // ✅ Success path
      if (resp && (resp.isLoginSuccess || resp.loginSuccess)) {
        console.log("[Login] success branch hit");

        const accessToken = resp?.jwt?.accessToken;
        const exp = resp?.jwt?.expiresAtEpochSeconds;
        const type = resp?.jwt?.tokenType;

        if (accessToken) {
          // store token early
          localStorage.setItem("authToken", accessToken);
          if (exp != null) localStorage.setItem("authTokenExp", String(exp));
          if (type) localStorage.setItem("authTokenType", type);

          // get permissions
          console.log("Permissions method is called");
          const response = await getScreenPermissions2(accessToken, type);
          console.log("Screen Permissions →", response);

          const mergedPermissions = mergeAllRolePermissions(response);
          console.log("Merged Permissions →", mergedPermissions);

          // 🔥 Dispatch to Redux
          dispatch(setRolePermissions(mergedPermissions));
          if (resp?.empId) dispatch(setEmployeeId(resp.empId));

          // flush redux-persist so it's saved before navigation
          await persistor.flush();
        } else {
          console.warn("[Login] jwt.accessToken missing in response");
        }

        if (resp?.empName) localStorage.setItem("empName", resp.empName);
        if (resp?.empId != null)
          localStorage.setItem("empId", String(resp.empId));
        if (resp?.designation)
          localStorage.setItem("designation", resp.designation);
        if (resp?.category) localStorage.setItem("category", resp.category);
        if (resp?.campusName)
          localStorage.setItem("campusName", resp.campusName);

        console.log("[Login] navigating to /scopes");
        navigate("/scopes");
        return;
      }

      // ❌ Failure path
      const reason = resp?.reason || "Login failed. Please try again.";
      console.log("[Login] failure reason →", reason);

      const updater = ERROR_MAP[reason];
      if (updater) setServerErrors((prev) => updater(prev));
      else
        setServerErrors((prev) => ({
          ...prev,
          general: reason,
        }));
    } catch (err) {
      console.error("[Login] exception →", err);
      setServerErrors((prev) => ({
        ...prev,
        general: "Something went wrong. Try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={loginInitialValues}
        validationSchema={loginValidationSchema}
        onSubmit={handleLoginSubmit}
        validateOnBlur
        validateOnChange={false}
      >
        {({ isSubmitting, values, errors, touched }) => {
          const isEmailValid =
            values.emailId && !errors.emailId && touched.emailId;
          const isPasswordValid =
            values.password && !errors.password && touched.password;
          const isFormValid =
            (isEmailValid && touched.password) ||
            (isPasswordValid && touched.emailId);

          return (
            <Form className={styles.loginpageform}>
              <div className={styles.login_form_fields}>
                <Field
                  name="emailId"
                  type="email"
                  placeholder="Enter Email Id"
                  label="Email Id"
                  component={InputBox}
                />
                <ErrorMessage
                  name="emailId"
                  component="div"
                  className={styles.error}
                />
                {serverErrors.emailId && (
                  <div className={styles.error}>{serverErrors.emailId}</div>
                )}

                <Field name="password">
                  {({ field, meta }) => (
                    <PasswordInputBox
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Enter Password"
                      isInputBoxTouched={meta.touched}
                      error={
                        meta.touched && (!!meta.error || serverErrors.password)
                      }
                      success={
                        meta.touched && !meta.error && !serverErrors.password
                      }
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
                {serverErrors.password && (
                  <div className={styles.error}>{serverErrors.password}</div>
                )}
              </div>

              <div className={styles.login_remember_reset}>
                <Checkbox name="rememberme" label="Remember Me" />
                <NavLink className={styles.resetRoute} to="/login/emailrequest">
                  Reset Password
                </NavLink>
              </div>

              {serverErrors.general && (
                <div className={styles.login_result}>
                  {serverErrors.general}
                </div>
              )}

              <LoginButton
                buttonName="Login"
                initialStage={!isFormValid && !isSubmitting}
                loadingStage={isSubmitting}
                proceedStage={
                  (isFormValid && !isSubmitting) || values.password?.length > 0
                }
              />
            </Form>
          );
        }}
      </Formik>
      {customErrorType && (
        <div className={styles.loginerror_support}>
          <LoginError errorType={customErrorType} />
          <p className={styles.requestLogin}>
            Can't Login? <a>Request Login</a>
          </p>
        </div>
      )}
    </>
  );
};

export default LoginForm;
