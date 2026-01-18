// BottomNav.tsx
import styles from "./BottomNav.module.css";
import { Link, useLocation } from "react-router-dom";

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
      <Link to="/users">
        <button className={active === "leaderboard" ? styles.active : ""}>
          🏅
          <span>Лидерборд</span>
        </button>
      </Link>

      <Link to="/admin">
        <button className={active === "admin" ? styles.active : ""}>
          🛠
          <span>Админ</span>
        </button>
      </Link>

      <Link to={profileLink}>
        <button className={active === "profile" ? styles.active : ""}>
          👤
          <span>Профиль</span>
        </button>
      </Link>
    </nav>
  );
};
