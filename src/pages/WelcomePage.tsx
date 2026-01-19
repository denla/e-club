import React from "react";

type Props = {
  onCreateAccount: () => Promise<void>;
};

const WelcomePage: React.FC<Props> = ({ onCreateAccount }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1>Добро пожаловать 👋</h1>
      <p style={{ marginBottom: 24 }}>
        Это ваш первый вход. Создайте аккаунт, чтобы продолжить.
      </p>

      <button
        onClick={onCreateAccount}
        style={{
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          background: "#2ea6ff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Создать аккаунт
      </button>
    </div>
  );
};

export default WelcomePage;
