import { useEffect, useRef, useState } from "react";
import styles from "./WelcomeSlider.module.css";
import logo from "../../assets/logo/logo.svg";
import welcome_img1 from "../../assets/images/welcome/welcome_img1.png";
import welcome_img2 from "../../assets/images/welcome/welcome_img2.png";
import welcome_img3 from "../../assets/images/welcome/welcome_img3.png";

const SLIDE_DURATION = 5000;

const slides = [
  {
    title: "Становись первым",
    text: "Зарабатывай очки за активность, поднимайся в рейтинге и докажи, что ты самый преданный фанат клуба.",
    image: welcome_img1,
  },
  {
    title: "Открывай ачивки",
    text: "Посещай матчи, участвуй в челленджах и собирай уникальные достижения за поддержку команды.",
    image: welcome_img2,
  },
  {
    title: "Получай призы",
    text: "Обменивай очки на мерч, билеты, эксклюзивные встречи с игроками и другие награды от клуба.",
    image: welcome_img3,
  },
];

export const WelcomeSlider: React.FC<Props> = ({
  onCreateAccount,
  tgReady,
}) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startX = useRef<number | null>(null);

  // autoplay + progress
  useEffect(() => {
    setProgress(0);
    const start = Date.now();

    const interval = setInterval(() => {
      const delta = Date.now() - start;
      setProgress(Math.min(delta / SLIDE_DURATION, 1));
    }, 16);

    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
      <header className={styles.header}>
        <img src={logo} className={styles.logoImage} />
        <span className={styles.badge}>FANS</span>
      </header>

      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className={styles.slide} key={i}>
              <div className={styles.img_wrapper}>
                <img
                  key={index} // <-- ключ заставит React заново отрендерить img и проиграть анимацию
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
                  className={styles.progress}
                  style={{ transform: `scaleX(${progress})` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <button
        className={styles.button}
        onClick={tgReady ? onCreateAccount : undefined}
      >
        Стать болельщиком
      </button>
    </div>
  );
};

import React from "react";

type Props = {
  onCreateAccount: () => Promise<void>;
  tgReady: boolean;
};

const WelcomePage: React.FC<Props> = ({ onCreateAccount, tgReady }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1>Добро пожаловать 👋</h1>
      <p style={{ marginBottom: 24 }}>
        Это ваш первый вход. Создайте аккаунт, чтобы продолжить.
      </p>

      <button
        onClick={tgReady ? onCreateAccount : undefined}
        style={{
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          background: "#2ea6ff",
          color: "#fff",
          cursor: tgReady ? "pointer" : "not-allowed",
          opacity: tgReady ? 1 : 0.5,
        }}
      >
        Создать аккаунт
      </button>
    </div>
  );
};

export default WelcomePage;
