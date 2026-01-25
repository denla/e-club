import { Link } from "react-router-dom";
import styles from "./LeaderboardItem.module.css";

// Интерфейс пользователя для LeaderboardItem
interface Telegram {
  username?: string;
  photo_url?: string;
}

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  visitsCount: number;
  rank: number;
  telegram?: Telegram;
}

interface Props {
  user: User;
}

export const LeaderboardItem: React.FC<Props> = ({ user }) => {
  const avatarUrl = user.telegram?.photo_url;

  return (
    <Link to={`/users/${user.uid}`} className={styles.link}>
      <div className={styles.item}>
        <div className={styles.count}>{user.rank}</div>
        <div className={styles.left}>
          {/* Аватар */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatar}>{user.firstName[0]}</div>
          )}

          {/* Информация о пользователе */}
          <div className={styles.info}>
            <div className={styles.name}>
              {user.firstName} {user.lastName}
            </div>
            <div className={styles.sub}>{user.telegram?.username}</div>
          </div>
        </div>

        {/* Ранг */}
        <div className={styles.xpBadge}>{user.visitsCount * 10} XP</div>
      </div>
    </Link>
  );
};
