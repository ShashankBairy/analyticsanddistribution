import styles from "./LoginContainer.module.css";
import loginbg from "../../assets/login-assets/loginbg.png";
import sclogo from "../../assets/login-assets/sc_logo.png";
import { Routes, Route, useLocation, NavLink } from "react-router-dom";
import LoginForm from "./LoginComponents/LoginForm";
import EmailRequest from "./LoginEmailComponents/EmailRequest";
import PasswordReset from "./PasswordResetComponents/PasswordReset";
import OtpVerification from "./OtpVerification/OtpVerification";
import { useState } from "react";
import LottieWithDot from "../../widgets/LottieWidgets/LottieWithDot/LottieWithDot";
import rightMarkAnimation from "../../assets/login-assets/Ukef0BzFKA.json";

const LoginContainer = () => {
  const [sentOtpAnimation, setSentOtpAnimation] = useState(false);
  const [passwordReseted, setPasswordReseted] = useState(false);
  const location = useLocation();
  console.log("Current Path:", location.pathname);

  const loginSubText = () => {
    if (location.pathname === "/login") {
      return <>Welcome</>;
    }
    if (location.pathname === "/login/emailrequest") {
      return <>Enter your email to </>;
    }
    if (location.pathname === "/login/otpverification") {
      return <>Enter OTP to</>;
    }
    if (location.pathname === "/login/passwordreset") {
      return <>Enter your new Password</>;
    }
    return null;
  };

  const loginTextHighlight = () => {
    if (location.pathname === "/login") {
      return <>Login </>;
    }
    if (location.pathname === "/login/emailrequest") {
      return <>Reset </>;
    }
    if (location.pathname === "/login/otpverification") {
      return <>Reset </>;
    }
    if (location.pathname === "/login/passwordreset") {
      return <>Reset </>;
    }
    return null;
  };

  const loginTextHeading = () => {
    if (location.pathname === "/login") {
      return <>to your account</>;
    }
    if (location.pathname === "/login/emailrequest") {
      return <>your password</>;
    }
    if (location.pathname === "/login/otpverification") {
      return <>your password</>;
    }
    if (location.pathname === "/login/passwordreset") {
      return <>your password</>;
    }
    return null;
  };

  const loginFooter = () =>{
    if (location.pathname === "/login") {
      return null;
    }
    if (location.pathname === "/login/emailrequest") {
      return <p>Remember Password? <NavLink to={"/login"}>Login Here</NavLink></p>;
    }
    if (location.pathname === "/login/otpverification") {
      return null;
    }
    if (location.pathname === "/login/passwordreset") {
      return null;
    }
    return null;
  }

  return (
    <div className={styles.login_container}>
      <div className={styles.bgimage}>
        <figure>
      <img src={loginbg} className={styles.loginbg} alt='loginbg'/>
    </figure>
      </div>
      <div className={styles.login_content}>
        <figure>
          <img src={sclogo} className={styles.sclogo} alt="sclogo" />
        </figure>
        {!sentOtpAnimation && (
          <div className={styles.login_content_form}>
            <div className={styles.login_content_form_top}>
              <p className={styles.login_top_sub}>{loginSubText()}</p>
              <p className={styles.login_top_heading}>
                <span className={styles.login_heading_highlight}>
                  {loginTextHighlight()}
                </span>
                {loginTextHeading()}
              </p>
            </div>
            <div className={styles.login_form_content}>
              <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route
                  path="/emailrequest"
                  element={
                    <EmailRequest setSentOtpAnimation={setSentOtpAnimation} />
                  }
                />
                <Route path="/otpverification" element={<OtpVerification />} />
                <Route path="/passwordreset" element={<PasswordReset setPasswordReseted={setPasswordReseted} />} />
              </Routes>
            </div>
          </div>
        )}
        {!sentOtpAnimation && (
          <div className={styles.login_footer}>
            {loginFooter()}
          </div>
        )}
        {sentOtpAnimation && (
          <LottieWithDot src={rightMarkAnimation} width={200} height={200} />
        )}
      </div>
    </div>
  );
};

export default LoginContainer;
