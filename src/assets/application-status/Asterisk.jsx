import React from "react";

const Asterisk = ({ className = "", style = {} }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="red">
    <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="20" font-family="Arial, sans-serif">*</text>
  </svg>
  );
};

export default Asterisk;
