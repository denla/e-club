import React from "react";
import styles from "./AppHeader.module.css";
import logo from "../../assets/logo/logo.svg";

type Props = {
  align?: "left" | "center";
};

const AppHeader: React.FC<Props> = ({ align = "center" }) => {
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}></div>
      <header className={`${styles.header} ${styles[align]}`}>
        <img src={logo} className={styles.logo} alt="logo" />
        <div className={styles.shadowGradientBlur}>
          {/* <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div> */}
        </div>
      </header>
    </div>
  );
};

export default AppHeader;
