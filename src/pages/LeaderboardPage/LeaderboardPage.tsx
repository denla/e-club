import { useMemo } from "react";
import styles from "./LeaderboardPage.module.css";
import { LeaderboardItem } from "../../features/LeaderboardItem/LeaderboardItem";
import type { User as AppUser } from "../../types";
import AppHeader from "../../features/AppHeader/AppHeader";
import { InfoCard } from "../../features/InfoCard/InfoCard";
import infocard_cup from "../../assets/images/info/infocard_cup.png";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/icons/search_icon.svg";

type Props = {
  users: AppUser[];
  uid?: string;
};

export const LeaderboardPage: React.FC<Props> = ({ users, uid }) => {
  const navigate = useNavigate();
  const profileLink = uid ? `/users/${uid}` : "/users";

  // Сортировка по visitsCount
  const leaderboardUsers = useMemo(() => {
    return [...users].sort((a, b) => b.visitsCount - a.visitsCount);
  }, [users]);

  return (
    <div className={styles.page}>
      <AppHeader title="Топ лидеров" />

      <div className={styles.top}>
        <div className={styles.topContent}>
          Лучшие <span>болельщики</span>
        </div>

        <InfoCard
          title="Поднимайся в общем рейтинге"
          subtitle="Зарабатывай очки за активность и занимай первые строки"
          image={infocard_cup}
          buttonText="К ачивкам"
          onClick={() => navigate(profileLink)}
        />
      </div>

      {/* Поиск — просто переход на новую страницу */}
      <div className={styles.list}>
        <div
          className={styles.searchWrapper}
          onClick={() => navigate("/users/search")}
          style={{ cursor: "pointer" }}
        >
          <img src={searchIcon} alt="Search" className={styles.leftIcon} />
          <input
            className={styles.search}
            placeholder="Поиск болельщиков"
            readOnly
          />
        </div>

        {leaderboardUsers.map((user, index) => (
          <LeaderboardItem key={user.uid} user={{ ...user, rank: index + 1 }} />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
