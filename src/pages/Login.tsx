import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useTelegram } from "../hooks/useTelegram";
import type { User } from "../types";

export default function Login({
  onUserLoaded,
}: {
  onUserLoaded: (user: User) => void;
}) {
  const { user: tgUser } = useTelegram();

  const handleLogin = async () => {
    if (!tgUser) return;

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

    await setDoc(doc(db, "users", uid), newUser);
    onUserLoaded(newUser);
  };

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h1>Добро пожаловать 👋</h1>
      <p>Войдите, чтобы начать</p>

      <button onClick={handleLogin}>Войти через Telegram</button>
    </div>
  );
}
