import React from "react";
import styles from "./Statusbar.module.css";
 
const Statusbar = ({ isSold, isConfirmed, isDamaged, showLabels = true, reducedGap = false, labelWidth = "100%", singleStar = false, reverseOrder = false }) => {
  const blue = "#3425FF";
  const red = "#FF2525";

  // If damaged, show special damaged status bar
  if (isDamaged) {
    // Single star layout for search cards
    if (singleStar) {
      return (
        <div className={styles.status_container}>
          <div className={`${styles.status_bar} ${reducedGap ? styles.status_bar_reduced : ''}`}>
            <div className={styles.status_icon}>
              <Star color={red}><Cross /></Star>
            </div>
          </div>
          {showLabels && (
            <div
              className={`${styles.status_labels} ${reducedGap ? styles.status_labels_reduced : ''}`}
              style={{ width: labelWidth }}
            >
              <div className={styles.label_container}>
                <span className={styles.label_damaged}>
                  Damaged
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Two star layout for success page
    if (reverseOrder) {
      // Reverse order: Red star (Damaged) first, Blue star (With PRO) second
      return (
        <div className={styles.status_container}>
          <div className={`${styles.status_bar} ${reducedGap ? styles.status_bar_reduced : ''}`}>
            <div className={styles.status_icon}>
              <Star color={red}><Cross /></Star>
            </div>
            <div className={`${styles.status_line} ${reducedGap ? styles.status_line_reduced : ''}`}>
              <Line color={red} reducedGap={reducedGap} />
            </div>
            <div className={styles.status_icon}>
              <Star color={blue}><Tick /></Star>
            </div>
          </div>
          {showLabels && (
            <div
              className={`${styles.status_labels} ${reducedGap ? styles.status_labels_reduced : ''}`}
              style={{ width: labelWidth }}
            >
              <div className={styles.label_container}>
                <span className={styles.label_damaged}>
                  Damaged
                </span>
              </div>
              <div className={styles.label_container}>
                <span className={styles.label_withpro}>
                  With PRO
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Default order: Blue star (With PRO) first, Red star (Damaged) second
    return (
      <div className={styles.status_container}>
        <div className={`${styles.status_bar} ${reducedGap ? styles.status_bar_reduced : ''}`}>
          <div className={styles.status_icon}>
            <Star color={blue}><Tick /></Star>
          </div>
          <div className={`${styles.status_line} ${reducedGap ? styles.status_line_reduced : ''}`}>
            <Line color={blue} reducedGap={reducedGap} />
          </div>
          <div className={styles.status_icon}>
            <Star color={red}><Cross /></Star>
          </div>
        </div>
        {showLabels && (
          <div
            className={`${styles.status_labels} ${reducedGap ? styles.status_labels_reduced : ''}`}
            style={{ width: labelWidth }}
          >
            <div className={styles.label_container}>
              <span className={styles.label_withpro}>
                With PRO
              </span>
            </div>
            <div className={styles.label_container}>
              <span className={styles.label_damaged}>
                Damaged
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
 
  // If confirmed => sold is automatically true
  const finalSold = isConfirmed ? true : isSold;
 
  const soldColor = finalSold ? blue : red;
  const confirmedColor = isConfirmed ? blue : red;
 
  return (
    <div className={styles.status_container}>
      <div className={`${styles.status_bar} ${reducedGap ? styles.status_bar_reduced : ''}`}>
        <div className={styles.status_icon}>
          <Star color={soldColor}>{finalSold ? <Tick /> : <Cross />}</Star>
        </div>
        <div className={`${styles.status_line} ${reducedGap ? styles.status_line_reduced : ''}`}>
          <Line color={soldColor} reducedGap={reducedGap} />
        </div>
        <div className={styles.status_icon}>
          <Star color={confirmedColor}>{isConfirmed ? <Tick /> : <Cross />}</Star>
        </div>
      </div>
      {showLabels && (
        <div
          className={`${styles.status_labels} ${reducedGap ? styles.status_labels_reduced : ''}`}
          style={{ width: labelWidth }}
        >
          <div className={styles.label_container}>
            <span
              className={`${styles.label_sale} ${
                isSold ? styles.sold : ""
              } ${isConfirmed ? styles.confirmed : ""}`}
            >
              Sale
            </span>
          </div>
          <div className={styles.label_container}>
            <span
              className={`${styles.label_confirm} ${
                isConfirmed ? styles.confirmed : ""
              }`}
            >
              Confirm
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
 
// ---- SVG Components ----
const Star = ({ color, children }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.88281 0.998047C9.47901 0.332287 10.521 0.332287 11.1172 0.998047L12.1016 2.09668C12.608 2.66239 13.3444 2.96769 14.1025 2.92578L15.5752 2.84473C16.4677 2.79543 17.2046 3.53233 17.1553 4.4248L17.0742 5.89746C17.0323 6.65558 17.3376 7.392 17.9033 7.89844L19.002 8.88281C19.6677 9.47901 19.6677 10.521 19.002 11.1172L17.9033 12.1016C17.3376 12.608 17.0323 13.3444 17.0742 14.1025L17.1553 15.5752C17.2046 16.4677 16.4677 17.2046 15.5752 17.1553L14.1025 17.0742C13.3444 17.0323 12.608 17.3376 12.1016 17.9033L11.1172 19.002C10.521 19.6677 9.47901 19.6677 8.88281 19.002L7.89844 17.9033C7.392 17.3376 6.65558 17.0323 5.89746 17.0742L4.4248 17.1553C3.53233 17.2046 2.79543 16.4677 2.84473 15.5752L2.92578 14.1025C2.96769 13.3444 2.66239 12.608 2.09668 12.1016L0.998047 11.1172C0.332287 10.521 0.332287 9.47901 0.998047 8.88281L2.09668 7.89844C2.66239 7.392 2.96769 6.65559 2.92578 5.89746L2.84473 4.4248C2.79543 3.53233 3.53233 2.79543 4.4248 2.84473L5.89746 2.92578C6.65558 2.96769 7.392 2.66239 7.89844 2.09668L8.88281 0.998047Z"
      fill={color}
      stroke={color}
    />
    <g transform="translate(6,6)">{children}</g>
  </svg>
);
 
const Line = ({ color }) => (
  <svg width="63" height="20" viewBox="0 0 63 20" fill="none">
    <line x1="0" y1="10" x2="63" y2="10" stroke={color} strokeWidth="2" />
  </svg>
);
 
const Tick = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path
      d="M1 4L3 6L7 2"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
 
const Cross = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <line x1="2" y1="2" x2="6" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6" y1="2" x2="2" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
 
export default Statusbar;