import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useTelegram } from "../hooks/useTelegram";
import type { User } from "../types";

export default function Login({
  onUserLoaded,
}: {
  onUserLoaded?: (user: User) => void;
}) {
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
      let mergedUser: User;

      if (userSnap.exists()) {
        // Пользователь уже есть в Firestore
        finalUser = userSnap.data() as User;

        mergedUser = {
          ...finalUser,
          telegram: {
            id: tgUser.id,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name,
            username: tgUser.username,
            language_code: tgUser.language_code,
            photo_url: tgUser.photo_url ?? "",
          },
        };
      } else {
        // Создаём нового пользователя
        finalUser = {
          id: uid,
          uid: uid,
          firstName: tgUser.first_name || "",
          lastName: tgUser.last_name || "",
          email: tgUser.username ? `${tgUser.username}@telegram` : "",
          role: "fan", // стандартная роль
          visitsCount: 0,
          achievements: [],
          merchReceived: {},
          visits: [],
          photo_url: tgUser.photo_url ?? "",
        };

        await setDoc(userRef, finalUser);

        mergedUser = {
          ...finalUser,
          telegram: {
            id: tgUser.id,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name,
            username: tgUser.username,
            language_code: tgUser.language_code,
            photo_url: tgUser.photo_url ?? "",
          },
        };
      }

      setUser(mergedUser);
      setLoading(false);

      // уведомляем App о пользователе с ролью
      if (onUserLoaded) onUserLoaded(finalUser);
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
      <pre>{JSON.stringify(user.telegram, null, 2)}</pre>

      <h2>Данные из Firebase (с ролью)</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
