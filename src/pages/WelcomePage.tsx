import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useTelegram } from "../hooks/useTelegram";
import type { User } from "../types";

interface Props {
  onCreated: (user: User) => void;
}

export const WelcomePage: React.FC<Props> = ({ onCreated }) => {
  const { user: tgUser, ready, isWebApp } = useTelegram();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isWebApp) {
    return <div style={{ padding: 32 }}>Откройте через Telegram</div>;
  }

  if (!ready) {
    return <div style={{ padding: 32 }}>Инициализация Telegram…</div>;
  }

  if (!tgUser) {
    return (
      <div style={{ padding: 32 }}>Не удалось получить данные Telegram</div>
    );
  }

  const handleCreate = async () => {
    try {
      setCreating(true);
      setError(null);

      const uid = tgUser.id.toString();

      const newUser: User = {
        id: uid,
        uid,
        firstName: tgUser.first_name || "",
        lastName: tgUser.last_name || "",
        email: tgUser.username ? `${tgUser.username}@telegram` : "",
        role: "fan",
        visitsCount: 0,
        achievements: [],
        merchReceived: {},
        visits: [],
        photo_url: (tgUser as any).photo_url ?? "",
        telegram: {
          id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          username: tgUser.username,
          language_code: tgUser.language_code,
          photo_url: (tgUser as any).photo_url ?? "",
        },
      };

      console.log("🔥 Создаём пользователя в Firestore", newUser);

      await setDoc(doc(db, "users", uid), newUser);

      console.log("✅ Пользователь создан");

      onCreated(newUser);
    } catch (e) {
      console.error(e);
      setError("Ошибка создания аккаунта");
      setCreating(false);
    }
  };

  return (
    <div
      style={{
        padding: 32,
        textAlign: "center",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      <h1>Добро пожаловать 👋</h1>

      <p style={{ opacity: 0.7 }}>Мы используем данные вашего Telegram</p>

      <button
        onClick={handleCreate}
        disabled={creating}
        style={{
          marginTop: 24,
          background: "orange",
          color: "#000",
          padding: "14px 22px",
          borderRadius: 14,
          fontSize: 16,
          fontWeight: 600,
          opacity: creating ? 0.6 : 1,
          cursor: creating ? "default" : "pointer",
        }}
      >
        {creating ? "Создаём аккаунт…" : "Создать аккаунт"}
      </button>

      {error && <div style={{ marginTop: 16, color: "red" }}>{error}</div>}
    </div>
  );
};
