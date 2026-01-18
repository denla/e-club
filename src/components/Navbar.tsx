import React from "react";
import { Link } from "react-router-dom";
import type { User } from "../types";

type Props = {
  currentUser: User | null;
  onLogout?: () => void;
};

const Navbar: React.FC<Props> = ({ currentUser, onLogout }) => {
  return (
    <nav style={{ padding: 10, background: "#f0f0f0", marginBottom: 20 }}>
      <Link to="/users" style={{ marginRight: 15 }}>
        Пользователи
      </Link>
      <Link to="/admin" style={{ marginRight: 15 }}>
        Админ
      </Link>
      {currentUser ? (
        <span style={{ float: "right" }}>
          Привет, {currentUser.firstName}
          <button onClick={onLogout} style={{ marginLeft: 10 }}>
            Выйти
          </button>
        </span>
      ) : (
        <Link to="/login" style={{ float: "right" }}>
          Вход
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
