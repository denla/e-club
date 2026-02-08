import { useRef, useState } from "react";
import styles from "./LeaderboardPage.module.css";
import { LeaderboardItem } from "../../features/LeaderboardItem/LeaderboardItem";
import type { User as AppUser } from "../../types";

import searchIcon from "../../assets/icons/search_icon.svg";
import closeIcon from "../../assets/icons/close_icon.svg";
// import cupImg from "../../assets/images/welcome/welcome_img1.png";
import infocard_cup from "../../assets/images/info/infocard_cup.png";

import AppHeader from "../../features/AppHeader/AppHeader";
import { InfoCard } from "../../features/InfoCard/InfoCard";

type Props = {
  users: AppUser[];
};

export const LeaderboardPage: React.FC<Props> = ({ users }) => {
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Фильтрация пользователей
  const filteredUsers = users.filter((user) => {
    const search = query.toLowerCase().trim();
    if (!search) return true;

    const fullText = [user.firstName, user.lastName, user.telegram?.username]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return fullText.includes(search);
  });

  const leaderboardUsers = [...filteredUsers].sort(
    (a, b) => b.visitsCount - a.visitsCount,
  );

  // Выход из режима поиска (кнопка ✕)
  const exitSearch = () => {
    setQuery("");
    inputRef.current?.blur();
    setIsSearchFocused(false);
  };

  return (
    <div className={styles.page}>
      {/* Верхняя часть с анимацией */}
      <div
        className={`${styles.top} ${isSearchFocused ? styles.collapsed : ""}`}
      >
        {/* <header className={styles.header}>
          <span className={styles.logo}>Electron App</span>
        </header> */}

        <AppHeader align="left" />
        <div className={styles.topContent}>
          Лучшие <span>болельщики</span>
        </div>

        <InfoCard
          title="Поднимайся в общем рейтинге"
          subtitle="Зарабатывай очки за активность и занимай первые строки"
          image={infocard_cup}
          buttonText="Узнать больше"
          onClick={() =>
            alert("Здесь будет подробная информация о топе болельщиков!")
          }
        />
        {/* <div className={styles.topContent}>
          <img src={cupImg} alt="Cup" className={styles.topImg} />
          <div className={styles.topHeader}>Топ болельщиков</div>
          <div className={styles.topDescription}>
            Зарабатывай очки за активность
            <br /> и поднимайся в общем рейтинге
          </div>
        </div> */}
      </div>

      {/* Список пользователей */}
      <div className={styles.list}>
        {/* Поле поиска с иконками */}

        <div
          className={`${styles.searchWrapper} ${
            isSearchFocused ? styles.focused : ""
          }`}
        >
          {/* Левая иконка */}
          <img src={searchIcon} alt="Search" className={styles.leftIcon} />

          {/* Input */}
          <input
            ref={inputRef}
            className={styles.search}
            placeholder="Поиск болельщиков"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              // небольшой таймаут чтобы клик по кресту успел сработать
              setTimeout(() => setIsSearchFocused(false), 50);
            }}
          />

          {/* Правая кнопка очистки */}
          {isSearchFocused && (
            <div
              className={styles.clearButton}
              onMouseDown={(e) => e.preventDefault()}
              onClick={exitSearch}
            >
              <img src={closeIcon} alt="Close" />
            </div>
          )}
        </div>

        {/* <h1 className={styles.cardHeader}>Лидерборд</h1> */}
        {leaderboardUsers.map((user, index) => (
          <LeaderboardItem key={user.uid} user={{ ...user, rank: index + 1 }} />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
