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

// import Navbar from "./components/Navbar";

import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";
import { BottomNav } from "./features/BottomNav/BottomNav";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import { RequestPage } from "./pages/RequestPage/RequestPage";
import { AdminPage } from "./pages/AdminPage";
import { RewardsPage } from "./pages/RewardsPage/RewardsPage";

import type { User, TelegramUser } from "./types";
import Preloader from "./features/Preloader/Preloader";

import { useTelegramInsets } from "./hooks/useTelegramInsets";

// --- моковые данные для теста вне Telegram WebApp
const MOCK_TG_USER: TelegramUser = {
  id: 999999,
  first_name: "Тест",
  last_name: "Пользователь",
  username: "testuser",
  language_code: "ru",
  photo_url: "https://via.placeholder.com/100",
};
const USE_MOCK = false; // true для теста вне Telegram WebApp

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [needsRegistration, setNeedsRegistration] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tgReady, setTgReady] = useState(false);

  useTelegramInsets();

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

    const init = async () => {
      try {
        // 1️⃣ Telegram ready
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          setTgReady(true);
        }

        // 2️⃣ Ждём user от Telegram
        const getTelegramUser = async (): Promise<TelegramUser | null> => {
          if (USE_MOCK) return MOCK_TG_USER;

          const maxAttempts = 25; // ~5 секунд
          let attempts = 0;

          return new Promise((resolve) => {
            const check = () => {
              const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

              if (user) {
                resolve(user as TelegramUser);
                return;
              }

              attempts++;

              if (attempts >= maxAttempts) {
                resolve(null);
                return;
              }

              setTimeout(check, 200);
            };

            check();
          });
        };

        const tgUser = await getTelegramUser();

        if (!tgUser) {
          console.warn("Telegram user not received");
          setNeedsRegistration(true);
          return;
        }

        // 3️⃣ Проверяем Firestore
        const uid = String(tgUser.id);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as User);
          setNeedsRegistration(false);
        } else {
          setNeedsRegistration(true);
        }
      } catch (error) {
        console.error("INIT ERROR:", error);
        setNeedsRegistration(true);
      } finally {
        // 4️⃣ Гарантированно выключаем loader
        setLoading(false);
      }
    };

    init();

    return () => unsubUsers();
  }, []);

  // --- создание нового пользователя
  const createAccount = async () => {
    let tgUser: TelegramUser | undefined;

    if (USE_MOCK) {
      tgUser = MOCK_TG_USER;
    } else {
      tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user as
        | TelegramUser
        | undefined;
    }

    if (!tgUser) {
      alert("Telegram WebApp ещё не готов! Попробуйте подождать секунду.");
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
        username: tgUser.username ?? "", // ✅ исправлено
        language_code: tgUser.language_code ?? "", // ✅ исправлено
        photo_url: tgUser.photo_url ?? "",
      },
    };

    try {
      await setDoc(doc(db, "users", uid), newUser);
      setCurrentUser(newUser);
      setNeedsRegistration(false);
      // alert("Аккаунт успешно создан!");
    } catch (error) {
      alert("Ошибка при создании аккаунта: " + (error as any).message);
    }
  };

  if (loading)
    return (
      <div>
        <Preloader />
      </div>
    );

  if (needsRegistration)
    return <WelcomePage onCreateAccount={createAccount} tgReady={tgReady} />;

  return (
    <Router>
      <ScrollToTop />
      {/* <Navbar currentUser={currentUser} /> */}

      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<LeaderboardPage users={users} />} />
        <Route
          path="/users/:uid"
          element={<UserProfilePage users={users} currentUser={currentUser} />}
        />
        <Route
          path="/admin"
          element={<AdminPage currentUser={currentUser} />}
        />
        <Route path="*" element={<Navigate to="/users" />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
      </Routes>

      <BottomNav uid={currentUser?.uid} />
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
