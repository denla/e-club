import React from "react";
import type { User } from "../types";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const levels: number[] = [2, 5, 8, 11, 14, 17, 20, 22, 25, 30];

export const confirmVisit = async (u: User) => {
  const newCount = u.visitsCount + 1;
  const now = Timestamp.now();

  try {
    const userRef = doc(db, "users", u.uid);
    await updateDoc(userRef, {
      visitsCount: newCount,
      visits: arrayUnion({ level: newCount, date: now }),
      achievements: levels.filter((lvl) => newCount >= lvl),
    });
    alert(`Посещение добавлено: ${u.firstName} ${u.lastName}`);
  } catch (err) {
    console.error("Ошибка обновления пользователя:", err);
  }
};

type Props = {
  users: User[];
  currentUser: User | null;
};

const Admin: React.FC<Props> = ({ users, currentUser }) => {
  // Проверка роли admin
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div style={{ padding: 20 }}>
        Доступ запрещён. Только для администраторов.
      </div>
    );
  }

  const handleConfirm = (user: User) => {
    confirmVisit(user);
  };

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
                onClick={() => handleConfirm(u)}
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
