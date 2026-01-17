import React from "react";
import { Link } from "react-router-dom";
import type { User } from "../types";

type Props = { users: User[] };

const UsersList: React.FC<Props> = ({ users }) => {
  if (!users || users.length === 0) return <div>Загрузка пользователей...</div>;
  const fans = users.filter((u) => u.role === "fan");

  return (
    <div style={{ padding: 20 }}>
      <h2>Все пользователи</h2>
      {fans.map((u) => (
        <div key={u.uid} style={{ marginBottom: 10 }}>
          <Link
            to={`/users/${u.uid}`}
            style={{ textDecoration: "none", color: "blue" }}
          >
            {u.firstName} {u.lastName} — {u.visitsCount} матчей
          </Link>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
