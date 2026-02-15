import React, { useEffect, useState } from "react";
import styles from "./AppHeader.module.css";
import logo from "../../assets/logo/logo.svg";

type Props = {
  align?: "left" | "center";
  title?: string;
};

const AppHeader: React.FC<Props> = ({ align = "center", title }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!title) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [title]);

  const isFixed = Boolean(title);

  return (
    <div className={styles.container}>
      {isFixed && <div className={styles.placeholder}></div>}

      <header
        className={`
          ${styles.header}
          ${styles[align]}
          ${isFixed ? styles.fixed : ""}
          ${scrolled ? styles.scrolled : ""}
        `}
      >
        {!scrolled && <img src={logo} className={styles.logo} alt="logo" />}

        {scrolled && title && <h1 className={styles.title}>{title}</h1>}
      </header>
    </div>
  );
};

export default AppHeader;
