import React from "react";
import LogoComponent from "./LogoComponent";
import SearchComponent from "./SearchComponent";
import UserInfoComponent from "./UserInfoComponent";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.top_header}>
      <LogoComponent />
      <div className={styles.left_header}>
        <SearchComponent />
        <UserInfoComponent />
      </div>
    </header>
  );
};

export default Header;
