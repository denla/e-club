export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export type User = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "fan" | "admin";
  visitsCount: number;
  achievements: number[];
  merchReceived: Record<string, boolean>;
  visits: { level: number; date: any }[];
  avatar?: string;
  telegram?: TelegramUser; // добавляем сюда
};
