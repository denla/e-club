import styles from "./BottomNav.module.css";

interface Props {
  active: "leaderboard" | "profile";
}

export const BottomNav = ({ active }: Props) => {
  return (
    <nav className={styles.nav}>
      <button className={active === "leaderboard" ? styles.active : ""}>
        🏅
        <span>Лидерборд</span>
      </button>

      <button className={active === "profile" ? styles.active : ""}>
        👤
        <span>Профиль</span>
      </button>
    </nav>
  );
};
