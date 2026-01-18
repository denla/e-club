import styles from "./LeaderboardItem.module.css";

interface User {
  name: string;
  visits: number;
  rank: number;
}

interface Props {
  user: User;
}

export const LeaderboardItem = ({ user }: Props) => {
  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <div className={styles.avatar}>Д</div>

        <div className={styles.info}>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.sub}>{user.visits} посещений</div>
        </div>
      </div>

      <div className={styles.rank}>#{user.rank}</div>
    </div>
  );
};
