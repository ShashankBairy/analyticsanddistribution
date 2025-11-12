// import React, { useState } from "react";
// import styles from "./AccordiansContainer.module.css";
// import Accordian from "../../../widgets/accordian-component/Accordian";

// const AccordiansContainer = () => {
//   const [userRole, setUserRole] = useState("CEO");

//   const accordianData = [
//     {
//       title: "Zone wise graph",
//       graphData: [
//         { label: "Issued", percent: 16 },
//         { label: "Sold", percent: -12 },
//       ],
//       graphBarData: [
//         { year: "2018-2019", issued: 60, sold: 30},
//         { year: "2019-2020", issued: 100, sold: 70 },
//         { year: "2021-2022", issued: 90, sold: 30 },
//         { year: "2023-2024", issued: 100, sold: 60 },
//       ],
//     },
//     {
//       title: "DGM wise graph",
//       graphData: [
//         { label: "Issued", percent: 16 },
//         { label: "Sold", percent: -12 },
//       ],
//       graphBarData: [
//         { year: "2018-2019", issued: 60, sold: 50 },
//         { year: "2019-2020", issued: 100, sold: 70 },
//         { year: "2021-2022", issued: 80, sold: 30 },
//         { year: "2023-2024", issued: 100, sold: 60 },
//       ],
//     },
//     {
//       title: "Campus wise graph",
//       graphData: [
//         { label: "Issued", percent: 16 },
//         { label: "Sold", percent: -12 },
//       ],
//       graphBarData: [
//         { year: "2018-2019", issued: 60, sold: 100 },
//         { year: "2019-2020", issued: 100, sold: 70 },
//         { year: "2021-2022", issued: 100, sold: 30 },
//         { year: "2023-2024", issued: 100, sold: 60 },
//       ],
//     },
//   ];

//   const [expandedIndex, setExpandedIndex] = useState(null);

//   const handleChange = (index) => (_event, isExpanded) => {
//     setExpandedIndex(isExpanded ? index : null);
//   };

//   const getVisibleAccordions = (data) => {
//     return data.filter((accordion) => {
//       if (userRole === "CEO") {
//         return (
//           accordion.title.includes("Zone") ||
//           accordion.title.includes("DGM") ||
//           accordion.title.includes("Campus")
//         );
//       } else if (userRole === "Zone") {
//         return (
//           accordion.title.includes("DGM") || accordion.title.includes("Campus")
//         );
//       } else if (userRole === "DGM") {
//         return accordion.title.includes("Campus");
//       } else if (userRole === "Campus") {
//         return false;
//       }
//       return false;
//     });
//   };

//   const visibleAccordions = getVisibleAccordions(accordianData);

//   return (
//     <div id="accordian_wrapper" className={styles.accordian_wrapper}>
//       {visibleAccordions.map((item, index) => (
//         <Accordian
//           key={index}
//           zoneTitle={item.title}
//           percentageItems={item.graphData}
//           graphBarData={item.graphBarData}
//           expanded={expandedIndex === index}
//           onChange={handleChange(index)}
//         />
//       ))}
//     </div>
//   );
// };

// export default AccordiansContainer;






// 1. Define the master data structure
    // const accordianData = [
    //     {
    //         title: "Zone wise graph",
    //         permissionKey: "DISTRIBUTE_ZONE", // 🔑 Map to the permission key
    //         graphData: [
    //             { label: "Issued", percent: 16 },
    //             { label: "Sold", percent: -12 },
    //         ],
    //         graphBarData: [
    //             { year: "2018-2019", issued: 60, sold: 30 },
    //             { year: "2019-2020", issued: 100, sold: 70 },
    //             { year: "2021-2022", issued: 90, sold: 30 },
    //             { year: "2023-2024", issued: 100, sold: 60 },
    //         ],
    //     },
    //     {
    //         title: "DGM wise graph",
    //         permissionKey: "DISTRIBUTE_DGM", // 🔑 Map to the permission key
    //         graphData: [
    //             { label: "Issued", percent: 16 },
    //             { label: "Sold", percent: -12 },
    //         ],
    //         graphBarData: [
    //             { year: "2018-2019", issued: 60, sold: 50 },
    //             { year: "2019-2020", issued: 100, sold: 70 },
    //             { year: "2021-2022", issued: 80, sold: 30 },
    //             { year: "2023-2024", issued: 100, sold: 60 },
    //         ],
    //     },
    //     {
    //         title: "Campus wise graph",
    //         permissionKey: "DISTRIBUTE_CAMPUS", // 🔑 Map to the permission key
    //         graphData: [
    //             { label: "Issued", percent: 16 },
    //             { label: "Sold", percent: -12 },
    //         ],
    //         graphBarData: [
    //             { year: "2018-2019", issued: 60, sold: 100 },
    //             { year: "2019-2020", issued: 100, sold: 70 },
    //             { year: "2021-2022", issued: 100, sold: 30 },
    //             { year: "2023-2024", issued: 100, sold: 60 },
    //         ],
    //     },
    // ];

import React, { useState, useMemo } from "react";
import styles from "./AccordiansContainer.module.css";
import Accordian from "../../../widgets/accordian-component/Accordian";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { usePermission } from "../../../hooks/usePermission ";

const AccordiansContainer = () => {
  const { canView: canViewZone } = usePermission("DISTRIBUTE_ZONE");
  const { canView: canViewDGM } = usePermission("DISTRIBUTE_DGM");
  const { canView: canViewCampus } = usePermission("DISTRIBUTE_CAMPUS");

  const [expandedIndex, setExpandedIndex] = useState(null);

  const fetchGraphs = async () => {
    const response = await axios.get(`http://localhost:8080/api/performance/graph`);
    const data = response.data ?? [];

    return Array.isArray(data)
      ? data.map((item) => {
          const titleLower = (item.title || "").toLowerCase();
          let permissionKey = "DISTRIBUTE_CAMPUS";
          if (titleLower.includes("zone")) permissionKey = "DISTRIBUTE_ZONE";
          else if (titleLower.includes("dgm")) permissionKey = "DISTRIBUTE_DGM";
          else if (titleLower.includes("campus")) permissionKey = "DISTRIBUTE_CAMPUS";
          return { ...item, permissionKey };
        })
      : [];
  };

  const { data: accordianData = [], isLoading, error } = useQuery({
    queryKey: ["graphData"],
    queryFn: fetchGraphs,
  });

  const visibleAccordions = useMemo(() => {
    return accordianData.filter((accordion) => {
      const key = accordion.permissionKey;
      if (key === "DISTRIBUTE_ZONE") return canViewZone;
      if (key === "DISTRIBUTE_DGM") return canViewDGM;
      if (key === "DISTRIBUTE_CAMPUS") return canViewCampus;
      return false;
    });
  }, [accordianData, canViewZone, canViewDGM, canViewCampus]);

  const handleChange = (index) => (_event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };

  return (
    <div id="accordian_wrapper" className={styles.accordian_wrapper}>
      {isLoading && <p>Loading....</p>}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && visibleAccordions.map((item, index) => (
        <Accordian
          key={item.title}
          zoneTitle={item.title}
          percentageItems={item.graphData}
          graphBarData={item.graphBarData} 
          expanded={expandedIndex === index}
          onChange={handleChange(index)}
        />
      ))}
    </div>
  );
};

export default AccordiansContainer;
