import React from "react";
import styles from "./PercentBox.module.css"


const getArrowPath = (percent) => {
  if (percent > 0) return "M5 2 L2.5 5.5 M5 2 L7.5 5.5 M5 2 V9"; // up
  if (percent < 0) return "M5 9 L2.5 5.5 M5 9 L7.5 5.5 M5 2 V9"; // down
  return "M2 5.5 L8 5.5"; // flat
};

const PercentBox = ({ items = [] }) => (
  <div style={{ display: "flex", gap: 12 ,marginTop:"3px"}}>
    {items.map((item, index) => {
      const percentValue = Number(item?.percent || 0);
      const sign = percentValue > 0 ? "+" : percentValue < 0 ? "-" : "";
      const absValue = Math.abs(percentValue);

     
      const isIssued = item.label?.toLowerCase() === "issued";
      const borderColor = isIssued ? "#EF4444" : "#22C55E";
      const bgColor = isIssued ? "#fff3f0" : "#eefaf1";

      
      const arrowColor =
        percentValue > 0 ? "#22c55e" : percentValue < 0 ? "#ef4444" : "#64748B";

      return (
        <span
          key={index}
          style={{
            padding: "4px 8px",
            borderRadius: 20,
            letterrSpacing:"0.2px",
            fontSize: 12,
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: `1px solid ${borderColor}`,
            background: bgColor,
            color: borderColor,
            fontFamily:"Plus Jakarta Sans",
          }}
        >
          {`${sign}${absValue}%`}
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 11">
            <path
              d={getArrowPath(percentValue)}
              stroke={arrowColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    })}
  </div>
);

export default PercentBox;
