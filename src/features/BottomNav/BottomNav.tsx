// BottomNav.tsx
import styles from "./BottomNav.module.css";
import { Link, useLocation } from "react-router-dom";

import leaderboardIcon from "../../assets/icons/BottomNav/leader_icon.svg";
import profileIcon from "../../assets/icons/BottomNav/profile_icon.svg";
import adminIcon from "../../assets/icons/BottomNav/admin_icon.svg";

interface Props {
  uid?: string; // uid текущего пользователя
}

export const BottomNav = ({ uid }: Props) => {
  const location = useLocation();
  //   const profileLink = uid ? `/users/${uid}` : "/login";
  const profileLink = uid ? `/users/${uid}` : "/users";

  let active: "leaderboard" | "profile" | "admin" = "leaderboard";
  if (location.pathname.startsWith("/admin")) active = "admin";
  else if (location.pathname.startsWith("/users/")) active = "profile";
  else if (location.pathname === "/users") active = "leaderboard";

  return (
    <nav className={styles.nav}>
      <Link to="/users" className={styles.link}>
        <button className={active === "leaderboard" ? styles.active : ""}>
          <img src={leaderboardIcon} alt="leaderboard" />
          <span>Лидерборд</span>
        </button>
      </Link>

      <Link to="/admin" className={styles.link}>
        <button className={active === "admin" ? styles.active : ""}>
          <img src={adminIcon} alt="Admin" />
          <span>Админ</span>
        </button>
      </Link>

      <Link to={profileLink} className={styles.link}>
        <button className={active === "profile" ? styles.active : ""}>
          <img src={profileIcon} alt="Profile" />
          <span>Профиль</span>
        </button>
      </Link>
    </nav>
  );
};
