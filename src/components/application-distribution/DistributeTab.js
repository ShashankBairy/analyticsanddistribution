import React, { useState, useEffect } from "react";
import styles from "./DistributeTab.module.css";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { usePermission } from "../../hooks/usePermission ";
import applicationnavtabsicon from "../../assets/application-distribution/applicationnavtabsicon";
import ZoneForm from "./ZoneComponent/ZoneForm";
import DgmForm from "./DGMComponent/DgmForm";
import CampusForm from "./CampusComponent/CampusForm";
import DistributeTable from "./DistributeTable";
import Button from "../../widgets/Button/Button";
import plusicon from "../../assets/application-distribution/plusicon";
import AccordiansContainer from "../../containers/application-analytics-containers/accordians-container/AccordiansContainer";
import headerIon from "../../assets/application-analytics/accordians_header.png";
import endicon from "../../assets/application-analytics/blue_arrow_line.png";
import filterIcon from "../../assets/application-distribution/filterIcon";
import CostSelectionForGraph from "./../commoncomponents/CostSelectionForGraph";

import { SelectedEntityProvider } from "../../contexts/SelectedEntityContext";
 

const DistributeTab = () => {
  const [isInsertClicked, setIsInsertClicked] = useState(false);
  const location = useLocation();

  const [clickedFilterButton, setClickedFilterButton] = useState(false);

  // 🔑 Use the literal string keys for permission checks, matching the keys in your SCREENS object
  const canViewZone = usePermission("DISTRIBUTE_ZONE").canView;
  const canViewDGM = usePermission("DISTRIBUTE_DGM").canView;
  const canViewCampus = usePermission("DISTRIBUTE_CAMPUS").canView;

  // You can also check for full access to enable the 'Distribute New' button
  const canCreateZone = usePermission("DISTRIBUTE_ZONE").isFullAccess;
  const canCreateDGM = usePermission("DISTRIBUTE_DGM").isFullAccess;
  const canCreateCampus = usePermission("DISTRIBUTE_CAMPUS").isFullAccess;

  // Combine all "can create" flags into a single check for the button
  const canInsert = canCreateZone || canCreateDGM || canCreateCampus;

  useEffect(() => {
    // Reset the form state if the URL changes (user navigates between sub-tabs)
    setIsInsertClicked(false);
  }, [location.pathname]);

  // 🔑 Define and Filter the navigation tabs based on user permissions
  const distributeNavTabs = [
    {
      label: "Zone",
      path: "/scopes/application/distribute/zone",
      canView: canViewZone,
      key: "zone",
    },
    {
      label: "DGM",
      path: "/scopes/application/distribute/dgm",
      canView: canViewDGM,
      key: "dgm",
    },
    {
      label: "Branch",
      path: "/scopes/application/distribute/campus",
      canView: canViewCampus,
      key: "campus",
    },
  ].filter((tab) => tab.canView); // Filter only tabs the user can view

  // Determine the default route (the key of the first visible tab)
  const firstVisibleKey = distributeNavTabs[0]?.key || null;

  const buttonName = () => {
    // Determine the button name based on the current active sub-route or the first available
    const currentPath = location.pathname;

    if (currentPath.includes("/distribute/zone"))return "Distribute New to Zone";
    if (currentPath.includes("/distribute/dgm")) return "Distribute New to DGM";
    if (currentPath.includes("/distribute/campus"))
      return "Distribute New to Campus";

    // Fallback: Use the first visible path for the button name if no specific sub-tab is active
    if (firstVisibleKey === "dgm") return "Distribute New to DGM";
    if (firstVisibleKey === "campus") return "Distribute New to Campus";

    return "Distribute New to Zone"; // Default (if Zone is available or as a generic fallback)
  };

  const handleDistributeButton = () => {
    setIsInsertClicked((prev) => !prev);
  };

  // 🚫 If no tabs are visible, render a "No Access" message for this section.
  if (distributeNavTabs.length === 0) {
    return (
      <div className={styles.distribute_tab_form_graph}>
        <div className={styles.no_access_message}>
          You do not have permission to view any distribution screens.
        </div>
      </div>
    );
  }

  const displayFilterOptions = () =>{
    setClickedFilterButton(prev => !prev);
    console.log("Filter Button is Clicked");
  }

  return (
    <>
      {isInsertClicked && canInsert && (
        <div className={styles.distribute_button}>
          <Button
            buttonname={buttonName()}
            type={"button"}
            lefticon={plusicon}
            onClick={handleDistributeButton}
            margin={"0"}
            variant="primary"
          />
        </div>
      )}

      {/* Renders the content when not in the insert form */}
      {!isInsertClicked && (
        <div className={styles.distribute_tab_form_graph}>
          <div className={styles.distribute_tab_form}>
            <div className={styles.distribute_tab_top}>
              <div className={styles.distribute_tab_top_left}>
                {applicationnavtabsicon}
                <div className={styles.distribute_content_heading}>
                  <p className={styles.heading}>Distribute Applications</p>
                  <p className={styles.sub}>
                    Distribute Applications to all Zones, DGM, and Campuses
                  </p>
                </div>
              </div>

              {/* 🔑 NavLinks: Map over the filtered array */}
              <nav className={styles.nav}>
                <ul className={styles.nav_bar}>
                  {distributeNavTabs.map((tab) => (
                    <li key={tab.path} className={styles.nav_list}>
                      <NavLink
                        to={tab.path}
                        className={({ isActive }) =>
                          `${styles.nav_link} ${isActive ? styles.active : ""}`
                        }
                      >
                        {tab.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* 🔑 Route definitions: Conditionally render routes and handle redirects */}
            <div className={styles.distribute_nav_content}>
              <Routes>
                {/* Default route: Navigate to the first available sub-tab */}
                {firstVisibleKey && (
                  <Route
                    index
                    element={<Navigate to={firstVisibleKey} replace />}
                  />
                )}

                {/* Conditionally render the allowed routes */}
                {canViewZone && (
                  <Route
                    path="zone"
                    element={
                      <ZoneForm setIsInsertClicked={setIsInsertClicked} />
                    }
                  />
                )}
                {canViewDGM && (
                  <Route
                    path="dgm"
                    element={
                      <DgmForm setIsInsertClicked={setIsInsertClicked} />
                    }
                  />
                )}
                {canViewCampus && (
                  <Route
                    path="campus"
                    element={
                      <CampusForm setIsInsertClicked={setIsInsertClicked} />
                    }
                  />
                )}

                {/* Fallback for unauthorized/missing route within distribute */}
                <Route
                  path="*"
                  element={<Navigate to={firstVisibleKey || "zone"} replace />}
                />
              </Routes>
            </div>
          </div>
          <SelectedEntityProvider>
                      <div className={styles.prev_years_graphs_section}>
            <div className={styles.accordian_header}>
              <div className={styles.accordian_header_text}>
                <figure>
                <img src={headerIon} className={styles.icon} alt="header" />
              </figure>
              <h6 className={styles.header_text}>Previous Year Graph</h6>
              </div>
              <div className={styles.graphFilterButton}>
                <Button
                buttonname={"Filter"}
                variant={"filterButton"}
                lefticon={filterIcon}
                onClick={displayFilterOptions}
                />
                {clickedFilterButton && (
                  <CostSelectionForGraph onClose={() => setClickedFilterButton(false)}/>
                  )}
              </div>
            </div>
         
            <AccordiansContainer />
      
            <div className={styles.prev_year_botton_icon}>
              <figure className={styles.endIcon}>
                <img src={endicon} />
              </figure>
            </div>
          </div>
          </SelectedEntityProvider>

        </div>
      )}

      {/* You might also want to secure the table component */}
      <div className={styles.distribute_tab_table}>
        <DistributeTable />
      </div>
    </>
  );
};

export default DistributeTab;
