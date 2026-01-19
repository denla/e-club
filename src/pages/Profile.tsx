import React from "react";
import type { User } from "../types";
import Tabs from "../features/Tabs/Tabs";

type Props = { user?: User | null };

const LEVELS = [2, 5, 8, 11, 14, 17, 20, 22, 25, 30];

const tabItems = [
  { label: "Home", content: <div>Добро пожаловать на главную страницу!</div> },
  { label: "Profile", content: <div>Здесь ваш профиль.</div> },
  { label: "Settings", content: <div>Настройки приложения.</div> },
];

const Profile: React.FC<Props> = ({ user }) => {
  if (!user) return <div>Загрузка профиля...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Профиль: {user.firstName} {user.lastName}
      </h2>
      <p>Посещено матчей: {user.visitsCount}</p>

      <Tabs tabs={tabItems} />
      <h3>Дорожная карта</h3>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {LEVELS.map((lvl) => {
          const unlocked = user.visitsCount >= lvl;
          return (
            <div
              key={lvl}
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                border: `2px solid ${unlocked ? "#4caf50" : "#ccc"}`,
                background: unlocked ? "#4caf50" : "#eee",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {lvl}
            </div>
          );
        })}
      </div>
      <h3 style={{ marginTop: 20 }}>История подтверждённых матчей</h3>
      {user.visits && user.visits.length > 0 ? (
        <ul>
          {user.visits.map((v, idx) => {
            let dateStr = "Нет даты"; // на случай undefined

            if (v.date) {
              // если это Firestore Timestamp
              if (
                typeof v.date === "object" &&
                "toDate" in v.date &&
                typeof (v.date as any).toDate === "function"
              ) {
                dateStr = (v.date as any).toDate().toLocaleString();
              } else {
                // если уже JS Date или строка
                const d = new Date(v.date as any);
                dateStr = isNaN(d.getTime())
                  ? "Неверная дата"
                  : d.toLocaleString();
              }
            }

            return (
              <li key={idx}>
                Уровень {v.level} — {dateStr}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Нет подтверждённых матчей</p>
      )}
    </div>
  );
};

export default Profile;
