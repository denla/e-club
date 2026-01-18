import React from "react";
import type { User } from "../types";
import { useCurrentUser } from "../hooks/useCurrentUser";

type Props = {
  users: User[];
  tgId: number | null; // Telegram ID текущего пользователя
};

function confirmVisit(user: User) {
  // Здесь логика подтверждения визита
  alert(`Визит пользователя ${user.firstName} ${user.lastName} подтверждён!`);
}

const Admin: React.FC<Props> = ({ users, tgId }) => {
  const { currentUser, loading } = useCurrentUser(tgId);

  if (loading) return <div>Загрузка данных пользователя…</div>;

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div style={{ padding: 20 }}>
        Доступ запрещён. Только для администраторов.
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Панель администратора</h2>
      {users.length === 0 ? (
        <p>Нет пользователей</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.uid}>
              {u.firstName} {u.lastName} — {u.visitsCount} матчей
              <button
                onClick={() => confirmVisit(u)}
                style={{ marginLeft: 10 }}
              >
                Подтвердить визит
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Admin;
