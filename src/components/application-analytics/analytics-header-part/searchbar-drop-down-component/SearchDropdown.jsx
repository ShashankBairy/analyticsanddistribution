// import { useEffect, useMemo, useState } from "react";
// import ZoneNameDropdown from "../zone-name-dropdown/ZoneNameDropdown";
// import styles from "./SearchDropdown.module.css";

// const SearchDropdown = ({ userRole = "CEO", onTabChange }) => {
//   // Master order (for consistent rendering)
//   const TAB_ORDER = ["Zone", "DGM", "Campus"];

//   // Visibility rules per role
//   const allowedTabsByRole = {
//     CEO:["Zone", "DGM","Campus"],
//     Zone: ["DGM","Campus"],
//     DGM: [ "Campus"],
//     Campus: [],
//   };

//   // Compute visible tabs for the current role
//   const visibleTabs = useMemo(
//     () => allowedTabsByRole[userRole] ?? [],
//     [userRole]
//   );

//   // Active tab defaults to the first allowed tab
//   const [activeTab, setActiveTab] = useState(visibleTabs[0]);

//   // If role changes, reset the active tab to a valid one
//   useEffect(() => {
//     if (!visibleTabs.includes(activeTab)) {
//       setActiveTab(visibleTabs[0]);
//       onTabChange?.(visibleTabs[0]);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userRole, visibleTabs]);

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     onTabChange?.(tab); // parent can fetch analytics for this tab
//   };

//   return (
//     <div
//       id="search_dropdown_wrapper"
//       className={styles.search_dropdown_wrapper}
//     >
//       <label className={styles.dropdown_header}>Filter Category</label>

//       <ul
//         className={styles.all_tabs}
//         role="tablist"
//         aria-label="Filter Category"
//       >
//         {TAB_ORDER.filter((t) => visibleTabs.includes(t)).map((tab) => (
//           <li
//             key={tab}
//             role="tab"
//             aria-selected={activeTab === tab}
//             tabIndex={0}
//             className={`${styles.tabs_dropdown} ${
//               activeTab === tab ? styles.active_tab : ""
//             }`}
//             onClick={() => handleTabClick(tab)}
//             onKeyDown={(e) =>
//               (e.key === "Enter" || e.key === " ") && handleTabClick(tab)
//             }
//           >
//             <a
//               className={`${styles.tab_dropdown} ${
//                 activeTab === tab ? styles.active_tab : ""
//               }`}
//             >
//               {tab}
//             </a>
//           </li>
//         ))}
//       </ul>

//       <ZoneNameDropdown />
//     </div>
//   );
// };

// export default SearchDropdown;

import { useEffect, useMemo, useState } from "react";
import ZoneNameDropdown from "../zone-name-dropdown/ZoneNameDropdown";
import styles from "./SearchDropdown.module.css";
import { usePermission } from "../../../../hooks/usePermission ";

const SearchDropdown = ({ onTabChange }) => {
  // 1. Define the tabs and their associated permission keys (unchanged)
  const TAB_PERMISSIONS = useMemo(
    () => [
      { label: "Zone", key: "DISTRIBUTE_ZONE" },
      { label: "DGM", key: "DISTRIBUTE_DGM" },
      { label: "Campus", key: "DISTRIBUTE_CAMPUS" },
    ],
    []
  );

  // 🔑 Call usePermission hooks unconditionally at the top level
  const zonePerms = usePermission("DISTRIBUTE_ZONE");
  const dgmPerms = usePermission("DISTRIBUTE_DGM");
  const campusPerms = usePermission("DISTRIBUTE_CAMPUS");

  // 2. Fetch permissions for all tabs (combines the results)
  const tabAccess = useMemo(() => {
    const permissionMap = {
      Zone: { ...zonePerms, canInteract: zonePerms.isFullAccess },
      DGM: { ...dgmPerms, canInteract: dgmPerms.isFullAccess },
      Campus: { ...campusPerms, canInteract: campusPerms.isFullAccess },
    };

    return TAB_PERMISSIONS.map((tab) => {
      const access = permissionMap[tab.label];

      return {
        ...tab,
        canView: access.canView, // Keep canView for logic checks, but not for rendering filter
        canInteract: access.canInteract,
      };
    });
  }, [zonePerms, dgmPerms, campusPerms, TAB_PERMISSIONS]);

  // 3. 🛑 CRITICAL CHANGE: Use all tabs for rendering, regardless of canView
  const visibleTabs = tabAccess;

  // 4. Determine the first *interactable* tab for the initial state.
  // If no tab is interactable, default to the first one that is visible.
  const initialActiveTab =
    visibleTabs.find((t) => t.canInteract)?.label ||
    visibleTabs.find((t) => t.canView)?.label;

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  // 5. Effect hook to sync active tab with parent component on initial load/permission change
  useEffect(() => {
    if (visibleTabs.length > 0 && activeTab) {
      onTabChange?.(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabAccess]); // Depend on tabAccess to trigger on load/permission update

  const handleTabClick = (tabLabel) => {
    // Find the full tab object to check interaction permission
    const currentTab = tabAccess.find((t) => t.label === tabLabel);

    // 🔥 ONLY allow click if the user has full access (canInteract is true)
    if (currentTab && currentTab.canInteract) {
      setActiveTab(tabLabel);
      onTabChange?.(tabLabel);
    }
  };

  // We don't need currentActiveTab here since we use activeTab directly

  return (
    <div
      id="search_dropdown_wrapper"
      className={styles.search_dropdown_wrapper}
    >
      <label className={styles.dropdown_header}>Filter Category</label>

      <ul
        className={styles.all_tabs}
        role="tablist"
        aria-label="Filter Category"
      >
        {/* 6. Map all tabs in tabAccess for rendering */}
        {visibleTabs.map((tab) => {
          const hasView = tab.canView;
          const hasFullAccess = tab.canInteract; // same as isFullAccess in your map

          // 👇 Determine disabled condition
          const isDisabled = !hasView || !hasFullAccess;

          return (
            <li
              key={tab.label}
              role="tab"
              aria-selected={activeTab === tab.label}
              tabIndex={isDisabled ? -1 : 0}
              className={`${styles.tabs_dropdown} ${
                activeTab === tab.label ? styles.active_tab : ""
              } ${isDisabled ? styles.disabled_tab : ""}`}
              onClick={
                !isDisabled ? () => handleTabClick(tab.label) : undefined
              }
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                !isDisabled &&
                handleTabClick(tab.label)
              }
            >
              <a
                className={`${styles.tab_dropdown} ${
                  activeTab === tab.label ? styles.active_tab : ""
                }`}
              >
                {tab.label}
              </a>
            </li>
          );
        })}
      </ul>

      <ZoneNameDropdown activeTab={activeTab} />
    </div>
  );
};

export default SearchDropdown;
