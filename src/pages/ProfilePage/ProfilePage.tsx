import React, { useState } from "react";
import styled from "styled-components";
import type { User } from "../../types";

import { Avatar } from "../../components/Avatar";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { Drawer } from "../../components/Drawer";

import EmptyImg from "../../assets/images/empty.png";

import AchievmentActive1 from "../../assets/images/achievments/1_active.png";
import AchievmentActive2 from "../../assets/images/achievments/2_active.png";
import AchievmentActive3 from "../../assets/images/achievments/3_active.png";
import AchievmentActive4 from "../../assets/images/achievments/4_active.png";
import AchievmentActive5 from "../../assets/images/achievments/5_active.png";
import AchievmentActive6 from "../../assets/images/achievments/6_active.png";
import AchievmentActive7 from "../../assets/images/achievments/7_active.png";
import AchievmentActive8 from "../../assets/images/achievments/8_active.png";
import AchievmentActive9 from "../../assets/images/achievments/9_active.png";
import AchievmentActive10 from "../../assets/images/achievments/10_active.png";

import AchievmentInactive1 from "../../assets/images/achievments/1_disabled.png";
import AchievmentInactive2 from "../../assets/images/achievments/2_disabled.png";
import AchievmentInactive3 from "../../assets/images/achievments/3_disabled.png";

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
    title: "Первый заряд",
    level: 2,
    activeIcon: AchievmentActive1,
    inactiveIcon: AchievmentInactive1,
  },
  {
    id: "lvl_5",
    title: "В ритме Электрона",
    level: 5,
    activeIcon: AchievmentActive2,
    inactiveIcon: AchievmentInactive1,
  },
  {
    id: "lvl_8",
    title: "Ближе к цели",
    level: 8,
    activeIcon: AchievmentActive3,
    inactiveIcon: AchievmentInactive1,
  },
  {
    id: "lvl_11",
    title: "Тёплая поддержка",
    level: 11,
    activeIcon: AchievmentActive4,
    inactiveIcon: AchievmentInactive1,
  },
  {
    id: "lvl_14",
    title: "Лицо энергии",
    level: 14,
    activeIcon: AchievmentActive5,
    inactiveIcon: AchievmentInactive2,
  },
  {
    id: "lvl_17",
    title: "Носитель силы",
    level: 17,
    activeIcon: AchievmentActive6,
    inactiveIcon: AchievmentInactive2,
  },
  {
    id: "lvl_20",
    title: "Лучший болельщик",
    level: 20,
    activeIcon: AchievmentActive7,
    inactiveIcon: AchievmentInactive1,
  },
  {
    id: "lvl_22",
    title: "Лучший друг",
    level: 22,
    activeIcon: AchievmentActive8,
    inactiveIcon: AchievmentInactive1,
  },
  {
    id: "lvl_25",
    title: "На страже команды",
    level: 25,
    activeIcon: AchievmentActive9,
    inactiveIcon: AchievmentInactive3,
  },
  {
    id: "lvl_30",
    title: "Верность клубу",
    level: 30,
    activeIcon: AchievmentActive10,
    inactiveIcon: AchievmentInactive2,
  },
];

// Призы за ачивки
const ACHIEVEMENT_PRIZES: Record<string, string> = {
  lvl_2: "5 монет",
  lvl_5: "10 монет",
  lvl_8: "Стикер",
  lvl_11: "Бейдж",
  lvl_14: "Бонусный опыт",
  lvl_17: "Секретный предмет",
  lvl_20: "Эмодзи",
  lvl_22: "Подарок в профиле",
  lvl_25: "VIP доступ",
  lvl_30: "Абсолютный трофей",
};

/* =========================
   TYPES
========================= */

type TabType = "achievements" | "history";

interface Props {
  user?: User | null;
  currentUser?: User | null;
  allUsers?: User[];
}

/* =========================
   COMPONENT
========================= */

export const ProfilePage: React.FC<Props> = ({
  user,
  currentUser,
  allUsers,
}) => {
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<TabType>("achievements");

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Состояние выбранной ачивки
  const [selectedAchievement, setSelectedAchievement] = useState<{
    achievement: (typeof ACHIEVEMENTS)[0];
    date?: Date;
  } | null>(null);

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

  // =========================
  // Открытие Drawer с ачивкой
  // =========================
  const openAchievementDrawer = (achievement: (typeof ACHIEVEMENTS)[0]) => {
    const visit = user.visits?.find((v) => v.level >= achievement.level);
    setSelectedAchievement({
      achievement,
      date: visit?.date?.toDate ? visit.date.toDate() : undefined,
    });
    setDrawerOpen(true);
  };

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
            </>
          )}
        </Name>

        {user.telegram?.username && (
          <UsernameBadge>
            {user.telegram?.username} {user.role === "admin" && "(админ)"}
          </UsernameBadge>
        )}

        {isOwnProfile && (
          <SecondaryButton
            style={{ width: "fit-content" }}
            onClick={() => setDrawerOpen(true)}
          >
            Редактировать
          </SecondaryButton>
        )}

        {currentUser?.role === "admin" && currentUser.uid !== user.uid && (
          <AccentButton
            onClick={async () => {
              try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                  visitsCount: (user.visitsCount || 0) + 1,
                });
                alert(`Рейтинг пользователя повышен!`);
              } catch (error) {
                console.error(error);
                alert("Ошибка при повышении рейтинга");
              }
            }}
          >
            Повысить рейтинг
          </AccentButton>
        )}

        <Stats>
          <StatCard>
            <StatLabel>Опыт</StatLabel>
            <StatValue>{user.visitsCount * 10} XP</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Достижений</StatLabel>
            <StatValue>{unlockedAchievementsCount}</StatValue>
          </StatCard>

          {userRank && (
            <StatCard>
              <StatLabel>Место в топе</StatLabel>
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
              <AchievementCard
                key={a.id}
                active={unlocked}
                onClick={() => openAchievementDrawer(a)}
                style={{ cursor: "pointer" }}
              >
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

      {/* ===== DRAWER для выбранной ачивки ===== */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {selectedAchievement ? (
          <>
            <h3 style={{ marginTop: 0 }}>
              {selectedAchievement.achievement.title}
            </h3>
            <AchievementImage
              src={
                user.visitsCount >= selectedAchievement.achievement.level
                  ? selectedAchievement.achievement.activeIcon
                  : selectedAchievement.achievement.inactiveIcon
              }
              style={{ maxWidth: "200px", margin: "16px auto" }}
            />
            <div>
              <strong>Дата получения: </strong>
              {selectedAchievement.date
                ? formatDateTime(selectedAchievement.date)
                : "Еще не получена"}
            </div>
            <div style={{ marginTop: "8px" }}>
              <strong>Приз: </strong>
              {user.visitsCount >= selectedAchievement.achievement.level
                ? ACHIEVEMENT_PRIZES[selectedAchievement.achievement.id]
                : "Приз будет после получения"}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <SecondaryButton onClick={() => setDrawerOpen(false)}>
                Закрыть
              </SecondaryButton>
            </div>
          </>
        ) : (
          <div>Нет данных</div>
        )}
      </Drawer>
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
  flex-direction: row;
  // background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  font-size: 14px;
  overflow: hidden;
  width: 100%;
`;

const StatCard = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  justify-content: space-between;
  border-left: 1px solid #292929;
  gap: 8px;

  &:first-child {
    border-left: none;
  }
}
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const StatLabel = styled.div`
  font-size: 14px;
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
  font-size: 16px;

  span {
    display: block;
    font-size: 12px;
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

const CustomInput = styled.input`
  padding: 12px;
  background: transparent;
  border: 1px solid lavender;
  border-radius: 12px;
  width: 100%;
  outline: none;
  color: white;
  border: 1px solid #ffffff30;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #ff5a00;
  }
`;

const AccentButton = styled.button`
  background: #ff5a00;
  border: none;
  color: #000;
  font-weight: 700;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-family: "Disket Mono", monospace;
  transition: 0.2s ease;
  outline: none;

  font-size: 12px;
  border-radius: 50px;
  width: 100%;
`;

const SecondaryButton = styled.button`
  background: #ffffff2e;
  border: none;
  color: #ffffff;
  font-weight: 700;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-family: "Disket Mono", monospace;
  transition: 0.2s ease;
  outline: none;

  font-size: 11px;
  border-radius: 50px;
  width: 100%;

  &.fit-content {
    width: fit-content;
  }
`;

// .button {
//   background: #ff5a00;
//   border: none;
//   color: #000;
//   font-weight: 700;
//   padding: 16px;
//   border-radius: 12px;
//   margin-bottom: 16px;
//   font-family: "Disket Mono", monospace;
//   transition: 0.2s ease;
//   outline: none;
// }

// .button:hover {
//   background: #ff742e;
// }
