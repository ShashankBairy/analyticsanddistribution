import { useLocation, useNavigate } from "react-router-dom";
import styles from "./NavTabWithIcons.module.css";

const NavTabsWithIcons = ({ tabs }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavTab = (path) => {
    navigate(path);
  };

  return (
    <ul className={styles.nav_tab}>
      {tabs.map((tab) => {
        const isActive = location.pathname.includes(tab.path);
        return (
          <li
            key={tab.id}
             className={styles.nav_list}
            onClick={() => handleNavTab(tab.path)}
          >
            <a className={`${styles.nav_item} ${isActive ? styles.active : ""}`}>
              <figure className={styles.figure}>
                <img src={tab.icon} alt={tab.label} className={styles.icons}/>
              </figure>
              <span className={styles.tab}>{tab.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default NavTabsWithIcons;