import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { User } from "../types";

interface Props {
  tgUser: any;
  onCreated: (user: User) => void;
}

export const WelcomePage: React.FC<Props> = ({ tgUser, onCreated }) => {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

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
      photo_url: tgUser.photo_url ?? "",
      telegram: {
        id: tgUser.id,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name,
        username: tgUser.username,
        language_code: tgUser.language_code,
        photo_url: tgUser.photo_url ?? "",
      },
    };

    await setDoc(doc(db, "users", uid), newUser);

    onCreated(newUser);
  };

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h1>Добро пожаловать 👋</h1>
      <p>Мы используем данные вашего Telegram</p>

      <button
        disabled={loading}
        onClick={handleCreate}
        style={{
          marginTop: 24,
          background: "orange",
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
};
