import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

import WelcomePage from "./pages/WelcomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";

import type { User } from "./types";

declare global {
  interface Window {
    Telegram?: any;
  }
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tgUser, setTgUser] = useState<any>(null);

  /* ===== подписка на ВСЕХ пользователей ===== */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => d.data() as User));
    });

    return unsub;
  }, []);

  /* ===== проверка текущего пользователя ===== */
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();

    const telegramUser = tg?.initDataUnsafe?.user;
    if (!telegramUser) {
      console.error("Нет Telegram пользователя");
      setLoading(false);
      return;
    }

    setTgUser(telegramUser);

    const ref = doc(db, "users", String(telegramUser.id));

    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          setCurrentUser(snap.data() as User);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Загрузка…</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ===== ПЕРВЫЙ ВХОД ===== */}
        {!currentUser && (
          <Route
            path="*"
            element={
              <WelcomePage
                tgUser={tgUser}
                onCreated={(user) => setCurrentUser(user)}
              />
            }
          />
        )}

        {/* ===== ОСНОВНОЕ ПРИЛОЖЕНИЕ ===== */}
        {currentUser && (
          <>
            <Route path="/" element={<Navigate to="/users" />} />
            <Route path="/users" element={<LeaderboardPage users={users} />} />
            <Route path="*" element={<Navigate to="/users" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
