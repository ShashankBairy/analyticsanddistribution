import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BarGraph from "../graph-widget/BarGraph";
import styles from "./Accordian.module.css";
import graphTitleIcon from "../../assets/application-analytics/paper.svg";
import PercentBox from "./PercentBox";
import redDot from "../../assets/application-analytics/red_dot.png";
import greenDot from "../../assets/application-analytics/green_dot.png";

import reddot2 from "../../assets/application-analytics/red2.svg";
import greendot2 from "../../assets/application-analytics/green2.svg";

import greenimage from "../../assets/application-analytics/greenimage.png"
import redimage from "../../assets/application-analytics/redimage.png";

// Controlled by parent: receives `expanded` and `onChange`
const Accordian = ({ zoneTitle, percentageItems, graphBarData, expanded, onChange }) => {
  return (
    <Accordion
      expanded={!!expanded}
      onChange={(e, isExpanded) => onChange?.(e, isExpanded)}
      sx={{
        "& .MuiAccordionDetails-root ": { padding: "8px 16px 0px" },
        "&&": {
          "--Paper-shadow": "none",
          boxShadow: "none",
          borderRadius: "10px",
          border: "1px solid #E6E4F0",
          background: "rgba(255, 255, 255, 0.40)",
          backdropFilter: "blur(9.100000381469727px)",
        },
        "&::before": { display: "none" },
        "& .MuiButtonBase-root": {
          alignItems: "start",
          padding: "12px 18px",
        },
        "&.Mui-expanded": {
          borderRadius: "10px",
          border: "1px solid #B4BCFF",
          background: "rgba(255, 255, 255, 0.30)",
          boxShadow:
            "0 8px 16px 0 rgba(0, 0, 0, 0.14), 0 0 2px 0 rgba(0, 0, 0, 0.12)",
          backdropFilter: "blur(9.100000381469727px)",
          margin: "0px",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          "& .MuiAccordionSummary-content": { margin: "0px !important" },
          "&.Mui-expanded .MuiAccordionSummary-content": { margin: "0px !important" },
        }}
      >
        <Typography component="span">
          <div className={styles.title_header}>
            <figure>
              <img src={graphTitleIcon} alt="Title Icon" />
            </figure>
            <div className={styles.header_right}>
              <p className={styles.header_title}>{zoneTitle}</p>
            </div>
          </div>

          {/* ✅ Round percentage values before sending to PercentBox */}
          {!expanded && (
            <PercentBox
              items={percentageItems.map((item) => ({
                ...item,
                percent: Math.round(Number(item.percent) || 0),
              }))}
            />
          )}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Typography component="div">
          <BarGraph graphBarData={graphBarData} />

          <div className={styles.dots_container}>
            <div className={styles.dot_part}>
              <img src={reddot2} className={styles.red_dot} alt="Issued" />
              <p>Issued</p>
            </div>
            <div className={styles.dot_part}>
              <img src={greendot2} className={styles.green_dot} alt="Sold" />
              <p>Sold</p>
            </div>
          </div>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default Accordian;
