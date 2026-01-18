import { Link } from "react-router-dom";
import styles from "./LeaderboardItem.module.css";

interface User {
  uid: string;
  name: string;
  visits: number;
  rank: number;
}

interface Props {
  user: User;
}

export const LeaderboardItem = ({ user }: Props) => {
  return (
    <Link to={`/users/${user.uid}`} className={styles.link}>
      <div className={styles.item}>
        <div className={styles.left}>
          <div className={styles.avatar}>{user.name.slice(0, 1)}</div>

          <div className={styles.info}>
            <div className={styles.name}>{user.name}</div>
            <div className={styles.sub}>{user.visits} посещений</div>
          </div>
        </div>

        <div className={styles.rank}>#{user.rank}</div>
      </div>
    </Link>
  );
};
