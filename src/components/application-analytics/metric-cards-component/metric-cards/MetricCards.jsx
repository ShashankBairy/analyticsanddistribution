import React, { useEffect, useState } from "react";
import styles from "../metric-cards/MetricCards.module.css";
import {
  useGetMetricsForAdmin,
  useGetMetricsForEmployee,
  useGetAnalyticsForZone,
  useGetAnalyticsForCampus,
} from "../../../../queries/application-analytics/analytics";
import { useSelectedEntity } from "../../../../contexts/SelectedEntityContext";

const MetricCards = () => {
  const [userCategory, setUserCategory] = useState(null);
  const [empId, setEmpId] = useState(null);
 
  const { selectedEntity } = useSelectedEntity();
 
  console.log("=== METRIC CARDS DEBUG ===");
  console.log("Selected Entity in MetricCards:", selectedEntity);

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

  // ✅ Conditionally fetch metrics based on role
  const adminMetricsQuery = useGetMetricsForAdmin(empId, {
    enabled: !!empId && !!userCategory && isAdmin,
  });

  const employeeMetricsQuery = useGetMetricsForEmployee(empId, {
    enabled: !!empId && !!userCategory && !isAdmin,
  });
 
  // ✅ Fetch analytics for selected zone/dgm/campus
  const selectedZoneQuery = useGetAnalyticsForZone(selectedEntity.id, {
    enabled: !!selectedEntity.id && selectedEntity.type === "zone",
  });
 
  const selectedCampusQuery = useGetAnalyticsForCampus(selectedEntity.id, {
    enabled: !!selectedEntity.id && selectedEntity.type === "campus",
  });

  // ✅ Choose which data to use
  let metricsResponse, isLoading, error;
 
  console.log("=== CHOOSING METRICS DATA ===");
  console.log("Selected entity ID:", selectedEntity.id);
  console.log("Selected entity type:", selectedEntity.type);
 
  // If entity is selected, use its data; otherwise use default data
  if (selectedEntity.id) {
    const selectedQuery = selectedEntity.type === "zone"
      ? selectedZoneQuery
      : selectedCampusQuery;
    ({ data: metricsResponse, isLoading, error } = selectedQuery);
    console.log("Using Selected Entity Metrics for:", selectedEntity.name);
    console.log("Selected query data:", selectedQuery.data);
    console.log("Is loading:", selectedQuery.isLoading);
  } else {
    ({ data: metricsResponse, isLoading, error } = isAdmin
      ? adminMetricsQuery
      : employeeMetricsQuery);
    console.log("Using Default Metrics (Admin:", isAdmin, ")");
  }

  console.log("User Category:", userCategory);
  console.log("Is Admin:", isAdmin);
  console.log("Employee ID:", empId);
  console.log("Metrics Response:", metricsResponse);

  // 🧠 Prevent rendering until category & empId are ready
  if (!userCategory || !empId) {
    return <p>Loading user data...</p>;
  }

  // ✅ Show loading state, but still prepare to show cards
  if (isLoading) {
    return <p>Loading metrics...</p>;
  }

  // ✅ Log error but don't block rendering - we'll show cards with zeros
  if (error) {
    console.error("⚠️ Error fetching metrics:", error);
    console.error("⚠️ Will show default cards with zeros");
  }

  // ✅ Transform API response to cards format
  // Admin API (cards_graph) returns: { metricCards: [...] }
  // Employee API returns: { metricsData: { metrics: [...] }, graphData: {...} }
  // Selected Entity API returns: { metricsData: { metrics: [...] }, graphData: {...} }
  let cards = [];
 
  console.log("📊 ===== METRICS TRANSFORMATION DEBUG =====");
  console.log("📊 Has error:", !!error);
  console.log("📊 Full metricsResponse:", JSON.stringify(metricsResponse, null, 2));
  console.log("📊 metricsResponse type:", typeof metricsResponse);
  console.log("📊 Is Array?", Array.isArray(metricsResponse));
  console.log("📊 metricsResponse keys:", metricsResponse ? Object.keys(metricsResponse) : "null");
  console.log("📊 selectedEntity.id:", selectedEntity.id);
  console.log("📊 isAdmin:", isAdmin);
 
  // ✅ If there's an error or no response, we'll use default cards later
  // Continue processing to try to extract any data that might exist
 
  if (selectedEntity.id) {
    // Selected entity response structure (similar to employee)
    console.log("📊 Using Selected Entity - metricsData:", metricsResponse?.metricsData);
    const metricsData = metricsResponse?.metricsData;
    if (metricsData && metricsData.metrics && Array.isArray(metricsData.metrics)) {
      cards = metricsData.metrics.map((metric) => ({
        title: metric.title || "N/A",
        value: metric.currentValue ?? 0, // Use ?? to allow 0 values
        percentage: Math.round(Number(metric.percentageChange) ?? 0),
      }));
      console.log("📊 Selected Entity cards created:", cards.length);
    } else {
      console.warn("📊 Selected Entity - No valid metrics data found");
    }
  } else if (isAdmin) {
    // Admin response structure from cards_graph endpoint
    console.log("📊 Using Admin API - Full response:", metricsResponse);
    console.log("📊 Using Admin API - metricCards:", metricsResponse?.metricCards);
    console.log("📊 metricCards is Array?", Array.isArray(metricsResponse?.metricCards));
   
    // Handle different possible response structures
    if (metricsResponse?.metricCards && Array.isArray(metricsResponse.metricCards)) {
      // Standard structure: { metricCards: [...] }
      console.log("📊 Found metricCards array with length:", metricsResponse.metricCards.length);
      cards = metricsResponse.metricCards.map((card, index) => {
        const transformed = {
          title: card.title || "N/A",
          value: card.value ?? 0, // Use ?? to allow 0 values
          percentage: Math.round(Number(card.percentage) ?? 0),
          state: card.state || null, // Preserve state if present
        };
        console.log(`📊 Card ${index}:`, transformed);
        return transformed;
      });
      console.log("📊 Admin cards created from metricCards:", cards.length);
    } else if (Array.isArray(metricsResponse)) {
      // If response is directly an array
      console.log("📊 Response is directly an array with length:", metricsResponse.length);
      cards = metricsResponse.map((card, index) => {
        const transformed = {
          title: card.title || "N/A",
          value: card.value ?? 0,
          percentage: Math.round(Number(card.percentage) ?? 0),
          state: card.state || null,
        };
        console.log(`📊 Card ${index}:`, transformed);
        return transformed;
      });
      console.log("📊 Admin cards created from array:", cards.length);
    } else {
      console.warn("📊 Admin API - Unexpected response structure:", metricsResponse);
      // Try to extract any array from the response
      const possibleArrays = Object.values(metricsResponse || {}).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        console.log("📊 Found possible array in response:", possibleArrays[0]);
        cards = possibleArrays[0].map((card) => ({
          title: card.title || "N/A",
          value: card.value ?? 0,
          percentage: Math.round(Number(card.percentage) ?? 0),
          state: card.state || null,
        }));
      }
    }
  } else {
    // Employee response structure
    console.log("📊 Using Employee API - metricsData:", metricsResponse?.metricsData);
    const metricsData = metricsResponse?.metricsData;
    if (metricsData && metricsData.metrics && Array.isArray(metricsData.metrics)) {
      cards = metricsData.metrics.map((metric) => ({
        title: metric.title || "N/A",
        value: metric.currentValue ?? 0, // Use ?? to allow 0 values
        percentage: Math.round(Number(metric.percentageChange) ?? 0),
      }));
      console.log("📊 Employee cards created:", cards.length);
    } else {
      console.warn("📊 Employee API - No valid metrics data found");
    }
  }

  console.log("📊 ===== FINAL RESULT =====");
  console.log("📊 Final Cards after transformation:", JSON.stringify(cards, null, 2));
  console.log("📊 Cards length:", cards?.length);
  console.log("📊 Cards is Array?", Array.isArray(cards));
  console.log("📊 ===== END DEBUG =====");

  // ✅ Always normalize cards to ensure valid structure
  // Show ALL cards from API, even if values are 0
  if (cards && Array.isArray(cards) && cards.length > 0) {
    // ✅ API returned cards - use ALL of them (even with zeros)
    cards = cards.map((card) => ({
      title: card.title || "N/A",
      value: card.value ?? 0, // Preserve 0 values
      percentage: Math.round(Number(card.percentage) ?? 0), // Preserve 0 percentages
      state: card.state || null,
    }));
    console.log("📊 Using ALL cards from API:", cards.length, "cards");
  } else if (cards && Array.isArray(cards) && cards.length === 0) {
    // ✅ API returned empty array - this is valid, show empty (no defaults)
    console.log("📊 API returned empty array - showing no cards");
    cards = [];
  } else {
    // ✅ API returned null/undefined - try to extract from response directly
    console.warn("⚠️ Cards array is invalid - trying to extract from response");
    console.warn("⚠️ metricsResponse:", metricsResponse);
   
    // Try one more time to extract cards from response
    if (metricsResponse && typeof metricsResponse === 'object') {
      // Check all possible locations
      const possibleCards =
        metricsResponse.metricCards ||
        metricsResponse.metrics ||
        metricsResponse.data ||
        (Array.isArray(metricsResponse) ? metricsResponse : null);
     
      if (Array.isArray(possibleCards) && possibleCards.length > 0) {
        console.log("📊 Found cards in alternative location:", possibleCards.length);
        cards = possibleCards.map((card) => ({
          title: card.title || "N/A",
          value: card.value ?? 0,
          percentage: Math.round(Number(card.percentage) ?? 0),
          state: card.state || null,
        }));
      } else {
        cards = [];
      }
    } else {
      cards = [];
    }
  }

  console.log("📊 Final cards to display (ALL cards from API):", cards);
  console.log("📊 Total number of cards:", cards.length);
 
  // ✅ Default cards to show when API returns no data
  // Based on the API structure, these are the standard metric cards
  const defaultCards = [
    { title: "Total Applications", value: 0, percentage: 0, state: "total_applications" },
    { title: "Sold", value: 0, percentage: 0, state: "sold" },
    { title: "Confirmed", value: 0, percentage: 0, state: "confirmed" },
    { title: "Available", value: 0, percentage: 0, state: "available" },
    { title: "Issued", value: 0, percentage: 0, state: "issued" },
    { title: "Damaged", value: 0, percentage: 0, state: "damaged" },
    { title: "Unavailable", value: 0, percentage: 0, state: "unavailable" },
    { title: "With PRO", value: 0, percentage: 0, state: "with_pro" },
  ];

  // ✅ If no cards from API (empty array or null), show default cards with zeros
  // This ensures cards are always displayed, even when backend has no data
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    console.warn("⚠️ No cards from API - showing default cards with zeros");
    console.warn("⚠️ This means backend returned no data - displaying empty state with zeros");
    cards = defaultCards;
  }

  console.log("📊 Final cards to render:", cards.length, "cards");

  // ✅ Always render cards - never show "No data" message
  return (
    <div className={styles.metric_cards_container}>
      {cards.map((card, index) => {
        // Handle percentage colors and styling
        const isPositive = card.percentage > 0;
        const isNegative = card.percentage < 0;
       
        const cardColor = isPositive ? styles.card_green : styles.card_red;
        const percentageColor = isPositive ? styles.green_text : styles.red_text;
        const percentageBorder = isPositive
          ? styles.percentage_box_border_green
          : styles.percentage_box_border_red;
        const arrowDirection = isPositive
          ? "M2.08337 4.66667L5.00004 1.75M5.00004 1.75L7.91671 4.66667M5.00004 1.75V9.25"
          : "M7.91671 6.33333L5.00004 9.25M5.00004 9.25L2.08337 6.33333M5.00004 9.25V1.75";

        return (
          <div className={`${styles.metric_card} ${cardColor}`} key={index}>
            <div className={styles.metric_card_values}>
              <strong className={styles.card_value}>{card.value}</strong>
             
              <div className={`${styles.percentage_number_box} ${percentageBorder}`}>
                <span className={`${styles.card_percentage_text} ${percentageColor}`}>
                  {`${card.percentage >= 0 ? "+" : ""}${card.percentage}%`}
                </span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                  >
                    <path
                      d={arrowDirection}
                      stroke={isPositive ? "#22C55E" : "#EF4444"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <p className={styles.card_state}>{card.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;