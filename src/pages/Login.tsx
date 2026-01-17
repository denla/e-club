// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login: React.FC<{ setCurrentUser: any }> = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const loginWithTelegram = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;

        if (!tg) {
          setError("Откройте приложение внутри Telegram");
          return;
        }

        const userData = tg.initDataUnsafe; // id, first_name, last_name, username
        if (!userData) {
          setError("Не удалось получить данные пользователя Telegram");
          return;
        }

        const userRef = doc(db, "users", String(userData.id));
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Создаем нового пользователя
          const newUser = {
            uid: String(userData.id),
            firstName: userData.first_name,
            lastName: userData.last_name || "",
            username: userData.username || "",
            visitsCount: 0,
            achievements: [],
            merchReceived: {},
            role: "fan",
            visits: [],
          };
          await setDoc(userRef, newUser);
          setCurrentUser(newUser);
        } else {
          // Пользователь уже есть
          setCurrentUser(userSnap.data());
        }

        navigate("/users");
      } catch (err) {
        console.error("Ошибка авторизации Telegram:", err);
        setError("Ошибка авторизации Telegram");
      }
    };

    loginWithTelegram();
  }, [navigate, setCurrentUser]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>Авторизация через Telegram</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && <p>Пожалуйста, откройте это приложение внутри Telegram...</p>}
    </div>
  );
};

export default Login;
