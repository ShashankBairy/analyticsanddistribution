import React from "react";
import styles from "./loginError.module.css"
import errortext from "../../../assets/login-assets/errortext.svg";

const LoginError = ({ errorType }) => {
    
    // 💡 Logic: Determine the heading text based on the prop value
    let headingText = "";
    if (errorType === "deactivated") {
        headingText = "Deactivated / Expired / Unregistered";
    } else if (errorType === "invalid") {
        headingText = "Invalid Credentials";
    } else {
        headingText = "An unknown error occurred"; // Default/Fallback text
    }

    return(
        <div className={styles.loginerror_wrapper}>
            <div className={styles.loginerror_status_text}>
                <div className={styles.loginerror_status}>
                    <img src={errortext}/>
                    <p>ERROR</p>
                </div>
                <div className={styles.loginerror_text}>
                    {/* 💡 Change: Use the dynamic variable here */}
                    <p className={styles.loginerror_heading}>{headingText}</p>
                    <p className={styles.loginerror_description}>Please contact admin to help you to login</p>
                </div>
            </div>
            <div className={styles.loginerror_support}>
                <a>Contact Support</a>
            </div>
        </div>
    )
}

export default LoginError;