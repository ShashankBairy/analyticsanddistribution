import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SuccessPage.module.css";
import pageicon from "../../../../assets/application-status/image (1).jpeg";
import Statusbar from "../../../../widgets/StatusBar/Statusbar";
import LottieWithDot from "../../../../widgets/LottieWidgets/LottieWithDot/LottieWithDot";
import successApplication from "../../../../assets/application-status/Varsity.lottie";
import Button from "../../../../widgets/Button/Button";
import rightarrow from "../../../../assets/application-distribution/rightarrow";

const SuccessPage = ({ applicationNo, studentName, amount, campus, zone, onBack, statusType = "sale", reverseOrder = false }) => {
  const navigate = useNavigate();
  const isSold = statusType === "sale" || statusType === "confirmation";
  const isConfirmed = statusType === "confirmation";
  const isDamaged = statusType === "damaged";
 
  // Handle navigation to application status page
  const handleBackToStatus = () => {
    // Use React Router's smooth navigation
    navigate("/scopes/application/status");
  };
 
  return (
    <div className={styles.Success_Page_root}>
      <div className={styles.Success_Page_paper}>
        {/* <Statusbar isSold={isSold} isConfirmed={isConfirmed} isDamaged={isDamaged} showLabels={true} reducedGap={true} labelWidth="36%" reverseOrder={reverseOrder} /> */}
       
        <div className={styles.Success_Page_iconContainer}>
          {/* <img src={pageicon} alt="Success Icon" className={styles.Success_Page_iconImage} /> */}
          <LottieWithDot src={successApplication} height={200} width={200}/>
        </div>
 
        <h5 className={styles.Success_Page_title}>
          Application No: {applicationNo || "N/A"}
        </h5>
 
        <h6 className={styles.Success_Page_subtitle}>
          {isConfirmed ? "Application confirmed" : "Update Successful"}
        </h6>
        <p className={styles.Success_Page_description}>
          {isConfirmed ? "Details added successfully" : "Application Details Added Successfully"}
        </p>
 
        {/* {studentName && <p className={styles.Success_Page_detail}>Student: {studentName}</p>}
        {amount && <p className={styles.Success_Page_detail}>Amount Paid: {amount}</p>}
        {campus && <p className={styles.Success_Page_detail}>Campus: {campus}</p>}
        {zone && <p className={styles.Success_Page_detail}>Zone: {zone}</p>} */}
 
        <div className={styles.successpagebackbutton}>
          <Button
          onClick={handleBackToStatus}
          variant={"primary"}
          buttonname={"Back To Application Status"}
          righticon={rightarrow}
          />

          {/* <button
          className={styles.Success_Page_button}
          onClick={handleBackToStatus}
        >
          Back To Application Status
        </button> */}
        </div>
      </div>
    </div>
  );
};
 
export default SuccessPage;
 