export type ClubReward = {
  id: string;
  level: number; // сколько посещений нужно
  title: string;
  reward: string; // что получает пользователь
  img?: string; // картинка приза
};
