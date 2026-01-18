import styles from "./LeaderboardPage.module.css";
import { LeaderboardItem } from "../../features/LeaderboardItem/LeaderboardItem";
import { BottomNav } from "../../features/BottomNav/BottomNav";

const mockUsers = Array.from({ length: 7 }).map((_, i) => ({
  id: i,
  name: "Денис Иванов",
  visits: 11,
  rank: 1,
}));

export const LeaderboardPage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>Z</span>
      </header>

      <h1 className={styles.title}>Лидерборд</h1>

      <div className={styles.list}>
        {mockUsers.map((user) => (
          <LeaderboardItem key={user.id} user={user} />
        ))}
      </div>

      <BottomNav active="leaderboard" />
    </div>
  );
};
