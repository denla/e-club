import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

import type { User } from "./types";

import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";
import { BottomNav } from "./features/BottomNav/BottomNav";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { WelcomePage } from "./pages/WelcomePage"; // 👈 новый экран
import { useTelegram } from "./hooks/useTelegram";

/* =========================
   APP
========================= */

const App: React.FC = () => {
  const { user: tgUser, ready, isWebApp } = useTelegram();

  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  /* --- все пользователи --- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((d) => d.data() as User));
    });
    return unsub;
  }, []);

  /* --- проверка профиля по Telegram UID --- */
  useEffect(() => {
    if (!ready || !tgUser) return;

    const checkUser = async () => {
      const uid = tgUser.id.toString();
      const snap = await getDoc(doc(db, "users", uid));

      if (snap.exists()) {
        setCurrentUser(snap.data() as User);
      }

      setChecking(false);
    };

    checkUser();
  }, [ready, tgUser]);

  /* ===== ГЛОБАЛЬНЫЕ СОСТОЯНИЯ ===== */

  if (!isWebApp) {
    return <div>Пожалуйста, откройте через Telegram</div>;
  }

  if (!ready || checking) {
    return <div>Загрузка приложения…</div>;
  }

  /* ===== ПЕРВЫЙ ВХОД ===== */
  if (!currentUser) {
    return (
      <WelcomePage
        tgUser={tgUser}
        onCreated={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  /* ===== ОСНОВНОЕ ПРИЛОЖЕНИЕ ===== */

  return (
    <Router>
      <Navbar currentUser={currentUser} />

      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />

        {/* Login остаётся, если он тебе нужен отдельно */}
        <Route
          path="/login"
          element={<Login onUserLoaded={setCurrentUser} />}
        />

        <Route path="/users" element={<LeaderboardPage users={users} />} />

        <Route path="/users/:uid" element={<UserProfilePage users={users} />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>

      <BottomNav uid={currentUser.uid} />
    </Router>
  );
};

export default App;

/* =========================
   PROFILE ROUTE WRAPPER
========================= */

const UserProfilePage: React.FC<{ users: User[] }> = ({ users }) => {
  const { uid } = useParams<{ uid: string }>();
  const user = users.find((u) => u.uid === uid);

  return <ProfilePage user={user} />;
};
