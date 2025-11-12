import React from "react";
import styles from "./SideBar.module.css";
import { listData } from "./SideBarListObject";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <ul className={styles.sidebar}>
      {listData.map((list) => (
        <li key={list.name} className={styles.list}>
          <NavLink
            to={list.route}
            className={({ isActive }) =>
              isActive ? `${styles.item} ${styles.active}` : styles.item
            }
          >
            <figure className={styles.figure}>
              <img src={list.icon} className={styles.icons} alt={list.name} />
            </figure>
            <span className={styles.tab}>{list.name}</span>
          </NavLink>
        </li>
      ))}
      <div className={styles.line}></div>
    </ul>
  );
};

export default SideBar;
