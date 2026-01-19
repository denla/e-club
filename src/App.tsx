import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import WelcomePage from "./pages/WelcomePage";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  email: string;
  createdAt: number;
  telegram: {
    id: number;
    first_name: string;
    last_name: string;
    username: string | null;
    language_code: string | null;
    photo_url: string;
  };
}

declare global {
  interface Window {
    Telegram?: any;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tgUser, setTgUser] = useState<any>(null);

  const navigate = useNavigate();

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
          setUser(snap.data() as User);
        }
      })
      .finally(() => {
        setLoading(false);
        navigate("/users");
      });
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Загрузка…</div>;
  }

  if (!user) {
    return (
      <WelcomePage tgUser={tgUser} onCreated={(newUser) => setUser(newUser)} />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Профиль</h2>
      <p>ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Имя: {user.telegram.first_name}</p>
      <p>Username: {user.telegram.username ?? "—"}</p>
    </div>
  );
}
