/**
 * Data processing utilities for AddressInfoSection
 * Extracted from AddressInfoSection.js lines 71-278
 * Preserves every single line and functionality exactly as manager wants
 */

/**
 * Process states data with extensive logging and validation
 * @param {*} states - Raw states data from API
 * @returns {Array} Processed states array
 */
export const processStatesData = (states) => {
  console.log("=== Starting to fetch states ===");
  console.log("Fetched initial states (raw):", states);
  console.log("Type of response:", typeof states);
  console.log("Is array:", Array.isArray(states));
 
  // Handle both single object and array responses
  let statesArray = [];
  if (Array.isArray(states)) {
    statesArray = states;
    console.log("Processing as array with", states.length, "items");
  } else if (states && typeof states === 'object') {
    // If it's a single state object, wrap it in an array
    statesArray = [states];
    console.log("Processing as single object, wrapped in array");
  } else {
    console.warn("Unexpected response type:", typeof states, states);
  }
 
  console.log("States array to process:", statesArray);
  console.log("=== DETAILED DATA ANALYSIS ===");
  console.log("Number of states:", statesArray.length);
  if (statesArray.length > 0) {
    console.log("First state item:", statesArray[0]);
    console.log("First state keys:", Object.keys(statesArray[0]));
    console.log("First state values:", Object.values(statesArray[0]));
    console.log("First state JSON:", JSON.stringify(statesArray[0], null, 2));
  }
 
  const processedStates = statesArray
    .filter((item) => {
      console.log("🔍 Processing state item:", item);
      console.log("🔍 Item keys:", item ? Object.keys(item) : "No keys");
      console.log("🔍 Item stateId:", item?.stateId);
      console.log("🔍 Item stateName:", item?.stateName);
      console.log("🔍 Item name:", item?.name);
      console.log("🔍 Item state_name:", item?.state_name);
      console.log("🔍 Item id:", item?.id);
     
      const isValid = item && (item.stateId != null || item.id != null || item.state_id != null || item.ID != null || item.Id != null) && (item.stateName || item.name || item.state_name || item.StateName || item.STATE_NAME || item.title || item.label);
      if (!isValid) {
        console.log("❌ Filtered out invalid item:", item);
      } else {
        console.log("✅ Valid item:", item);
      }
      return isValid;
    })
    .map((item) => {
      // Try multiple possible field names for state name
      const stateName = item.stateName || item.name || item.state_name || item.state_name || item.stateName || item.StateName || item.STATE_NAME || item.title || item.label || "Unknown State";
      const stateId = item.stateId || item.id || item.state_id || item.ID || item.Id || "";
     
      const processed = {
        value: stateId?.toString() || "",
        label: stateName || "",
      };
      console.log("📍 Processed item:", item, "->", processed);
      return processed;
    });
 
  console.log("=== Final processed states ===");
  console.log("Processed states:", processedStates);
  console.log("Number of valid states:", processedStates.length);
 
  if (processedStates.length === 0) {
    console.warn("No valid states data received. Raw response:", states);
    console.warn("States array:", statesArray);
   
    // Don't use fallback data - show empty dropdown to indicate the issue
    console.warn("This means the field mapping is incorrect. Check the console logs above to see the actual field names.");
  } else {
    console.log(`Successfully loaded ${processedStates.length} states`);
  }

  return processedStates;
};

/**
 * Process districts data with logging
 * @param {*} districts - Raw districts data from API
 * @returns {Array} Processed districts array
 */
export const processDistrictsData = (districts) => {
  console.log("Fetched districts (raw):", districts);
  // Handle both single object and array responses for districts
  let districtsArray = [];
  if (Array.isArray(districts)) {
    districtsArray = districts;
  } else if (districts && typeof districts === 'object') {
    districtsArray = [districts];
  }
 
  console.log("🔍 Processing districts:", districtsArray);
  console.log("🔍 First district item:", districtsArray[0]);
  console.log("🔍 First district keys:", districtsArray[0] ? Object.keys(districtsArray[0]) : "No keys");
 
  return districtsArray
    .filter((item) => {
      console.log("🔍 District item:", item);
      console.log("🔍 District item keys:", item ? Object.keys(item) : "No keys");
      const isValid = item && item.id != null && item.name;
      console.log("🔍 District item valid:", isValid);
      return isValid;
    })
    .map((item) => {
      const processed = {
        value: item.id?.toString() || "",
        label: item.name || "",
      };
      console.log("📍 Processed district:", item, "->", processed);
      return processed;
    });
};

/**
 * Process cities and mandals data
 * @param {*} cities - Raw cities data from API
 * @param {*} mandals - Raw mandals data from API
 * @returns {Object} Processed cities and mandals
 */
export const processCitiesAndMandalsData = (cities, mandals) => {
  console.log("Fetched cities (raw):", cities);
  console.log("Fetched mandals (raw):", mandals);
  // Handle both single object and array responses for cities and mandals
  let citiesArray = [];
  if (Array.isArray(cities)) {
    citiesArray = cities;
  } else if (cities && typeof cities === 'object') {
    citiesArray = [cities];
  }
 
  let mandalsArray = [];
  if (Array.isArray(mandals)) {
    mandalsArray = mandals;
  } else if (mandals && typeof mandals === 'object') {
    mandalsArray = [mandals];
  }

  return {
    cities: citiesArray
      .filter((item) => item && item.id != null && item.name)
      .map((item) => ({
        value: item.id?.toString() || "",
        label: item.name || "",
      })),
    mandals: mandalsArray
      .filter((item) => item && item.id != null && item.name)
      .map((item) => ({
        value: item.id?.toString() || "",
        label: item.name || "",
      })),
  };
};
