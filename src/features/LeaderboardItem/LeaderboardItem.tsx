import { Link } from "react-router-dom";
import styles from "./LeaderboardItem.module.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState } from "react";

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
  const [loaded, setLoaded] = useState(false);

  return (
    <Link to={`/users/${user.uid}`} className={styles.link}>
      <div className={styles.item}>
        <div className={styles.count}>{user.rank}</div>
        <div className={styles.left}>
          {/* Аватар */}
          {avatarUrl ? (
            <SkeletonTheme
              baseColor="#292929" // тёмный фон скелета
              highlightColor="#3a3a3a" // светлее для "шейдинга"
            >
              {!loaded && <Skeleton circle width={48} height={48} />}
              <img
                src={avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className={styles.avatarImage}
                style={{
                  display: loaded ? "block" : "none",
                  transition: "opacity 0.3s ease",
                  opacity: loaded ? 1 : 0,
                }}
                onLoad={() => setLoaded(true)}
              />
            </SkeletonTheme>
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
        <div className={styles.xpBadge}>{user.visitsCount} LVL</div>
      </div>
    </Link>
  );
};
