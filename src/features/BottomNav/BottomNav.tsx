// BottomNav.tsx
import styles from "./BottomNav.module.css";
import { Link, useLocation } from "react-router-dom";

import leaderboardIcon from "../../assets/icons/BottomNav/leader_icon.svg";
import profileIcon from "../../assets/icons/BottomNav/profile_icon.svg";
import plusIcon from "../../assets/icons/BottomNav/plus_button.svg";
import rewardsIcon from "../../assets/icons/BottomNav/rewards_icon.svg";

interface Props {
  uid?: string;
}
export const BottomNav = ({ uid }: Props) => {
  const location = useLocation();
  const profileLink = uid ? `/users/${uid}` : "/users";

  let active: "leaderboard" | "profile" | "rewards" = "leaderboard";

  if (location.pathname.startsWith("/users/")) active = "profile";
  else if (location.pathname.startsWith("/rewards")) active = "rewards";
  else if (location.pathname === "/users") active = "leaderboard";

  const showPlusButton = location.pathname !== "/request"; // скрываем на /request

  return (
    <nav className={styles.nav}>
      {showPlusButton && (
        <div className={styles.plusButtonWrapper}>
          <Link to="/request" className={styles.small}>
            <button className={styles.plusButton}>
              <img src={plusIcon} alt="Visit" />
              <span>Посещение</span>
            </button>
          </Link>
        </div>
      )}

      {/* Лидерборд */}
      <Link to="/users" className={styles.link}>
        <button
          className={`${styles.bottomTab} ${
            active === "leaderboard" ? styles.active : ""
          }`}
        >
          <img src={leaderboardIcon} alt="leaderboard" />
          <span>Топ лидеров</span>
        </button>
      </Link>

      {/* Призы */}
      <Link to="/rewards" className={styles.link}>
        <button
          className={`${styles.bottomTab} ${
            active === "rewards" ? styles.active : ""
          }`}
        >
          <img src={rewardsIcon} alt="Rewards" />
          <span>Призы</span>
        </button>
      </Link>

      {/* Профиль */}
      <Link to={profileLink} className={styles.link}>
        <button
          className={`${styles.bottomTab} ${
            active === "profile" ? styles.active : ""
          }`}
        >
          <img src={profileIcon} alt="Profile" />
          <span>Профиль</span>
        </button>
      </Link>
    </nav>
  );
};
