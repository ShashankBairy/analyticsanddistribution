import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import styles from "./ApplicationModuleContainer.module.css";
import AnalyticsWholeContainer from "../application-analytics-containers/analytics-whole-container/AnalyticsWholeContainer";
import ApplicationSearchContainer from "../application-analytics-containers/application-search-container/ApplicationSearchContainer";
import ApplicationNavLinksContainer from "../application-analytics-containers/application-nav-links-container/ApplicationNavLinksContainer";
import DistributeTab from "../../components/application-distribution/DistributeTab";
import ApplicationStatus from "../../components/application-status/ApplicationComponent/ApplicationStatus/ApplicationStatus";
// import ApplicationStatusForm from "../../components/application-status/ApplicationComponent/ApplicationStatus/ApplicationStatus";
import SaleForm from "../../components/application-status/Sale&Conformation/SaleForm/SaleForm";
import Damaged from "../../components/application-status/Damaged/DamagedRefactored";
import { useFirstAccessiblePath } from "../../hooks/useFirstAccessiblePath";

const ApplicationModuleContainer = () => {
  const location = useLocation();
  const isDistribute = location.pathname.includes("/distribute");
  const isStatus = location.pathname.includes("/status");
  const isDamage = location.pathname.includes("/damage");

  const firstAccessiblePath = useFirstAccessiblePath();

  // Handle Loading State while permissions are being fetched/rehydrated
  if (firstAccessiblePath === null) {
    return (
      <div className={styles.main_content}>
        <ApplicationNavLinksContainer /> {/* Shows "Loading..." */}
        <div className={styles.loading_state}>
          Loading Application Content...
        </div>
      </div>
    );
  }

  // Handle No Access State (User has no permissions for the entire application module)
  if (firstAccessiblePath === "no-access") {
    return (
      <div className={styles.no_access_message}>
        You do not have permission to access any part of the Application module.
      </div>
    );
  }

  return (
    <div className={styles.main_content}>
      {/* Hide search when in distribute or status */}
      {!isDistribute && !isStatus && !isDamage && (
        <ApplicationSearchContainer />
      )}

      <ApplicationNavLinksContainer />

      <div
        id="analytics_wrapper"
        className={`${styles.analytics_wrapper} ${
          isDistribute ? styles.column : styles.row
        }`}
      >
        <Routes>
          {/* Default redirect → /analytics */}
          <Route
            index
            element={<Navigate to={firstAccessiblePath} replace />}
          />
          <Route index element={<Navigate to="analytics" replace />} />
          <Route path="analytics" element={<AnalyticsWholeContainer />} />
          <Route path="distribute/*" element={<DistributeTab />} />
          <Route path="status/:applicationNo/:status" element={<SaleForm />} />
          <Route
            path="status"
            element={<ApplicationStatus key={location.pathname} />}
          />
          <Route path="damage" element={<Damaged />} />

          {/* Fallback to the first accessible path if user lands on an unknown/restricted URL */}
          <Route
            path="*"
            element={<Navigate to={firstAccessiblePath} replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default ApplicationModuleContainer;
