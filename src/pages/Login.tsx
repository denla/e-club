// src/pages/Login.tsx
import React, { useEffect, useState } from "react";

const Login: React.FC = () => {
  const [tgUser, setTgUser] = useState<any>(null);
  // const [error, setError] = useState("");

  // Мок-данные на случай, если WebApp недоступен
  const mockUser = {
    id: 123456,
    first_name: "Иван",
    last_name: "Иванов",
    username: "ivan_test",
  };

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (!tg) {
      // WebApp недоступен → используем мок-данные
      setTgUser(mockUser);
      return;
    }

    tg.ready(); // уведомляем Telegram, что WebApp готов

    // Иногда initDataUnsafe приходит с небольшой задержкой
    setTimeout(() => {
      if (tg.initDataUnsafe) {
        setTgUser(tg.initDataUnsafe);
      } else {
        setTgUser(mockUser); // если initDataUnsafe пуст, fallback на моки
      }
    }, 500);
  }, []);

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

      {/* Отладка: выводим весь объект Telegram */}
      <h3>Debug Telegram WebApp:</h3>
      <pre>{JSON.stringify((window as any).Telegram, null, 2)}</pre>
    </div>
  );
};

export default Login;
