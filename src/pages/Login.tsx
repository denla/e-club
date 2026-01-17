import { useTelegram } from "../hooks/useTelegram";

export default function Login() {
  const { user, ready, isWebApp } = useTelegram();

  if (!isWebApp) {
    return (
      <div>Пожалуйста, откройте это приложение через Telegram WebApp.</div>
    );
  }

  if (!ready) return <div>Инициализация Telegram WebApp…</div>;
  if (!user) return <div>Данные пользователя не получены.</div>;

  return (
    <div>
      <h2>Telegram User</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
