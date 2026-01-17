import { useEffect, useState } from "react";

export default function Login() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (!tg) {
      alert("ЭТО НЕ TELEGRAM WEBAPP");
      return;
    }

    tg.ready();
    setUser(tg.initDataUnsafe.user);
  }, []);

  if (!user) return <div>Ждём данные…</div>;

  return (
    <div>
      <h2>Telegram User</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
