import type { ClubReward } from "../../types/reward";
import Pin from "../../assets/images/rewards/pin.webp";
import Mug from "../../assets/images/rewards/mug.webp";
import Poster from "../../assets/images/rewards/poster.webp";
import Scarf from "../../assets/images/rewards/scarf.webp";
// import Photoshoot from "../../assets/images/rewards/camera.webp";
import TShirt from "../../assets/images/rewards/tshirt.webp";
// import Medal from "../../assets/images/rewards/medal.webp";
// import TrainingPlan from "../../assets/images/rewards/cup_white.webp";
import AlumniCard from "../../assets/images/rewards/card_white.webp";
import PhotoCard from "../../assets/images/rewards/photo_cards.webp";
import Thanks from "../../assets/images/rewards/thanks.webp";
import List from "../../assets/images/rewards/list.webp";

export const CLUB_REWARDS: ClubReward[] = [
  {
    id: "lvl_2",
    level: 2,
    title: "Первый уровень болельщика",
    reward: "Браслет + значок + наклейка",
    img: Pin,
  },
  {
    id: "lvl_5",
    level: 5,
    title: "Активный болельщик",
    reward: "Кружка или термокружка",
    img: Mug,
  },
  {
    id: "lvl_8",
    level: 8,
    title: "Энергия ягуара",
    reward: "Постер с ягуаром Электроном",
    img: Poster,
  },
  {
    id: "lvl_11",
    level: 11,
    title: "Тёплая поддержка",
    reward: "Шарф Электрона",
    img: Scarf,
  },
  {
    id: "lvl_14",
    level: 14,
    title: "Лицо клуба",
    reward: "Персональная фотосессия с ягуаром Электроном",
    img: PhotoCard,
  },
  {
    id: "lvl_17",
    level: 17,
    title: "Командный стиль",
    reward: "Футболка Электрона",
    img: TShirt,
  },
  {
    id: "lvl_20",
    level: 20,
    title: "Лучший болельщик Электрона",
    reward: "Медаль или кубок + благодарственное письмо",
    img: Thanks,
  },
  {
    id: "lvl_22",
    level: 22,
    title: "Персональный рост",
    reward: "Персональный план тренировок от Электрона",
    img: List,
  },
  {
    id: "lvl_25",
    level: 25,
    title: "Ассоциация выпускников",
    reward: "Карта ассоциации выпускников",
    img: AlumniCard,
  },
];
