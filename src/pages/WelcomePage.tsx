import React, { useState } from "react";

type Props = {
  onCreateAccount: () => Promise<void>;
};

const WelcomePage: React.FC<Props> = ({ onCreateAccount }) => {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await onCreateAccount();
    } catch (err) {
      console.error("Ошибка при создании аккаунта:", err);
    } finally {
      setLoading(false);
    }
  };

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
        onClick={handleCreate}
        disabled={loading}
        style={{
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          background: "#2ea6ff",
          color: "#fff",
          cursor: "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Создание..." : "Создать аккаунт"}
      </button>
    </div>
  );
};

export default WelcomePage;
