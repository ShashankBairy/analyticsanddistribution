import React, { useState, useRef, useEffect } from "react";
import styles from "./Popup.module.css";

// Assuming these paths are correct, but they are not used in the final JSX 
// unless your Button component needs them, which is unlikely based on the provided code.
import popupicon from "../../assets/popupicons/Frame 1410092371.svg"; 
import closeicon from "../../assets/popupicons/iconamoon_close.svg"; 

import Button from "../Button/Button";

// SVG icon definition (remains the same)
const rightSideIcon = (
    <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.36133 9.59636C3.87952 9.59636 3.48894 9.98694 3.48894 10.4688C3.48894 10.9506 3.87952 11.3411 4.36133 11.3411V10.4688V9.59636ZM18.064 11.0856C18.4047 10.7449 18.4047 10.1926 18.064 9.85188L12.5122 4.30002C12.1715 3.95933 11.6191 3.95933 11.2784 4.30002C10.9378 4.64071 10.9378 5.19308 11.2784 5.53377L16.2134 10.4688L11.2784 15.4037C10.9378 15.7444 10.9378 16.2968 11.2784 16.6375C11.6191 16.9782 12.1715 16.9782 12.5122 16.6375L18.064 11.0856ZM4.36133 10.4688V11.3411H17.4472V10.4688V9.59636H4.36133V10.4688Z" fill="white"/>
    </svg>
);

/**
 * Popup component that handles closing via the 'x' icon or an outside click.
 * @param {boolean} isOpen - Controls whether the popup is visible.
 * @param {function} onClose - Function to call to close the popup.
 * @param {function} onConfirm - Function to call when 'Yes' is clicked (optional, added for completeness).
 */
const Popup = ({ isOpen, onClose, onConfirm, name }) => {
    // Ref to detect clicks outside the popup content
    const contentRef = useRef(null);

    // Effect to handle clicking outside the popup content
    useEffect(() => {
        if (!isOpen) return; // Only listen for clicks when the popup is open

        const handleClickOutside = (event) => {
            // Check if the click is outside the content area
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                onClose();
            }
        };

        // Attach listener to the whole document
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup function to remove the listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]); // Re-run effect when isOpen or onClose changes

    // If the popup is not open, return null (render nothing)
    if (!isOpen) {
        return null;
    }

    // Pass the onClose prop to the 'No' button and onConfirm to the 'Yes' button
    return (
        // The container uses the style to cover the full viewport (likely fixed/absolute positioning)
        // Clicks on the container that are *not* handled by handleClickOutside will still bubble up
        // to the document listener.
        <div className={styles.popup_container}> 
            <div className={styles.popup_content} ref={contentRef}>
                {/* 1. CLOSE ICON CLICK HANDLER */}
                <div className={styles.popup_closeicon} onClick={onClose} aria-label="Close popup">
                    <img src={closeicon} alt="Close" />
                </div>
                
                <div className={styles.popup_top}>
                    <figure>
                        <img src={popupicon} alt="Popup Icon" />
                    </figure>
                    <p className={styles.popup_text}>Are you sure to {name}?</p>
                </div>
                
                <div className={styles.popup_buttons}>
                    {/* 2. 'No' BUTTON CLICK HANDLER */}
                    <Button
                        buttonname={"No"}
                        variant={"noButton"}
                        onClick={onClose} 
                    />
                    {/* 3. 'Yes' BUTTON CLICK HANDLER (using onConfirm prop) */}
                    <Button
                        buttonname={"Yes"}
                        variant={"yesButton"}
                        righticon={rightSideIcon}
                        onClick={onConfirm || onClose} // Default to close if no confirm handler is provided
                    />
                </div>
            </div>
        </div>
    );
};

export default Popup;