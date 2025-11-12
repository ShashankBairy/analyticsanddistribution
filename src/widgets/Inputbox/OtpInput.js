import React, { useState, useRef, useEffect } from "react";
import styles from "./OtpInput.module.css";

const OtpInput = ({ length = 6, value = "", onChange, error = false, success = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  // Initialize OTP from Formik value
  useEffect(() => {
    if (value) {
      const valueArr = value.split("").slice(0, length);
      setOtp([...valueArr, ...Array(length - valueArr.length).fill("")]);
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const val = e.target.value;

    if (/\d/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      // Notify parent
      onChange(newOtp.join(""));

      // Focus next input
      if (index < length - 1) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChange(newOtp.join(""));

      if (index > 0 && otp[index] === "") inputRefs.current[index - 1].focus();
    }
  };

  const middleIndex = Math.floor(length / 2);

  return (
    <div className={styles.otpInput_wrapper}>
      <label className={styles.otpLabel}>Enter OTP</label>
      <div className={styles.otpInputBox}>
        {otp.map((digit, index) => (
          <React.Fragment key={index}>
            <input
              type="text"
              placeholder="-"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
              // Apply error/success classes dynamically
              className={`${styles.otpInput} ${
                error ? styles.error : success ? styles.success : ""
              }`}
            />
            {/* Divider after first half */}
            {index === middleIndex - 1 && length > 1 && (
              <span className={styles.otpDivider}>-</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OtpInput;
