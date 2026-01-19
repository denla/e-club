import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  tgUser: any;
  onCreated: (user: any) => void;
}

export default function WelcomePage({ tgUser, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!tgUser) return;

    try {
      setLoading(true);
      setError(null);

      const uid = String(tgUser.id);

      const userData = {
        id: uid,
        email: tgUser.username ? `${tgUser.username}@telegram` : "",
        createdAt: Date.now(),

        telegram: {
          id: tgUser.id,
          first_name: tgUser.first_name || "",
          last_name: tgUser.last_name || "",
          username: tgUser.username ?? null,
          language_code: tgUser.language_code ?? null,
          photo_url: tgUser.photo_url ?? "",
        },
      };

      await setDoc(doc(db, "users", uid), userData);

      onCreated(userData);
    } catch (e) {
      console.error("Ошибка создания аккаунта", e);
      setError("Не удалось создать аккаунт");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1>Добро пожаловать 👋</h1>
      <p>Мы используем данные вашего Telegram</p>

      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

      <button
        onClick={handleCreate}
        disabled={loading}
        style={{
          marginTop: 24,
          background: "#ff9800",
          color: "#000",
          padding: "12px 20px",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 600,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Создаём аккаунт…" : "Создать аккаунт"}
      </button>
    </div>
  );
}
