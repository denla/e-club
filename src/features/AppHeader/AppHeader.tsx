import React from "react";
import styles from "./AppHeader.module.css";

import logoImg from "../../assets/logo/app_logo.svg"; // путь к вашему логотипу

const AppHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <img src={logoImg} alt="Logo" className={styles.logo} />
    </header>
  );
};

export default AppHeader;
