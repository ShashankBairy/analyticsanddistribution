import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../widgets/Button/Button";
import uparrow from "../../assets/application-distribution/uparrow";
import CampusTable from "./CampusComponent/CampusTable";
import DgmTable from "./DGMComponent/DgmTable";
import styles from "./DistributeTable.module.css";
import ZoneTable from "./ZoneComponent/ZoneTable";

import FileExport from "../application-status/ApplicationComponent/ExportComponent/FileExport";

const DistributeTable = () => {
  const { pathname } = useLocation(); // Get pathname from useLocation
  const [showExport, setShowExport] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleExportClick = () => {
    setShowExport((prev) => !prev);
  };

  // Determine subtitle text based on path
  const getSubtitleText = () => {
    if (pathname.includes("zone")) {
      return "List of all the distributed application to Zone";
    } else if (pathname.includes("dgm")) {
      return "List of all the distributed application to DGM";
    } else if (pathname.includes("campus")) {
      return "List of all the distributed application to Campus";
    }
    return null; // Fallback
  };

  // Render the appropriate table based on path
  const renderTable = () => {
  if (pathname.includes("zone")) {
    return <ZoneTable onSelectionChange={setSelectedRows} />;
  } else if (pathname.includes("dgm")) {
    return <DgmTable onSelectionChange={setSelectedRows} />;
  } else if (pathname.includes("campus")) {
    return <CampusTable onSelectionChange={setSelectedRows} />;
  }
  return null;
};

  return (
    <>
      <div className={styles.distribute_table_top}>
        <div className={styles.distribute_table_left}>
          <p className={styles.distribute_table_heading}>
            Distributed Applications
          </p>
          <p className={styles.distribute_table_sub}>{getSubtitleText()}</p>
        </div>
        <div className={styles.distribute_table_searchbox}>
          <Button
            buttonname={"Export"}
            variant={"primary"}
            type="button"
            onClick={handleExportClick}
            lefticon={uparrow}
          />
           {showExport && (
          <div style={{ position: "absolute", top: "87.5%", right: "0" }}>
            <FileExport
              data={selectedRows}
              position="right"
              onExport={() => setShowExport(false)}
            />
          </div>
        )}
        </div>
       
      </div>
      {renderTable()}
    </>
  );
};

export default DistributeTable;
