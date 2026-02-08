import React from "react";
import styles from "./AppButton.module.css";

type ButtonSize = "default" | "wide";
type ButtonVariant = "white" | "orange" | "grey";

type Props = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const AppButton: React.FC<Props> = ({
  size = "default",
  variant = "orange",
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button
      className={`
        ${styles.button}
        ${styles[size]}
        ${styles[variant]}
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
