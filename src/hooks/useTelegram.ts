import { useEffect, useState } from "react";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

// Моковый пользователь для локальной разработки вне Telegram
const MOCK_TG_USER: TelegramUser = {
  id: 999999,
  first_name: "Тест",
  last_name: "Пользователь",
  username: "testuser",
  language_code: "ru",
  photo_url: "https://via.placeholder.com/100",
};

interface UseTelegramOptions {
  useMock?: boolean; // включить mock
  autoExpand?: boolean; // автоматически расширять WebApp
}

export function useTelegram({
  useMock = false,
  autoExpand = true,
}: UseTelegramOptions = {}) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [ready, setReady] = useState(false);
  const [isWebApp, setIsWebApp] = useState(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (!tg) {
      console.warn("Это не Telegram WebApp");
      setIsWebApp(false);

      if (useMock) {
        setUser(MOCK_TG_USER);
        setReady(true);
      }

      return;
    }

    setIsWebApp(true);

    // Получаем данные пользователя
    const tgUser: TelegramUser | undefined = tg.initDataUnsafe?.user;

    if (tgUser) {
      setUser(tgUser);
    } else if (useMock) {
      console.warn("Данные пользователя Telegram отсутствуют, используем MOCK");
      setUser(MOCK_TG_USER);
    } else {
      console.warn("Данные пользователя Telegram отсутствуют");
    }

    // Автоматическое расширение WebApp
    if (autoExpand) {
      // Telegram иногда нужно дать время для инициализации
      setTimeout(() => {
        tg.expand();
      }, 100);
    }

    setReady(true);
  }, [useMock, autoExpand]);

  return { user, ready, isWebApp };
}
