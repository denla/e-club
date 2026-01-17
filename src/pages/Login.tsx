import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useTelegram } from "../hooks/useTelegram";
import type { User, Visit } from "../types";

export default function Login() {
  const { user: tgUser, ready, isWebApp } = useTelegram();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !tgUser) return;

    const createOrGetUser = async () => {
      const uid = tgUser.id.toString();
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      let finalUser: User;

      if (userSnap.exists()) {
        finalUser = userSnap.data() as User;
      } else {
        finalUser = {
          id: uid,
          uid: uid,
          firstName: tgUser.first_name || "",
          lastName: tgUser.last_name || "",
          email: tgUser.username ? `${tgUser.username}@telegram` : "",
          role: "fan",
          visitsCount: 0,
          achievements: [],
          merchReceived: {},
          visits: [],
          avatar: tgUser.photo_url || "", // сохраняем аватарку в Firebase
        };
        await setDoc(userRef, finalUser);
      }

      // --------------------------
      // Объединяем Firebase + Telegram
      const mergedUser = {
        ...finalUser,
        telegram: {
          id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          username: tgUser.username,
          language_code: tgUser.language_code,
          avatar: tgUser.photo_url || "", // аватарка
        },
      };
      // --------------------------

      setUser(mergedUser); // сохраняем в состояние
      setLoading(false);
    };

    createOrGetUser();
  }, [ready, tgUser]);

  if (!isWebApp) return <div>Пожалуйста, откройте через Telegram WebApp.</div>;
  if (!ready) return <div>Инициализация Telegram WebApp…</div>;
  if (loading) return <div>Загрузка данных пользователя…</div>;
  if (!user) return <div>Не удалось получить пользователя.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h2>Данные Telegram</h2>
      <pre>{JSON.stringify(tgUser, null, 2)}</pre>

      <h2>Данные из Firebase</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
