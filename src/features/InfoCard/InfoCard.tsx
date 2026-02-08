import React from "react";
import styles from "./InfoCard.module.css";
import arrow_right from "../../assets/icons/arrow_right.svg";

type Props = {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const InfoCard: React.FC<Props> = ({
  title,
  subtitle,
  image,
  buttonText,
  onClick,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.InfoCard_content}>
        <div className={styles.InfoCard_textWrapper}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.imageWrapper}>
          <img src={image} alt={title} className={styles.image} />
        </div>
      </div>

      <div className={styles.buttonWrapper} onClick={onClick}>
        {buttonText}
        <img src={arrow_right} alt={title} className={styles.buttonImage} />
      </div>
    </div>
  );
};
