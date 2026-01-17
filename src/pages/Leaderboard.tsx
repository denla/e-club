import React from "react";
import type { User } from "../types";

type Props = { users: User[] };

const Leaderboard: React.FC<Props> = ({ users }) => {
  const sorted = [...users]
    .filter((u) => u.role === "fan")
    .sort((a, b) => b.visitsCount - a.visitsCount);
  return (
    <div style={{ padding: "20px" }}>
      <h2>Топ болельщиков</h2>
      <ol>
        {sorted.map((u) => (
          <li key={u.id}>
            {u.firstName} {u.lastName} — {u.visitsCount} матчей
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
