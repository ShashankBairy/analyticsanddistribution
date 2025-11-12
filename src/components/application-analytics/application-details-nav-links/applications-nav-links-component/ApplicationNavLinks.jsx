// import { useLocation, useNavigate } from "react-router-dom";
// import styles from "./ApplicationNavLinks.module.css";
// import { tabs } from "./links";

// const ApplicationNavLinks = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Function to handle tab click and navigation
//   const handleTabClick = (path) => {
//     navigate(path); // Navigate to the corresponding path
//   };

//   return (
//     <ul className={styles.all_nav_tabs}>
//       {tabs.map((tab) => {
//         const isActive = location.pathname.includes(tab.path); // Check if the tab is active
//         return (
//           <li
//             key={tab.label}
//             className={`${styles.nav_tabs} ${isActive ? styles.active_tab : ""}`}
//             onClick={() => handleTabClick(tab.path)}
//           >
//             <a
//               // className={`${styles.tab} ${isActive ? styles.activeTabText : ""}`}
//             >
//               {tab.label}
//             </a>
//           </li>
//         );
//       })}
//     </ul>
//   );
// };

// export default ApplicationNavLinks;

import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ApplicationNavLinks.module.css";
import { tabs } from "./links";
import { useSelector } from "react-redux";
import { TAB_SCREEN_MAPPING } from "../../../../constants/tabScreenMapping";
// import GenericNavTabs from "../../../../widgets/NavTabs/GenericNavTabs";

const ApplicationNavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = useSelector((state) => state.authorization.permissions);

  const handleTabClick = (path) => {
    navigate(`/scopes/application/${path}`);
  };

  if (!permissions || Object.keys(permissions).length === 0) {
    console.log("⚠️ Permissions not yet loaded, skipping render.");
    return (
      <ul className={styles.all_nav_tabs}>
        <li className={styles.nav_tabs_disabled}>
          <a>Loading...</a>
        </li>
      </ul>
    );
  }

  // ...
  const visibleTabs = tabs.filter((tab) => {
    const relatedScreens = TAB_SCREEN_MAPPING[tab.id] || [];

    // 🔬 New Debugging Logs 🔬
    console.log(`Checking Tab: ${tab.id}`);
    console.log(`Required Screens:`, relatedScreens);
    // ➡️ .some() is a JavaScript array method that checks if at least one 
    // element in the array meets a condition.
    const isVisible = relatedScreens.some((screenKey) => {
      const hasAccess = permissions?.[screenKey];
      // Log the result for each screen key check
      console.log(`  -> Screen: ${screenKey}, Has Permission: ${!!hasAccess}`);
      return hasAccess;
    });

    console.log(`Result for ${tab.id}: ${isVisible}`);
    return isVisible;
  });

  // ...

  console.log("visibleTabs:", visibleTabs);

  

  return (
    <div>
      <ul className={styles.all_nav_tabs}>
      {visibleTabs.map((tab) => {
        const isActive = location.pathname.includes(tab.path);
        return (
          <li
            key={tab.id}
            className={`${styles.nav_tabs} ${
              isActive ? styles.active_tab : ""
            }`}
            onClick={() => handleTabClick(tab.path)}
          >
            <a className={styles.tab}>{tab.label}</a>
          </li>
        );
      })}
    </ul> 
    </div>
  );
};

export default ApplicationNavLinks;
