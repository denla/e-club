import { useEffect, useRef, useState } from "react";
import styles from "./WelcomeSlider.module.css";
import welcome_img1 from "../../assets/images/welcome/welcome_img1.png";
import welcome_img2 from "../../assets/images/welcome/welcome_img2.png";
import welcome_img3 from "../../assets/images/welcome/welcome_img3.png";
import { AppButton } from "../AppButton/AppButton";
import AppHeader from "../AppHeader/AppHeader";

const SLIDE_DURATION = 5000;

const slides = [
  {
    title: "Становись первым",
    text: "Зарабатывай очки за активность, поднимайся в рейтинге и докажи, что ты самый преданный фанат клуба.",
    image: welcome_img1,
  },
  {
    title: "Открывай ачивки",
    text: "Посещай матчи и собирай уникальные достижения за поддержку команды.",
    image: welcome_img2,
  },
  {
    title: "Получай призы",
    text: "Получай поощрения за посещения матчей: мерч и персональные награды от клуба.",
    image: welcome_img3,
  },
];

type Props = {
  onCreateAccount: () => Promise<void>;
  tgReady: boolean;
};

export const WelcomeSlider: React.FC<Props> = ({
  onCreateAccount,
  tgReady,
}) => {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  // autoplay (без прогресса в state!)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearTimeout(timeout);
  }, [index]);

  // swipe
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;

    const diff = startX.current - e.changedTouches[0].clientX;

    if (diff > 50) {
      setIndex((i) => (i + 1) % slides.length);
    }

    if (diff < -50) {
      setIndex((i) => (i - 1 + slides.length) % slides.length);
    }

    startX.current = null;
  };

  return (
    <div
      className={styles.wrapper}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AppHeader />

      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className={styles.slide} key={i}>
              <div className={styles.img_wrapper}>
                <img
                  key={index} // перезапуск анимации картинки
                  src={slide.image}
                  className={styles.image}
                  alt={slide.title}
                />
              </div>

              <h1 className={styles.title}>{slide.title}</h1>
              <p className={styles.text}>{slide.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.indicators}>
        {slides.map((_, i) => {
          const isActive = i === index;

          return (
            <button
              key={i}
              className={`${styles.indicator} ${isActive ? styles.active : ""}`}
              onClick={() => setIndex(i)}
            >
              {isActive && (
                <div
                  key={index} // перезапуск CSS-анимации
                  className={styles.progress}
                />
              )}
            </button>
          );
        })}
      </div>

      <AppButton
        size="wide"
        variant="orange"
        onClick={onCreateAccount}
        disabled={!tgReady}
      >
        Стать болельщиком
      </AppButton>
    </div>
  );
};
