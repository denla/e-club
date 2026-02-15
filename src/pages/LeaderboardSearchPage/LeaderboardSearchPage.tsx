// pages/LeaderboardSearchPage/LeaderboardSearchPage.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LeaderboardSearchPage.module.css";
import { LeaderboardItem } from "../../features/LeaderboardItem/LeaderboardItem";
import type { User as AppUser } from "../../types";
import searchIcon from "../../assets/icons/search_icon.svg";
import closeIcon from "../../assets/icons/close_icon.svg";
import AppHeader from "../../features/AppHeader/AppHeader";

type Props = {
  users: AppUser[];
};

export const LeaderboardSearchPage: React.FC<Props> = ({ users }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Сразу фокусируем input при монтировании
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const leaderboardUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => b.visitsCount - a.visitsCount);
  }, [filteredUsers]);

  return (
    <div className={styles.page}>
      <AppHeader />
      <div className={styles.searchHeader}>
        <div className={styles.searchWrapper}>
          <img src={searchIcon} alt="Search" className={styles.leftIcon} />
          <input
            ref={inputRef}
            className={styles.search}
            placeholder="Поиск болельщиков"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <div
              className={styles.clearButton}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setQuery("")}
            >
              <img src={closeIcon} alt="Close" />
            </div>
          )}
        </div>

        <button
          className={styles.closeButton}
          onClick={() => navigate("/users")}
        >
          Закрыть
        </button>
      </div>

      <div className={styles.list}>
        {leaderboardUsers.length > 0 ? (
          leaderboardUsers.map((user, index) => (
            <LeaderboardItem
              key={user.uid}
              user={{ ...user, rank: index + 1 }}
            />
          ))
        ) : (
          <div className={styles.emptyState}>Ничего не найдено</div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardSearchPage;
