import styles from "./LeaderboardPage.module.css";
import { LeaderboardItem } from "../../features/LeaderboardItem/LeaderboardItem";
import type { User as AppUser } from "../../types";

type Props = {
  users: AppUser[];
};

export const LeaderboardPage: React.FC<Props> = ({ users }) => {
  const leaderboardUsers = [...users]
    .sort((a, b) => b.visitsCount - a.visitsCount)
    .map((user, index) => ({
      uid: user.uid,
      name: `${user.firstName} ${user.lastName}`,
      visits: user.visitsCount,
      rank: index + 1,
    }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>Electron App</span>
      </header>

      <h1 className={styles.title}>Лидерборд</h1>

      <div className={styles.list}>
        {leaderboardUsers.map((user) => (
          <LeaderboardItem key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};
