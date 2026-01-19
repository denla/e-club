import React, { useState } from "react";
import styled from "styled-components";
import type { User } from "../../types";

import { Avatar } from "../../components/Avatar";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { useNavigate } from "react-router-dom";

/* =========================
   CONSTANTS
========================= */

const LEVELS = [2, 5, 8, 11, 14, 17, 20, 22, 25, 30];

type TabType = "achievements" | "history";

interface Props {
  user?: User | null;
  currentUser?: User | null;
}

/* =========================
   COMPONENT
========================= */

export const ProfilePage: React.FC<Props> = ({ user, currentUser }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [editing, setEditing] = useState(false);

  const [tab, setTab] = useState<TabType>("achievements");

  if (!user) {
    return <Center>Загрузка профиля...</Center>;
  }

  const isOwnProfile = currentUser?.uid === user.uid;

  const saveName = async () => {
    if (!user) return;

    try {
      // сохраняем в Firestore
      await setDoc(doc(db, "users", user.uid), {
        ...user,
        firstName,
        lastName,
      });
      setEditing(false);
      alert("Имя успешно сохранено!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении имени");
    }
  };

  return (
    <Page>
      {/* ===== HEADER ===== */}
      <Header>
        <Avatar user={user} />
        <Name>
          {editing ? (
            <>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Имя"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Фамилия"
              />
              <button onClick={saveName}>Сохранить</button>
              <button onClick={() => setEditing(false)}>Отмена</button>
            </>
          ) : (
            <>
              {firstName} {lastName}
              {isOwnProfile && (
                <button onClick={() => setEditing(true)}>✏️</button>
              )}
            </>
          )}
        </Name>

        {isOwnProfile && (
          <button onClick={() => navigate("/request")}>Создать заявку</button>
        )}

        {user.telegram?.username && (
          <a href={`https://t.me/${user.telegram?.username}`}>
            @{user.telegram?.username}
          </a>
        )}
        <Stats>
          <StatCard>
            <StatValue>{user.visitsCount}</StatValue>
            <StatLabel>посещений</StatLabel>
          </StatCard>
        </Stats>
      </Header>

      {/* ===== TABS ===== */}
      <Tabs>
        <TabButton
          active={tab === "achievements"}
          onClick={() => setTab("achievements")}
        >
          Достижения
        </TabButton>
        <TabButton active={tab === "history"} onClick={() => setTab("history")}>
          История
        </TabButton>
      </Tabs>

      {/* ===== ACHIEVEMENTS ===== */}
      {tab === "achievements" && (
        <AchievementsGrid>
          {LEVELS.map((level) => {
            const unlocked = user.visitsCount >= level;

            return (
              <AchievementCard key={level} active={unlocked}>
                <AchievementBadge active={unlocked}>{level}</AchievementBadge>
              </AchievementCard>
            );
          })}
        </AchievementsGrid>
      )}

      {/* ===== HISTORY ===== */}
      {tab === "history" && (
        <History>
          {user.visits && user.visits.length > 0 ? (
            <ul>
              {user.visits.map((v, idx) => {
                let dateStr = "Нет даты";

                if (v.date) {
                  if (
                    typeof v.date === "object" &&
                    "toDate" in v.date &&
                    typeof (v.date as any).toDate === "function"
                  ) {
                    dateStr = (v.date as any).toDate().toLocaleString();
                  } else {
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
            <Muted>Нет подтверждённых матчей</Muted>
          )}
        </History>
      )}
    </Page>
  );
};

/* =========================
   STYLES
========================= */

const Page = styled.div`
  width: 100vw;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px 80px;
  min-height: 100vh;
`;

const Center = styled.div`
  padding: 32px;
  text-align: center;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

// const Avatar = styled.div`
//   width: 72px;
//   height: 72px;
//   margin: 0 auto 12px;
//   border-radius: 50%;
//   background: #777;
//   display: grid;
//   place-items: center;
//   font-size: 32px;
//   font-weight: 600;
// `;

const Name = styled.h2`
  margin: 0 0 16px;
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 12px 24px;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
`;

/* ===== Tabs ===== */

const Tabs = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  margin: 24px 0;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px 0;
  border-radius: 20px;
  font-weight: 500;
  background: ${({ active }) => (active ? "#fff" : "transparent")};
  color: ${({ active }) => (active ? "#000" : "#fff")};
`;

/* ===== Achievements ===== */

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
`;

const AchievementCard = styled.div<{ active: boolean }>`
  opacity: ${({ active }) => (active ? 1 : 0.3)};
`;

const AchievementBadge = styled.div<{ active: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ active, theme }) =>
    active ? theme.colors.accent : theme.colors.inactive};
  display: grid;
  place-items: center;
  font-weight: 700;
  margin: 0 auto;
`;

/* ===== History ===== */

const History = styled.div`
  font-size: 14px;

  ul {
    padding-left: 16px;
  }

  li {
    margin-bottom: 6px;
  }
`;

const Muted = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
`;
