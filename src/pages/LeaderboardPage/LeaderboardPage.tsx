import styles from "./LeaderboardPage.module.css";
import { LeaderboardItem } from "../../features/LeaderboardItem/LeaderboardItem";
import type { User as AppUser } from "../../types";

type Props = {
  users: AppUser[];
};

export const LeaderboardPage: React.FC<Props> = ({ users }) => {
  // Сортируем пользователей по количеству посещений и добавляем rank
  const leaderboardUsers = [...users].sort(
    (a, b) => b.visitsCount - a.visitsCount,
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>Electron App</span>
      </header>

      <h1 className={styles.title}>Лидерборд</h1>

      <div className={styles.list}>
        {leaderboardUsers.map((user, index) => (
          <LeaderboardItem
            key={user.uid}
            user={{ ...user, rank: index + 1 }} // добавляем rank
          />
        ))}
      </div>
    </div>
  );
};
