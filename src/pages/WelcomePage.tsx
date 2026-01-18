import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { User } from "../App";

interface Props {
  tgUser: any;
  onCreated: (user: User) => void;
}

export default function WelcomePage({ tgUser, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createAccount = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = String(tgUser.id);

      const newUser: User = {
        id: userId,
        email: tgUser.username ? `${tgUser.username}@telegram` : "",
        createdAt: Date.now(),
        telegram: {
          id: tgUser.id,
          first_name: tgUser.first_name ?? "",
          last_name: tgUser.last_name ?? "",
          username: tgUser.username ?? null, // ❗ ВАЖНО
          language_code: tgUser.language_code ?? null,
          photo_url: tgUser.photo_url ?? "",
        },
      };

      await setDoc(doc(db, "users", userId), {
        ...newUser,
        createdAt: serverTimestamp(),
      });

      onCreated(newUser);
    } catch (e) {
      console.error(e);
      setError("Ошибка создания аккаунта");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Создаём аккаунт</h2>

      <p>Привет, {tgUser.first_name} 👋</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={createAccount} disabled={loading}>
        {loading ? "Создание…" : "Создать аккаунт"}
      </button>
    </div>
  );
}
