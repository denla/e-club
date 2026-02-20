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

import { ScrollToTop } from "./components/ScrollToTop";
import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";
import { BottomNav } from "./features/BottomNav/BottomNav";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import { RequestPage } from "./pages/RequestPage/RequestPage";
import { AdminPage } from "./pages/AdminPage";
import { RewardsPage } from "./pages/RewardsPage/RewardsPage";
import { LeaderboardSearchPage } from "./pages/LeaderboardSearchPage/LeaderboardSearchPage";

import type { User, TelegramUser } from "./types";
import Preloader from "./features/Preloader/Preloader";
import { useTelegramInsets } from "./hooks/useTelegramInsets";

// --- MOCK для разработки вне Telegram
const MOCK_TG_USER: TelegramUser = {
  id: 999999,
  first_name: "Тест",
  last_name: "Пользователь",
  username: "testuser",
  language_code: "ru",
  photo_url: "https://via.placeholder.com/100",
};

const USE_MOCK = false;

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [loading, setLoading] = useState(true);

  useTelegramInsets();

  // 🔹 Получаем Telegram user синхронно
  const getTelegramUser = (): TelegramUser | null => {
    if (USE_MOCK) return MOCK_TG_USER;
    return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
  };

  // 🔹 Подписка на users
  useEffect(() => {
    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersData: User[] = snapshot.docs.map(
          (doc) => doc.data() as User,
        );
        setUsers(usersData);
      },
      (error) => {
        console.error("Users subscription error:", error);
      },
    );

    return () => unsubUsers();
  }, []);

  // 🔹 Инициализация приложения
  useEffect(() => {
    let interval: number; // <- вот здесь, НЕ NodeJS.Timer

    const checkTelegramUser = async () => {
      const tgUser = getTelegramUser();

      if (tgUser) {
        clearInterval(interval); // браузерный clearInterval принимает number
        const uid = String(tgUser.id);
        try {
          const docSnap = await getDoc(doc(db, "users", uid));

          if (docSnap.exists()) {
            setCurrentUser(docSnap.data() as User);
          } else {
            setNeedsRegistration(true);
          }
        } catch (error) {
          console.error("Init error:", error);
          setNeedsRegistration(true);
        } finally {
          setLoading(false);
        }
      }
    };

    checkTelegramUser();
    interval = window.setInterval(checkTelegramUser, 500); // <- используем window.setInterval

    return () => clearInterval(interval);
  }, []);

  // 🔹 Сообщаем Telegram, что UI готов
  useEffect(() => {
    if (!loading && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.ready();
    }
  }, [loading]);

  const createAccount = async () => {
    const tgUser = getTelegramUser();
    if (!tgUser) return;

    const uid = String(tgUser.id);

    const newUser: User = {
      id: uid,
      uid,
      firstName: tgUser.first_name,
      lastName: tgUser.last_name ?? "",
      email: tgUser.username ? `${tgUser.username}@telegram` : "",
      role: "fan",
      visitsCount: 0,
      achievements: [],
      merchReceived: {},
      visits: [],
      photo_url: tgUser.photo_url ?? "",
      telegram: {
        id: tgUser.id,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name ?? "",
        username: tgUser.username ?? "",
        language_code: tgUser.language_code ?? "",
        photo_url: tgUser.photo_url ?? "",
      },
    };

    try {
      await setDoc(doc(db, "users", uid), newUser);
      setCurrentUser(newUser);
      setNeedsRegistration(false);
    } catch (error) {
      console.error("Create account error:", error);
    }
  };

  // 🔹 UI состояния

  if (loading) return <Preloader />;

  if (needsRegistration)
    return (
      <WelcomePage
        onCreateAccount={createAccount}
        tgReady={!!window.Telegram?.WebApp}
      />
    );

  return (
    <Router>
      <ScrollToTop />
      <div
        style={{ display: "flex", justifyContent: "center", width: "100vw" }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/users" />} />
          <Route
            path="/users"
            element={<LeaderboardPage users={users} uid={currentUser?.uid} />}
          />
          <Route
            path="/users/:uid"
            element={
              <UserProfilePage users={users} currentUser={currentUser} />
            }
          />
          <Route
            path="/admin"
            element={<AdminPage currentUser={currentUser} />}
          />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route
            path="/users/search"
            element={<LeaderboardSearchPage users={users} />}
          />
          <Route path="*" element={<Navigate to="/users" />} />
        </Routes>

        <BottomNav uid={currentUser?.uid} />
      </div>
    </Router>
  );
};

export default App;

const UserProfilePage: React.FC<{
  users: User[];
  currentUser: User | null;
}> = ({ users, currentUser }) => {
  const { uid } = useParams();
  const user = users.find((u) => u.uid === uid);
  return <ProfilePage user={user} currentUser={currentUser} allUsers={users} />;
};
