import { useRef, useState, useMemo } from "react";
import styles from "./LeaderboardPage.module.css";
import { LeaderboardItem } from "../../features/LeaderboardItem/LeaderboardItem";
import type { User as AppUser } from "../../types";

import searchIcon from "../../assets/icons/search_icon.svg";
import closeIcon from "../../assets/icons/close_icon.svg";
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

  // Режим активного поиска
  const isSearchActive = isSearchFocused || query.length > 0;

  // Фильтрация пользователей
  const filteredUsers = useMemo(() => {
    const search = query.toLowerCase().trim();
    if (!search) return users;

    return users.filter((user) => {
      const fullText = [user.firstName, user.lastName, user.telegram?.username]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return fullText.includes(search);
    });
  }, [users, query]);

  // Сортировка по visitsCount
  const leaderboardUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => b.visitsCount - a.visitsCount);
  }, [filteredUsers]);

  // Очистка поиска
  const exitSearch = () => {
    setQuery("");
    setIsSearchFocused(false);
    inputRef.current?.blur();
  };

  return (
    <div
      className={`${styles.page} ${isSearchActive ? styles.noBackground : ""}`}
    >
      {/* Верхняя часть */}
      <div
        className={`${styles.top} ${isSearchActive ? styles.collapsed : ""}`}
      >
        <AppHeader />

        <div className={styles.topContent}>
          Лучшие <span>болельщики</span>
        </div>

        <InfoCard
          title="Поднимайся в общем рейтинге"
          subtitle="Зарабатывай очки за активность и занимай первые строки"
          image={infocard_cup}
          buttonText="Узнать больше"
          onClick={() =>
            alert("Здесь будет подробная информация о топе болельщиков!")
          }
        />
      </div>

      {/* Список */}
      <div className={styles.list}>
        <div
          className={`${styles.searchWrapper} ${
            isSearchActive ? styles.focused : ""
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
          />

          {/* Кнопка очистки */}
          {isSearchActive && (
            <div
              className={styles.clearButton}
              onMouseDown={(e) => e.preventDefault()}
              onClick={exitSearch}
            >
              <img src={closeIcon} alt="Close" />
            </div>
          )}
        </div>

        {leaderboardUsers.map((user, index) => (
          <LeaderboardItem key={user.uid} user={{ ...user, rank: index + 1 }} />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
