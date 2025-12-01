import React, {useEffect} from "react";

import styles from "./DistriubtionSuccessPage.module.css";
import LottieWithDot from "../LottieWidgets/LottieWithDot/LottieWithDot";
import SuccessfullGif from "../../assets/application-status/Varsity.lottie";
import Button from "../Button/Button"

const rightSideIcon = (
    <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.36133 9.59636C3.87952 9.59636 3.48894 9.98694 3.48894 10.4688C3.48894 10.9506 3.87952 11.3411 4.36133 11.3411V10.4688V9.59636ZM18.064 11.0856C18.4047 10.7449 18.4047 10.1926 18.064 9.85188L12.5122 4.30002C12.1715 3.95933 11.6191 3.95933 11.2784 4.30002C10.9378 4.64071 10.9378 5.19308 11.2784 5.53377L16.2134 10.4688L11.2784 15.4037C10.9378 15.7444 10.9378 16.2968 11.2784 16.6375C11.6191 16.9782 12.1715 16.9782 12.5122 16.6375L18.064 11.0856ZM4.36133 10.4688V11.3411H17.4472V10.4688V9.59636H4.36133V10.4688Z" fill="white"/>
    </svg>
);

const DistriubtionSuccessPage = ({ onClose }) => {

    useEffect(() => {
        // Function to handle the click event
        const handleGlobalClick = () => {
            // Call the function passed from the parent to close the page
            onClose();
        };

        // Attach the listener to the whole document body
        // We use 'mousedown' as it fires slightly earlier than 'click'
        document.addEventListener("mousedown", handleGlobalClick);

        // Cleanup function: This runs when the component unmounts
        // or before the effect runs again (if dependencies change, though here it's an empty array)
        return () => {
            document.removeEventListener("mousedown", handleGlobalClick);
        };
    }, [onClose]); // Dependency array: Re-
  return (
    <div className={styles.distributionSuccessPageContainer}>
      <div className={styles.distributionSuccessPageContent}>
        <div className={styles.distributionSuccessPageTop}>
          <LottieWithDot
            src={SuccessfullGif}
            style={{ height: "150", width: "150" }}
          />
          <p className={styles.distributionSuccessPageText}>
            Distribution Successfull
          </p>
        </div>
        <Button
          buttonname={"Back to Distribution"}
          variant={"primaryWithExtraPadding"}
          righticon={rightSideIcon}
          />
      </div>
    </div>
  );
};

export default DistriubtionSuccessPage;
