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

import React, { useState, useMemo, useEffect } from "react";
import styles from "./AccordiansContainer.module.css";
import Accordian from "../../../widgets/accordian-component/Accordian";
import { usePermission } from "../../../hooks/usePermission ";
import {
  useGetGraphDataForAdmin,
  useGetGraphDataForEmployee,
  useGetAnalyticsForZone,
  useGetAnalyticsForCampus,
  useGetFlexibleGraph,
} from "../../../queries/application-analytics/analytics";
import { useSelectedEntity } from "../../../contexts/SelectedEntityContext";

const AccordiansContainer = () => {
  const { canView: canViewZone } = usePermission("DISTRIBUTE_ZONE");
  const { canView: canViewDGM } = usePermission("DISTRIBUTE_DGM");
  const { canView: canViewCampus } = usePermission("DISTRIBUTE_CAMPUS");
 
  const { selectedEntity, selectedAmount } = useSelectedEntity();
 
  console.log("=== ACCORDIANS CONTAINER DEBUG ===");
  console.log("Selected Entity in Accordians:", selectedEntity);
  console.log("Selected Amount:", selectedAmount);

  const [userCategory, setUserCategory] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // ✅ Load category & empId from localStorage
  useEffect(() => {
    const storedCategory = localStorage.getItem("category");
    const storedEmpId = localStorage.getItem("empId");
    if (storedCategory) setUserCategory(storedCategory.toUpperCase());
    if (storedEmpId) setEmpId(storedEmpId);
  }, []);

  // ✅ Identify user type (Admin vs others)
  const isZonalAccountant =
    userCategory === "SCHOOL" || userCategory === "COLLEGE";
  const isAdmin = !!userCategory && !isZonalAccountant;

  // ✅ Conditionally fetch graph data based on role
  const adminGraphQuery = useGetGraphDataForAdmin(empId, {
    enabled: !!empId && !!userCategory && isAdmin,
  });

  const employeeGraphQuery = useGetGraphDataForEmployee(empId, {
    enabled: !!empId && !!userCategory && !isAdmin,
  });
 
  // ✅ Fetch analytics for selected zone/dgm/campus using flexible-graph endpoint
  // This endpoint supports zoneId, campusId, and amount parameters (all optional)
  const zoneId = selectedEntity.type === "zone" ? selectedEntity.id : null;
  const campusId = selectedEntity.type === "campus" ? selectedEntity.id : null;
  const amount = selectedAmount ? Number(selectedAmount) : null;
 
  console.log("🔍 ACCORDIANS: Selected Entity Details:", {
    selectedEntity,
    zoneId,
    campusId,
    amount,
    zoneIdType: typeof zoneId,
    campusIdType: typeof campusId
  });
 
  // Enable query when entity OR amount OR both are selected
  const hasEntity = !!selectedEntity.id;
  const hasAmount = !!selectedAmount;
  const shouldFetch = hasEntity || hasAmount;
 
  const flexibleGraphQuery = useGetFlexibleGraph(zoneId, campusId, amount, {
    enabled: shouldFetch, // Enable when entity OR amount is selected
  });
 
  // Keep old queries for backward compatibility (if needed)
  const selectedZoneQuery = useGetAnalyticsForZone(selectedEntity.id, {
    enabled: false, // Disabled - using flexible-graph instead
  });
 
  const selectedCampusQuery = useGetAnalyticsForCampus(selectedEntity.id, {
    enabled: false, // Disabled - using flexible-graph instead
  });
 
  console.log("=== QUERY STATUS ===");
  console.log("Zone query enabled:", !!selectedEntity.id && selectedEntity.type === "zone");
  console.log("Campus query enabled:", !!selectedEntity.id && selectedEntity.type === "campus");
  console.log("Zone query status:", {
    isLoading: selectedZoneQuery.isLoading,
    isFetching: selectedZoneQuery.isFetching,
    data: selectedZoneQuery.data,
    error: selectedZoneQuery.error
  });
  console.log("Campus query status:", {
    isLoading: selectedCampusQuery.isLoading,
    isFetching: selectedCampusQuery.isFetching,
    data: selectedCampusQuery.data,
    error: selectedCampusQuery.error
  });

  // ✅ Choose which data to use
  const { data: graphResponse, isLoading, error } = isAdmin
    ? adminGraphQuery
    : employeeGraphQuery;

  console.log("=== GRAPH DEBUG ===");
  console.log("User Category:", userCategory);
  console.log("Is Admin:", isAdmin);
  console.log("Employee ID:", empId);
  console.log("Full Graph Response:", graphResponse);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

  // ✅ Extract graphData from response
  const rawGraphData = useMemo(() => {
    if (!graphResponse) {
      console.log("📈 No graphResponse available");
      return null;
    }
   
    console.log("📈 Full graphResponse:", graphResponse);
   
    // Admin response from cards_graph: { metricCards: [...], graphData: {...} }
    // Employee response: { metricsData: {...}, graphData: {...} }
    const extractedData = graphResponse.graphData || null;
    console.log("📈 Extracted graphData:", extractedData);
    console.log("📈 graphData type:", typeof extractedData);
    console.log("📈 graphData keys:", extractedData ? Object.keys(extractedData) : "null");
   
    return extractedData;
  }, [graphResponse]);

  console.log("Raw Graph Data:", rawGraphData);

  // ✅ Extract role from response for non-admin users
  const userRole = useMemo(() => {
    if (isAdmin) return "Admin";
    return graphResponse?.role || "User";
  }, [graphResponse, isAdmin]);

  console.log("User Role from API:", userRole);

  // ✅ Default graph data with zeros (for when API returns no data)
  const defaultGraphData = {
    graphBarData: [
      { year: "2022-23", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2023-24", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2024-25", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
      { year: "2025-26", issued: 0, sold: 0, issuedCount: 0, soldCount: 0 },
    ],
  };

  // ✅ Transform graph data to accordion format
  const accordianData = useMemo(() => {
    // If no graph data, use default with zeros
    if (!rawGraphData) {
      console.log("No graph data available - using default zeros");
      const defaultBarData = defaultGraphData.graphBarData;
      return [{
        title: "Previous Year Graph",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
          { label: "Sold", percent: 0 },
        ],
        graphBarData: defaultBarData,
      }];
    }

    // Handle different API structures
    // Admin API: graphData.graphBarData
    // Employee API: graphData.yearlyData
    const barData = rawGraphData.graphBarData || rawGraphData.yearlyData;
   
    // If barData is empty, use default with zeros
    if (!barData || barData.length === 0) {
      console.log("No bar data available - using default zeros");
      const defaultBarData = defaultGraphData.graphBarData;
      return [{
        title: "Previous Year Graph",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: 0 },
          { label: "Sold", percent: 0 },
        ],
        graphBarData: defaultBarData,
      }];
    }

    console.log("Bar Data from API:", barData);
   
    // Get the latest year's percentages for the badges
    const latestYear = barData[barData.length - 1];
   
    // Handle both API response formats
    let issuedPercent, soldPercent;
   
    if (isAdmin) {
      // Admin API structure
      issuedPercent = latestYear?.issuedPercent || 0;
      soldPercent = latestYear?.soldPercent || 0;
    } else {
      // Employee API structure (yearlyData)
      issuedPercent = latestYear?.totalAppPercent || 0;
      soldPercent = latestYear?.soldPercent || 0;
    }
   
    // Transform bar data to accordion format
    const transformedBarData = barData.map((item) => {
      if (isAdmin) {
        // Admin API structure
        return {
          year: item.year,
          issued: item.issuedPercent || 0,      // Bar height percentage
          sold: item.soldPercent || 0,          // Bar height percentage
          issuedCount: item.issuedCount || 0,   // Tooltip count
          soldCount: item.soldCount || 0,       // Tooltip count
        };
      } else {
        // Employee API structure (yearlyData)
        return {
          year: item.year,
          issued: item.totalAppPercent || 0,    // Bar height percentage
          sold: item.soldPercent || 0,          // Bar height percentage
          issuedCount: item.totalAppCount || 0, // Tooltip count
          soldCount: item.soldCount || 0,       // Tooltip count
        };
      }
    });

    console.log("Transformed Bar Data:", transformedBarData);
    console.log("Latest Total App %:", issuedPercent);
    console.log("Latest Sold %:", soldPercent);
   
    // Show only ONE accordion based on highest permission
    const accordions = [];
   
    // Determine accordion title based on role
    let accordionTitle;
    if (isAdmin) {
      accordionTitle = "Admin wise graph";
    } else {
      // For non-admin, use role from API response
      accordionTitle = `${userRole} wise graph`;
    }
   
    console.log("Accordion Title:", accordionTitle);
   
    // Determine which accordion to show based on permissions
    if (canViewZone) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_ZONE",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent },
          { label: "Sold", percent: soldPercent },
        ],
        graphBarData: transformedBarData,
      });
    } else if (canViewDGM) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_DGM",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent },
          { label: "Sold", percent: soldPercent },
        ],
        graphBarData: transformedBarData,
      });
    } else if (canViewCampus) {
      accordions.push({
        title: accordionTitle,
        permissionKey: "DISTRIBUTE_CAMPUS",
        graphData: [
          { label: isAdmin ? "Issued" : "Total Applications", percent: issuedPercent },
          { label: "Sold", percent: soldPercent },
        ],
        graphBarData: transformedBarData,
      });
    }
   
    return accordions;
  }, [rawGraphData, canViewZone, canViewDGM, canViewCampus, isAdmin, userRole]);

  // ✅ Create accordion for selected zone/dgm/campus using flexible-graph endpoint
  // This accordion shows data based on entity selection, amount selection, or both
  const selectedEntityAccordion = useMemo(() => {
    console.log("=== BUILDING SELECTED ENTITY ACCORDION ===");
    console.log("Selected Entity:", selectedEntity);
    console.log("Selected Amount:", selectedAmount);
   
    // Show accordion if entity OR amount is selected
    const hasEntity = selectedEntity.id && selectedEntity.name;
    const hasAmount = !!selectedAmount;
   
    if (!hasEntity && !hasAmount) {
      console.log("No entity or amount selected");
      return null;
    }

    // Use flexible-graph data
    const flexibleData = flexibleGraphQuery.data;

    console.log("Selected entity type:", selectedEntity.type);
    console.log("Flexible graph data:", flexibleData);

    // Show loading state
    if (flexibleGraphQuery.isLoading || flexibleGraphQuery.isFetching) {
      return {
        title: hasEntity ? `${selectedEntity.name} wise graph` : `Amount ${selectedAmount} wise graph`,
        graphBarData: [],
        graphData: []
      };
    }

    // Show error state
    if (flexibleGraphQuery.isError) {
      console.error("Flexible Graph API Error:", flexibleGraphQuery.error);
      return {
        title: hasEntity ? `${selectedEntity.name} wise graph` : `Amount ${selectedAmount} wise graph`,
        graphBarData: [],
        graphData: []
      };
    }

    if (!flexibleData || !Array.isArray(flexibleData) || flexibleData.length === 0) {
      console.log("No flexible graph data available");
      return null;
    }

    console.log("=== SELECTED ENTITY DEBUG ===");
    console.log("Selected Entity:", selectedEntity);
    console.log("Flexible Graph Data:", flexibleData);

    // Flexible-graph returns array directly: [{ year, issuedPercent, soldPercent, issuedCount, soldCount }, ...]
    const barData = flexibleData;

    if (!barData || barData.length === 0) {
      console.log("No bar data for selected entity");
      return null;
    }

    // Get the latest year's percentages
    const latestYear = barData[barData.length - 1];
    const issuedPercent = latestYear?.issuedPercent || 0;
    const soldPercent = latestYear?.soldPercent || 0;

    // Transform bar data to match expected format
    const transformedBarData = barData.map((item) => ({
      year: item.year,
      issued: item.issuedPercent || 0,
      sold: item.soldPercent || 0,
      issuedCount: item.issuedCount || 0,
      soldCount: item.soldCount || 0,
    }));

    // Build title based on what's selected
    let title = "";
    if (hasEntity && hasAmount) {
      title = `${selectedEntity.name} (Amount: ${selectedAmount}) wise graph`;
    } else if (hasEntity) {
      title = `${selectedEntity.name} wise graph`;
    } else if (hasAmount) {
      title = `Amount ${selectedAmount} wise graph`;
    }

    console.log("✅ Creating accordion with title:", title);

    // Use the same label logic as default accordion
    const issuedLabel = isAdmin ? "Issued" : "Total Applications";

    return {
      title: title,
      graphData: [
        { label: issuedLabel, percent: issuedPercent },
        { label: "Sold", percent: soldPercent },
      ],
      graphBarData: transformedBarData,
    };
  }, [selectedEntity, selectedAmount, flexibleGraphQuery.data, flexibleGraphQuery.isLoading, flexibleGraphQuery.isFetching, flexibleGraphQuery.isError, isAdmin]);

  const visibleAccordions = useMemo(() => {
    // Start with default accordion(s)
    const allAccordions = [...accordianData];
   
    console.log("=== VISIBLE ACCORDIONS DEBUG ===");
    console.log("Default accordions:", accordianData);
    console.log("Selected entity accordion:", selectedEntityAccordion);
   
    // Add selected entity accordion if available
    if (selectedEntityAccordion) {
      allAccordions.push(selectedEntityAccordion);
      console.log("✅ Added selected entity accordion");
    }
   
    console.log("Final visible accordions:", allAccordions);
    return allAccordions;
  }, [accordianData, selectedEntityAccordion]);

  const handleChange = (index) => (_event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };

  // 🧠 Prevent rendering until category & empId are ready
  if (!userCategory || !empId) {
    console.log("Waiting for user data...", { userCategory, empId });
    return <p>Loading user data...</p>;
  }

  // Check loading state for both default graph and flexible graph (if entity selected)
  const isFlexibleGraphLoading = selectedEntity.id ? flexibleGraphQuery.isLoading : false;
  const isFlexibleGraphError = selectedEntity.id ? flexibleGraphQuery.error : null;

  if (isLoading || isFlexibleGraphLoading) {
    console.log("Loading graph data...");
    return <p>Loading graphs...</p>;
  }
 
  if (error || isFlexibleGraphError) {
    console.error("Graph API Error:", error || isFlexibleGraphError);
    return <p>Error loading graphs: {(error || isFlexibleGraphError)?.message}</p>;
  }

  // Only check graphResponse if no entity is selected (default graph)
  if (!selectedEntity.id && !graphResponse) {
    console.log("No graph response received");
    return <p>No graph data received from server</p>;
  }

  return (
    <div id="accordian_wrapper" className={styles.accordian_wrapper}>
      {visibleAccordions.length === 0 && (
        <p>No graph data available for your role</p>
      )}
      {visibleAccordions.map((item, index) => (
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