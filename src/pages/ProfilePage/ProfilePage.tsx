import React, { useState } from "react";
import styled from "styled-components";
import type { User } from "../../types";

import { Avatar } from "../../components/Avatar";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

import EmptyImg from "../../assets/images/empty.png";

import AchievmentActivel2 from "../../assets/images/achievments/2_active.png";
import AchievmentInactive2 from "../../assets/images/achievments/2_inactive.png";

import AchievmentActivel5 from "../../assets/images/achievments/5_active.png";
import AchievmentInactive5 from "../../assets/images/achievments/5_inactive.png";

/* =========================
   HELPERS
========================= */

const formatDateTime = (date: Date) =>
  date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* =========================
   ACHIEVEMENTS
========================= */

const ACHIEVEMENTS = [
  {
    id: "lvl_2",
    title: "Новичок",
    level: 2,
    activeIcon: AchievmentActivel2,
    inactiveIcon: AchievmentInactive2,
  },
  {
    id: "lvl_5",
    title: "Свой парень",
    level: 5,
    activeIcon: AchievmentActivel5,
    inactiveIcon: AchievmentInactive5,
  },
  {
    id: "lvl_8",
    title: "Постоянный гость",
    level: 8,
    activeIcon: AchievmentActivel2,
    inactiveIcon: AchievmentInactive2,
  },
  {
    id: "lvl_11",
    title: "Опытный",
    level: 11,
    activeIcon: AchievmentActivel5,
    inactiveIcon: AchievmentInactive5,
  },
  {
    id: "lvl_14",
    title: "Ветеран",
    level: 14,
    activeIcon: AchievmentActivel2,
    inactiveIcon: AchievmentInactive2,
  },
  {
    id: "lvl_17",
    title: "Легенда",
    level: 17,
    activeIcon: AchievmentActivel5,
    inactiveIcon: AchievmentInactive5,
  },
  {
    id: "lvl_20",
    title: "Машина",
    level: 20,
    activeIcon: AchievmentActivel2,
    inactiveIcon: AchievmentInactive2,
  },
  {
    id: "lvl_22",
    title: "Икона",
    level: 22,
    activeIcon: AchievmentActivel5,
    inactiveIcon: AchievmentInactive5,
  },
  {
    id: "lvl_25",
    title: "Босс",
    level: 25,
    activeIcon: AchievmentActivel2,
    inactiveIcon: AchievmentInactive2,
  },
  {
    id: "lvl_30",
    title: "Абсолют",
    level: 30,
    activeIcon: AchievmentActivel5,
    inactiveIcon: AchievmentInactive5,
  },
];

/* =========================
   TYPES
========================= */

type TabType = "achievements" | "history";

interface Props {
  user?: User | null;
  currentUser?: User | null;
  allUsers?: User[]; // <-- список всех пользователей для подсчета рейтинга
}

/* =========================
   COMPONENT
========================= */

export const ProfilePage: React.FC<Props> = ({
  user,
  currentUser,
  allUsers,
}) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<TabType>("achievements");

  if (!user) return <Center>Загрузка профиля...</Center>;

  const isOwnProfile = currentUser?.uid === user.uid;

  const saveName = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...user,
        firstName,
        lastName,
      });
      setEditing(false);
      alert("Имя сохранено");
    } catch {
      alert("Ошибка сохранения");
    }
  };

  // =========================
  // Статистика
  // =========================
  const unlockedAchievementsCount = ACHIEVEMENTS.filter(
    (a) => user.visitsCount >= a.level,
  ).length;

  const userRank = allUsers
    ? [...allUsers]
        .sort((a, b) => b.visitsCount - a.visitsCount)
        .findIndex((u) => u.uid === user.uid) + 1
    : null;

  return (
    <Page>
      {/* ===== HEADER ===== */}
      <ProfileHeader>
        <Avatar user={user} size={90} />

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
          <UsernameBadge>
            {user.telegram?.username} {user.role === "admin" && "(админ)"}
          </UsernameBadge>
        )}

        <Stats>
          <StatCard>
            <StatLabel>Опыта за посещения</StatLabel>
            <StatValue>{user.visitsCount * 10} XP</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Открыто достижений</StatLabel>
            <StatValue>{unlockedAchievementsCount}</StatValue>
          </StatCard>

          {userRank && (
            <StatCard>
              <StatLabel>Место в рейтинге</StatLabel>
              <StatValue>{userRank}</StatValue>
            </StatCard>
          )}
        </Stats>
      </ProfileHeader>

      {/* ===== TABS ===== */}
      <HorizontalTabs>
        <HorizontalTabButton
          active={tab === "achievements"}
          onClick={() => setTab("achievements")}
        >
          Достижения
        </HorizontalTabButton>
        <HorizontalTabButton
          active={tab === "history"}
          onClick={() => setTab("history")}
        >
          История
        </HorizontalTabButton>
      </HorizontalTabs>

      {/* ===== ACHIEVEMENTS ===== */}
      {tab === "achievements" && (
        <AchievementsGrid>
          {ACHIEVEMENTS.map((a) => {
            const unlocked = user.visitsCount >= a.level;

            return (
              <AchievementCard key={a.id} active={unlocked}>
                <AchievementImage
                  src={unlocked ? a.activeIcon : a.inactiveIcon}
                />
                <AchievementText>
                  <strong>{a.title}</strong>
                  <span>{a.level} уровень</span>
                </AchievementText>
              </AchievementCard>
            );
          })}
        </AchievementsGrid>
      )}

      {/* ===== HISTORY ===== */}
      {tab === "history" && (
        <HistoryGrid>
          {user.visits?.length ? (
            user.visits.map((v, i) => (
              <HistoryCard key={i}>
                <HistoryLevel>Уровень {v.level}</HistoryLevel>
                <HistoryDate>
                  {v.date?.toDate
                    ? formatDateTime(v.date.toDate())
                    : "Дата неизвестна"}
                </HistoryDate>
              </HistoryCard>
            ))
          ) : (
            <Muted>
              <MutedImage src={EmptyImg} />
              Нет подтверждённых матчей
            </Muted>
          )}
        </HistoryGrid>
      )}
    </Page>
  );
};

/* =========================
   STYLES
========================= */
const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  h2 {
    margin: 0;
  }
`;

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 80px;
  width: 100vw;
  min-height: 100vh;
  cursor: default;
  user-select: none;
`;

const Center = styled.div`
  padding: 32px;
  text-align: center;
`;

const Name = styled.h2`
  margin-bottom: 16px;
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 0;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  font-size: 14px;
  overflow: hidden;
  width: 100%;
`;

const StatCard = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  justify-content: space-between;
  border-top: 1px solid #292929;

  &:first-child {
    border-top: none;
  }
}
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

/* ===== Tabs ===== */

const HorizontalTabs = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  margin: 24px auto;
  width: fit-content;
`;

const HorizontalTabButton = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  border-radius: 50px;
  background: ${({ active }) => (active ? "#fff" : "transparent")};
  color: ${({ active }) => (active ? "#000" : "#fff")};
  font-size: 14px;
`;

/* ===== Achievements ===== */

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const AchievementCard = styled.div<{ active: boolean }>`
  color: ${({ active }) => (active ? "#fff" : "#9b9b9b")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px;
  text-align: center;
`;

const AchievementImage = styled.img`
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 120px;
`;

const AchievementText = styled.div`
  font-size: 14px;

  span {
    display: block;
    font-size: 10px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

/* ===== History ===== */

const HistoryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const HistoryCard = styled.div`
  padding: 16px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryLevel = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const HistoryDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Muted = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 64px;
  justify-content: center;
  align-items: center;
`;

const MutedImage = styled.img`
  width: 150px;
`;

const UsernameBadge = styled.div`
  background-color: #292929;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  color: #777777;
  width: fit-content;
`;
