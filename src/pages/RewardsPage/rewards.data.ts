import type { ClubReward } from "../../types/reward";
import Pin from "../../assets/images/rewards/pin.png";
import Mug from "../../assets/images/rewards/mug.png";
import Poster from "../../assets/images/rewards/poster.png";
import Scarf from "../../assets/images/rewards/scarf.png";
// import Photoshoot from "../../assets/images/rewards/camera.png";
import TShirt from "../../assets/images/rewards/tshirt.png";
// import Medal from "../../assets/images/rewards/medal.png";
// import TrainingPlan from "../../assets/images/rewards/cup_white.png";
import AlumniCard from "../../assets/images/rewards/card_white.png";
import PhotoCard from "../../assets/images/rewards/photo_cards.png";
import Thanks from "../../assets/images/rewards/thanks.png";
import List from "../../assets/images/rewards/list.png";

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
