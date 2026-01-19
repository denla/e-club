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
import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";
import { BottomNav } from "./features/BottomNav/BottomNav";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import WelcomePage from "./pages/WelcomePage";

import type { User, TelegramUser } from "./types";

// --- моковые данные для теста вне Telegram WebApp
const MOCK_TG_USER: TelegramUser = {
  id: 999999,
  first_name: "Тест",
  last_name: "Пользователь",
  username: "testuser",
  language_code: "ru",
  photo_url: "https://via.placeholder.com/100",
};

const USE_MOCK = false; // true если тестируем в обычном браузере

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData: User[] = snapshot.docs.map((doc) => doc.data() as User);
      setUsers(usersData);
    });

    const init = async () => {
      // Берём Telegram user или мок для теста
      let tgUser: TelegramUser | undefined;

      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        tgUser = window.Telegram.WebApp.initDataUnsafe.user as TelegramUser;
      } else if (USE_MOCK) {
        tgUser = MOCK_TG_USER;
      }

      if (!tgUser) {
        console.warn("Telegram user not found и USE_MOCK выключен");
        setLoading(false);
        return;
      }

      const uid = String(tgUser.id);
      const docSnap = await getDoc(doc(db, "users", uid));

      if (docSnap.exists()) {
        setCurrentUser(docSnap.data() as User);
        setNeedsRegistration(false);
      } else {
        setNeedsRegistration(true); // <-- теперь WelcomePage появится
      }

      setLoading(false);
    };

    init();

    return () => unsubUsers();
  }, []);

  // --- создание нового пользователя
  const createAccount = async () => {
    const tgUser = USE_MOCK
      ? MOCK_TG_USER
      : (window.Telegram?.WebApp?.initDataUnsafe?.user as
          | TelegramUser
          | undefined);

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
        username: tgUser.username,
        language_code: tgUser.language_code,
        photo_url: tgUser.photo_url ?? "",
      },
    };

    await setDoc(doc(db, "users", uid), newUser);

    setCurrentUser(newUser);
    setNeedsRegistration(false);
    // users обновится автоматически через onSnapshot
  };

  if (loading) return <div>Загрузка...</div>;

  // --- показываем WelcomePage, если нужно зарегистрироваться
  if (needsRegistration) return <WelcomePage onCreateAccount={createAccount} />;

  return (
    <Router>
      <Navbar currentUser={currentUser} />

      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<LeaderboardPage users={users} />} />
        <Route path="/users/:uid" element={<UserProfilePage users={users} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>

      <BottomNav uid={currentUser?.uid} />
    </Router>
  );
};

export default App;

// --- профиль пользователя
const UserProfilePage: React.FC<{ users: User[] }> = ({ users }) => {
  const { uid } = useParams();
  const user = users.find((u) => u.uid === uid);
  return <ProfilePage user={user} />;
};
