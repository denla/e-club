import React from "react";
import styles from "./AppHeader.module.css";
import logo from "../../assets/logo/logo.svg";

type Props = {
  align?: "left" | "center";
};

const AppHeader: React.FC<Props> = ({ align = "center" }) => {
  return (
    <header className={`${styles.header} ${styles[align]}`}>
      <img src={logo} className={styles.logo} alt="logo" />
      <div className={styles.gradientBlur}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
};

export default AppHeader;
