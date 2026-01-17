// src/pages/Login.tsx
import React, { useEffect, useState } from "react";

const Login: React.FC = () => {
  const [tgUser, setTgUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (!tg) {
      setError("Откройте приложение внутри Telegram");
      return;
    }

    if (tg.initDataUnsafe) {
      setTgUser(tg.initDataUnsafe); // данные Telegram
    } else {
      setError("Не удалось получить данные пользователя Telegram");
    }
  }, []);

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  if (!tgUser) {
    return <div style={{ padding: 20 }}>Загрузка данных Telegram...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Данные пользователя Telegram:</h2>
      <p>
        <strong>ID:</strong> {tgUser.id}
      </p>
      <p>
        <strong>Имя:</strong> {tgUser.first_name}
      </p>
      {tgUser.last_name && (
        <p>
          <strong>Фамилия:</strong> {tgUser.last_name}
        </p>
      )}
      {tgUser.username && (
        <p>
          <strong>Username:</strong> @{tgUser.username}
        </p>
      )}
    </div>
  );
};

export default Login;
