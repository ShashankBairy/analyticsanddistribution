// import React, { useMemo } from "react";
// import styles from "../zone-rate-container/ZoneRateContainer.module.css";
// import DropRateZone from "../../../components/application-analytics/rate-zone-components/rated-zone-component/DropRateZone";
// import { usePermission } from "../../../hooks/usePermission ";

// const ZoneRateContainer = () => {
//   // Define all rate data in a single list structure
//   const allRateData = [
//     {
//       type: "zone",
//       permissionKey: "DISTRIBUTE_ZONE",
//       dropRated: {
//         title: "Application Drop Rate Zone Wise",
//         data: [
//           { name: "Zone Name 1", rate: 99 },
//           { name: "Zone Name 2", rate: 80 },
//           { name: "Zone Name 3", rate: 28 },
//           { name: "Zone Name 4", rate: 24 }
//         ]
//       },
//       topRated: {
//         title: "Top Rated Zones",
//         data: [
//           { name: "Zone Name 1", rate: 99 },
//           { name: "Zone Name 2", rate: 80 },
//           { name: "Zone Name 3", rate: 28 },
//           { name: "Zone Name 4", rate: 24 }
//         ]
//       }
//     },
//     {
//       type: "dgm",
//       permissionKey: "DISTRIBUTE_DGM",
//       dropRated: {
//         title: "Application Drop Rate DGM Wise",
//         data: [
//           { name: "DGM Name 1", rate: 89 },
//           { name: "DGM Name 2", rate: 77 },
//           { name: "DGM Name 3", rate: 64 },
//           { name: "DGM Name 4", rate: 58 }
//         ]
//       },
//       topRated: {
//         title: "Top Rated DGMs",
//         data: [
//           { name: "DGM Name 1", rate: 95 },
//           { name: "DGM Name 2", rate: 82 },
//           { name: "DGM Name 3", rate: 70 },
//           { name: "DGM Name 4", rate: 60 }
//         ]
//       }
//     },
//     {
//       type: "campus",
//       permissionKey: "DISTRIBUTE_CAMPUS",
//       dropRated: {
//         title: "Application Drop Rate Campus Wise",
//         data: [
//           { name: "Campus 1", rate: 76 },
//           { name: "Campus 2", rate: 64 },
//           { name: "Campus 3", rate: 50 },
//           { name: "Campus 4", rate: 45 }
//         ]
//       },
//       topRated: {
//         title: "Top Rated Campuses",
//         data: [
//           { name: "Campus 1", rate: 88 },
//           { name: "Campus 2", rate: 75 },
//           { name: "Campus 3", rate: 63 },
//           { name: "Campus 4", rate: 55 }
//         ]
//       }
//     }
//   ];

//   // Fetch permissions for the relevant screens
//   const canViewZone = usePermission("DISTRIBUTE_ZONE").canView;
//   const canViewDGM = usePermission("DISTRIBUTE_DGM").canView;
//   const canViewCampus = usePermission("DISTRIBUTE_CAMPUS").canView;
//   // Filter the data based on permissions
//   const visibleRateData = useMemo(() => {
//     return allRateData.filter((item) => {
//       const key = item.permissionKey;
      
//       if (key === "DISTRIBUTE_ZONE") return canViewZone;
//       if (key === "DISTRIBUTE_DGM") return canViewDGM;
//       if (key === "DISTRIBUTE_CAMPUS") return canViewCampus;
      
//       return false;
//     });
//   }, [canViewZone, canViewDGM, canViewCampus]);

//   // If no data is visible based on permissions, return null
//   if (visibleRateData.length === 0) return null;

//   // Use the first visible data set (highest permission level)
//   const currentData = visibleRateData[0];

//   return (
//     <div className={styles.zones_rates_container}>
//       <div className={styles.drop_rate_zone_wrapper}>
//         <DropRateZone
//           title={currentData.dropRated.title}
//           zoneData={currentData.dropRated.data}
//           progressBarClass={styles.progress_red}
//         />
//       </div>
//       <div className={styles.top_dated_zone_wrapper}>
//         <DropRateZone 
//           title={currentData.topRated.title}  
//           zoneData={currentData.topRated.data} 
//           progressBarClass={styles.progress_green}
//         />
//       </div>
//     </div>
//   );
// };

// export default ZoneRateContainer;





import React, { useMemo, useEffect, useState } from "react";
import styles from "../zone-rate-container/ZoneRateContainer.module.css";
import DropRateZone from "../../../components/application-analytics/rate-zone-components/rated-zone-component/DropRateZone";
import { usePermission } from "../../../hooks/usePermission ";
import axios from "axios";

const ZoneRateContainer = ({ activeTab = "Zone" }) => {
  // ✅ State to hold API data
  const [allRateData, setAllRateData] = useState([]);

  // ✅ Fetch data from backend using axios (replaces static object)
  useEffect(() => {
    const fetchRateData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/performance/top_drop_rate");
        console.log("Top Drop Rate API Response:", response.data);

        let data = [];

        // Handle both possible response formats
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        }

        // ✅ Round percentage values
        const roundedData = data.map((item) => ({
          ...item,
          dropRated: {
            ...item.dropRated,
            data: item.dropRated?.data?.map((d) => ({
              ...d,
              rate: Math.round(Number(d.rate) || 0),
            })) || [],
          },
          topRated: {
            ...item.topRated,
            data: item.topRated?.data?.map((d) => ({
              ...d,
              rate: Math.round(Number(d.rate) || 0),
            })) || [],
          },
        }));

        setAllRateData(roundedData);
      } catch (error) {
        console.error("Error fetching top drop rate data:", error);
        setAllRateData([]);
      }
    };

    fetchRateData();
  }, []);

  // ✅ Authorization logic (unchanged)
  const canViewZone = usePermission("DISTRIBUTE_ZONE").canView;
  const canViewDGM = usePermission("DISTRIBUTE_DGM").canView;
  const canViewCampus = usePermission("DISTRIBUTE_CAMPUS").canView;

  // ✅ Filtering logic based on both activeTab and permissions
  const visibleRateData = useMemo(() => {
    // First filter by permissions
    const permissionFiltered = allRateData.filter((item) => {
      const key = item.permissionKey;

      if (key === "DISTRIBUTE_ZONE") return canViewZone;
      if (key === "DISTRIBUTE_DGM") return canViewDGM;
      if (key === "DISTRIBUTE_CAMPUS") return canViewCampus;

      return false;
    });

    // Then filter by activeTab
    return permissionFiltered.filter((item) => {
      const itemType = (item.type || "").toLowerCase();
      const activeType = (activeTab || "").toLowerCase();
      return itemType === activeType;
    });
  }, [allRateData, canViewZone, canViewDGM, canViewCampus, activeTab]);

  console.log("Active Tab:", activeTab);
  console.log("All Rate Data:", allRateData);
  console.log("Visible Rate Data:", visibleRateData);

  // ✅ Return if nothing to show
  if (visibleRateData.length === 0) return null;

  // ✅ Same selection logic
  const currentData = visibleRateData[0];

  return (
    <div className={styles.zones_rates_container}>
      <div className={styles.drop_rate_zone_wrapper}>
        <DropRateZone
          title={currentData.dropRated?.title || "Application Drop Rate"}
          zoneData={currentData.dropRated?.data || []}
          progressBarClass={styles.progress_red}
        />
      </div>
      <div className={styles.top_dated_zone_wrapper}>
        <DropRateZone
          title={currentData.topRated?.title || "Top Rated"}
          zoneData={currentData.topRated?.data || []}
          progressBarClass={styles.progress_green}
        />
      </div>
    </div>
  );
};

export default ZoneRateContainer;

















































































