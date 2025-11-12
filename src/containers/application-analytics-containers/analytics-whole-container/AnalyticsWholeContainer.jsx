import { useState, useEffect } from "react";
import AccordiansContainer from "../../application-analytics-containers/accordians-container/AccordiansContainer";
import AnalyticsHeaderContainer from "../analytics-header-container/AnalyticsHeaderContainer";
import ZoneRateContainer from "../zone-rate-container/ZoneRateContainer";
import styles from "./AnalyticsWholeContainer.module.css";
import { useInitialActiveTab } from "../../../hooks/useInitialActiveTab";

import headerIon from "../../../assets/application-analytics/accordians_header.png";
import MetricCards from "../../../components/application-analytics/metric-cards-component/metric-cards/MetricCards";

import endIcon from "../../../assets/application-analytics/blue_arrow_line.png";

const AnalyticsWholeContainer = () => {
  // ✅ Get the initial tab based on user permissions
  const initialTab = useInitialActiveTab();
  
  // ✅ Lift active tab state to parent
  const [activeTab, setActiveTab] = useState(initialTab);

  // ✅ Update activeTab when initialTab changes (permissions loaded)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab) => {
    console.log("Active tab changed to:", tab);
    setActiveTab(tab);
  };

  return (
    <>
      <div className={styles.analytics_section}>
        <AnalyticsHeaderContainer onTabChange={handleTabChange} activeTab={activeTab} />
        <MetricCards />
        <ZoneRateContainer activeTab={activeTab} />
      </div>

      <div className={styles.prev_years_graphs_section}>
        <div className={styles.accordian_header_text}>
          <figure>
            <img src={headerIon} className={styles.icon} />
          </figure>
          <h6 className={styles.header_text}>Previous Year Graph</h6>
        </div>
        <AccordiansContainer />

        <div className={styles.prev_year_botton_icon}>
          <figure className={styles.endIcon}>
          <img src={endIcon}/>
        </figure>
        </div>
      </div>
    </>
  );
};

export default AnalyticsWholeContainer;
