import { useEffect, useState } from "react";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [ready, setReady] = useState(false);
  const [isWebApp, setIsWebApp] = useState(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (!tg) {
      console.warn("Это не Telegram WebApp");
      setIsWebApp(false);
      return;
    }

    // Инициализация WebApp
    tg.ready();

    // Получаем данные пользователя
    const tgUser = tg.initDataUnsafe?.user;
    if (tgUser) {
      setUser(tgUser);
    } else {
      console.warn("Данные пользователя Telegram отсутствуют");
    }

    setReady(true);
  }, []);

  return { user, ready, isWebApp };
}
