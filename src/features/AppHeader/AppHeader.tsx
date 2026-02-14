import React, { useEffect, useState } from "react";
import styles from "./AppHeader.module.css";
import logo from "../../assets/logo/logo.svg";

type Props = {
  align?: "left" | "center";
};

const AppHeader: React.FC<Props> = ({ align = "center" }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.placeholder}></div>
      <header
        className={`${styles.header} ${styles[align]} ${
          scrolled ? styles.scrolled : ""
        }`}
      >
        <img src={logo} className={styles.logo} alt="logo" />
      </header>
    </div>
  );
};

export default AppHeader;
