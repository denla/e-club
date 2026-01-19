import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";

import type { User, TelegramUser } from "./types";

import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";
import { BottomNav } from "./features/BottomNav/BottomNav";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import WelcomePage from "./pages/WelcomePage";

/* =========================
   APP
========================= */

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    /* --- подписка на пользователей --- */
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData: User[] = snapshot.docs.map((doc) => doc.data() as User);
      setUsers(usersData);
    });

    /* --- инициализация Telegram пользователя --- */
    const init = async () => {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user as
        | TelegramUser
        | undefined;

      if (!tgUser) {
        console.warn("Telegram user not found");
        setLoading(false);
        return;
      }

      const uid = String(tgUser.id);
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentUser(docSnap.data() as User);
        setNeedsRegistration(false);
      } else {
        setNeedsRegistration(true);
      }

      setLoading(false);
    };

    init();

    return () => {
      unsubUsers();
    };
  }, []);

  /* --- создание пользователя --- */
  const createAccount = async () => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user as
      | TelegramUser
      | undefined;

    if (!tgUser) {
      console.error("Telegram user not found");
      return;
    }

    const uid = String(tgUser.id);

    const newUser: User = {
      id: uid,
      uid,

      firstName: tgUser.first_name,
      lastName: tgUser.last_name ?? "",
      email: "",

      role: "fan",
      visitsCount: 0,
      achievements: [],
      merchReceived: {},
      visits: [],

      photo_url: tgUser.photo_url,
      telegram: tgUser,
    };

    await setDoc(doc(db, "users", uid), newUser);

    setCurrentUser(newUser);
    setNeedsRegistration(false);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (needsRegistration) {
    return <WelcomePage onCreateAccount={createAccount} />;
  }

  return (
    <Router>
      <Navbar currentUser={currentUser} />

      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<LeaderboardPage users={users} />} />

        {/* ===== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ===== */}
        <Route path="/users/:uid" element={<UserProfilePage users={users} />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>

      <BottomNav uid={currentUser?.uid} />
    </Router>
  );
};

export default App;

/* =========================
   PROFILE ROUTE WRAPPER
========================= */

const UserProfilePage: React.FC<{ users: User[] }> = ({ users }) => {
  const { uid } = useParams();
  const user = users.find((u) => u.uid === uid);

  return <ProfilePage user={user} />;
};
