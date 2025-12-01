import { useState, useEffect } from "react";
import AccordiansContainer from "../../application-analytics-containers/accordians-container/AccordiansContainer";
import AnalyticsHeaderContainer from "../analytics-header-container/AnalyticsHeaderContainer";
import ZoneRateContainer from "../zone-rate-container/ZoneRateContainer";
import styles from "./AnalyticsWholeContainer.module.css";
import { useInitialActiveTab } from "../../../hooks/useInitialActiveTab";
import { SelectedEntityProvider } from "../../../contexts/SelectedEntityContext";
import Button from "../../../widgets/Button/Button";
import filterIcon from "../../../assets/application-distribution/filterIcon";

import headerIon from "../../../assets/application-analytics/accordians_header.png";
import MetricCards from "../../../components/application-analytics/metric-cards-component/metric-cards/MetricCards";

import endIcon from "../../../assets/application-analytics/blue_arrow_line.png";
import CostSelectionForGraph from "../../../../src/components/commoncomponents/CostSelectionForGraph";

const AnalyticsWholeContainer = () => {
  // ✅ Get the initial tab based on user permissions
  const initialTab = useInitialActiveTab();
  const [clickedFilterButton, setClickedFilterButton] = useState(false);

  // ✅ Lift active tab state to parent
  const [activeTab, setActiveTab] = useState(initialTab);

  // ✅ Update activeTab when initialTab changes (permissions loaded)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

   const displayFilterOptions = () =>{
    setClickedFilterButton(prev => !prev);
    console.log("Filter Button is Clicked");
  }
 
  const closeFilter = () => {
    setClickedFilterButton(false);
    console.log("Filter closed");
  }
 
  const handleTabChange = (tab) => {
    console.log("Active tab changed to:", tab);
    setActiveTab(tab);
  };

  return (
    <SelectedEntityProvider>
      <div className={styles.analytics_section}>
        <AnalyticsHeaderContainer onTabChange={handleTabChange} activeTab={activeTab} />
        <MetricCards />
        <ZoneRateContainer activeTab={activeTab} />
      </div>

      <div className={styles.prev_years_graphs_section}>
        <div className={styles.accordian_header}>
          <div className={styles.accordian_header_text}>
            <figure>
              <img src={headerIon} className={styles.icon} />
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
                  <CostSelectionForGraph onClose={closeFilter} />
                  )}
              </div>
        </div>
        <AccordiansContainer />
        <div className={styles.prev_year_botton_icon}>
          <figure className={styles.endIcon}>
            <img src={endIcon} />
          </figure>
        </div>
      </div>
    </SelectedEntityProvider>
  );
};

export default AnalyticsWholeContainer;

