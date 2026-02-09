export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: TelegramUser;
        };
        ready: () => void;
        expand: () => void;
        openLink: (
          url: string,
          options?: { try_instant_view?: boolean },
        ) => void;
        onEvent: (eventType: string, eventHandler: () => void) => void;
      };
    };
  }

  interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
  }
}
