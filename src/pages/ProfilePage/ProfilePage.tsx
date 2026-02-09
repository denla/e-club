import React, { useState } from "react";
import styled from "styled-components";
import type { User } from "../../types";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CLUB_REWARDS } from "../RewardsPage/rewards.data";
import { useNavigate } from "react-router-dom";

import { Drawer } from "../../components/Drawer";

import AchievmentActive1 from "../../assets/images/achievments/1_active.png";
import AchievmentActive2 from "../../assets/images/achievments/2_active.png";
import AchievmentActive3 from "../../assets/images/achievments/3_active.png";
import AchievmentActive4 from "../../assets/images/achievments/4_active.png";
import AchievmentActive5 from "../../assets/images/achievments/5_active.png";
import AchievmentActive6 from "../../assets/images/achievments/6_active.png";
import AchievmentActive7 from "../../assets/images/achievments/7_active.png";
import AchievmentActive8 from "../../assets/images/achievments/8_active.png";
import AchievmentActive10 from "../../assets/images/achievments/10_active.png";

import AchievmentInactive1 from "../../assets/images/achievments/1_disabled.png";
import AchievmentInactive2 from "../../assets/images/achievments/2_disabled.png";
import AchievmentInactive3 from "../../assets/images/achievments/3_disabled.png";
import AchievmentInactive4 from "../../assets/images/achievments/4_disabled.png";
import AchievmentInactive5 from "../../assets/images/achievments/5_disabled.png";
import AchievmentInactive6 from "../../assets/images/achievments/6_disabled.png";
import AchievmentInactive7 from "../../assets/images/achievments/7_disabled.png";
import AchievmentInactive8 from "../../assets/images/achievments/8_disabled.png";
import AchievmentInactive10 from "../../assets/images/achievments/10_disabled.png";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AppButton } from "../../features/AppButton/AppButton";
import AppHeader from "../../features/AppHeader/AppHeader";

import arrow_right from "../../assets/icons/arrow_right.svg";

/* =========================
   HELPERS
========================= */

const formatDateTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const day = parts.find((p) => p.type === "day")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const year = parts.find((p) => p.type === "year")?.value;
  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;

  return `${day} ${month} ${year}, ${hour}:${minute}`;
};

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
    inactiveIcon: AchievmentInactive2,
  },
  {
    id: "lvl_8",
    title: "Ближе к цели",
    level: 8,
    activeIcon: AchievmentActive3,
    inactiveIcon: AchievmentInactive3,
  },
  {
    id: "lvl_11",
    title: "Тёплая поддержка",
    level: 11,
    activeIcon: AchievmentActive4,
    inactiveIcon: AchievmentInactive4,
  },
  {
    id: "lvl_14",
    title: "Лицо энергии",
    level: 14,
    activeIcon: AchievmentActive5,
    inactiveIcon: AchievmentInactive5,
  },
  {
    id: "lvl_17",
    title: "Носитель силы",
    level: 17,
    activeIcon: AchievmentActive6,
    inactiveIcon: AchievmentInactive6,
  },
  {
    id: "lvl_20",
    title: "Лучший болельщик",
    level: 20,
    activeIcon: AchievmentActive7,
    inactiveIcon: AchievmentInactive7,
  },
  {
    id: "lvl_22",
    title: "Лучший друг",
    level: 22,
    activeIcon: AchievmentActive8,
    inactiveIcon: AchievmentInactive8,
  },
  // {
  //   id: "lvl_25",
  //   title: "На страже команды",
  //   level: 25,
  //   activeIcon: AchievmentActive9,
  //   inactiveIcon: AchievmentInactive9,
  // },
  {
    id: "lvl_25",
    title: "Верность клубу",
    level: 25,
    activeIcon: AchievmentActive10,
    inactiveIcon: AchievmentInactive10,
  },
];
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
  // const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<TabType>("achievements");
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  const navigate = useNavigate();

  const [drawerType, setDrawerType] = useState<
    "editProfile" | "achievement" | null
  >(null);
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
      setDrawerType(null);
      // alert("Имя сохранено");
    } catch {
      console.error("Ошибка при сохранении имени");
    }
  };

  const unlockedAchievementsCount = ACHIEVEMENTS.filter(
    (a) => user.visitsCount >= a.level,
  ).length;

  const userRank = allUsers
    ? [...allUsers]
        .sort((a, b) => b.visitsCount - a.visitsCount)
        .findIndex((u) => u.uid === user.uid) + 1
    : null;

  const openAchievementDrawer = (achievement: (typeof ACHIEVEMENTS)[0]) => {
    const visit = user.visits?.find((v) => v.level >= achievement.level);
    setSelectedAchievement({
      achievement,
      date: visit?.date?.toDate ? visit.date.toDate() : undefined,
    });
    setDrawerType("achievement");
  };

  const openEditProfileDrawer = () => setDrawerType("editProfile");
  const avatarUrl = user.telegram?.photo_url;

  return (
    <Page>
      {/* ===== HEADER ===== */}
      <AppHeader />
      <ProfileHeader>
        <AvatarImage
          src={avatarUrl}
          alt={`${user.firstName} ${user.lastName}`}
          style={{
            display: avatarLoaded ? "block" : "none",
            transition: "opacity 0.3s ease",
          }}
          onLoad={() => setAvatarLoaded(true)}
        />
        {/* <Avatar user={user} size={90} /> */}
        <SkeletonTheme baseColor="#292929" highlightColor="#3a3a3a">
          {!avatarLoaded && <Skeleton circle width={90} height={90} />}
        </SkeletonTheme>
        <Name>
          {firstName} {lastName}
        </Name>
        {user.telegram?.username && (
          <UsernameBadge>
            {user.telegram?.username}
            {/* {user.role === "admin" && "(админ)"} */}
          </UsernameBadge>
        )}
        {isOwnProfile && (
          <AppButton variant="grey" onClick={openEditProfileDrawer}>
            Редактировать
          </AppButton>

          // <SecondaryButton
          //   style={{ width: "fit-content" }}
          //   onClick={openEditProfileDrawer}
          // >
          //   Редактировать
          // </SecondaryButton>
        )}

        {currentUser?.role === "admin" && currentUser.uid !== user.uid && (
          <AccentButton
            onClick={async () => {
              try {
                const userRef = doc(db, "users", user.uid);

                // Создаем новую запись в истории
                const newVisit = {
                  level: (user.visitsCount || 0) + 1, // текущий уровень + 1
                  date: new Date(), // сохраняем текущее время
                };

                // Обновляем visitsCount и добавляем запись в историю
                await updateDoc(userRef, {
                  visitsCount: (user.visitsCount || 0) + 1,
                  visits: [...(user.visits || []), newVisit], // добавляем новую запись
                });

                alert("Рейтинг пользователя повышен!");
              } catch (error) {
                console.error(error);
                alert("Ошибка при повышении рейтинга");
              }
            }}
          >
            Повысить рейтинг
          </AccentButton>
        )}
        <Separator />
        <Stats>
          <StatCard>
            <StatValue>{user.visitsCount * 10} XP</StatValue>
            <StatLabel>Опыт за посещения</StatLabel>
          </StatCard>

          <StatCard>
            <StatValue>{unlockedAchievementsCount}</StatValue>
            <StatLabel>Ачивок заработано</StatLabel>
          </StatCard>

          {userRank && (
            <StatCard>
              <StatValue>{userRank}</StatValue>
              <StatLabel>Место в рейтинге</StatLabel>
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
            <Muted>Нет подтверждённых матчей</Muted>
          )}
        </HistoryGrid>
      )}

      {/* ===== UNIVERSAL DRAWER ===== */}
      <Drawer isOpen={!!drawerType} onClose={() => setDrawerType(null)}>
        {drawerType === "achievement" && selectedAchievement ? (
          <>
            <h3 style={{ marginTop: 0, textAlign: "center" }}>
              {selectedAchievement.achievement.title}
            </h3>
            <DrawerAchievementCard>
              <DrawerAchievementImage
                src={
                  user.visitsCount >= selectedAchievement.achievement.level
                    ? selectedAchievement.achievement.activeIcon
                    : selectedAchievement.achievement.inactiveIcon
                }
                alt={selectedAchievement.achievement.title}
              />
            </DrawerAchievementCard>

            {/* <AchievementImage
              src={
                user.visitsCount >= selectedAchievement.achievement.level
                  ? selectedAchievement.achievement.activeIcon
                  : selectedAchievement.achievement.inactiveIcon
              }
              style={{ maxWidth: "200px", margin: "16px auto" }}
            /> */}
            <DateText>
              {selectedAchievement.date ? (
                <>
                  Получена
                  <br />
                  {formatDateTime(selectedAchievement.date)}
                </>
              ) : (
                "Еще не получена"
              )}
            </DateText>
            <GiftCard>
              <GiftCardItem>
                <span>Приз за ачивку </span>
                {
                  CLUB_REWARDS.find(
                    (r) => r.level === selectedAchievement.achievement.level,
                  )?.reward
                }
              </GiftCardItem>
              <ButtonWrapper onClick={() => navigate("/rewards")}>
                Смотреть все призы
                <img src={arrow_right} />
              </ButtonWrapper>
            </GiftCard>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexDirection: "column",
                marginTop: "16px",
              }}
            >
              <AppButton onClick={() => setDrawerType(null)} variant="grey">
                Закрыть
              </AppButton>
            </div>
          </>
        ) : drawerType === "editProfile" ? (
          <>
            <h3 style={{ marginTop: 0 }}>Редактировать профиль</h3>
            <CustomInput
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Имя"
            />
            <CustomInput
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Фамилия"
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <AppButton onClick={saveName} size="wide">
                Сохранить
              </AppButton>
              <AppButton
                onClick={() => setDrawerType(null)}
                size="wide"
                variant="grey"
              >
                Отмена
              </AppButton>
              {/* <AccentButton onClick={saveName}>Сохранить</AccentButton>
              <SecondaryButton onClick={() => setDrawerType(null)}>
                Отмена
              </SecondaryButton> */}
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
  margin-bottom: 24px;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
`;

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 100vw;
  min-height: 100vh;
  cursor: default;
  user-select: none;
  padding-top: var(--tg-top);

  background-image: url("../../assets/images/gradient_bg.png");
  background-repeat: no-repeat;
  background-size: 180%;
`;

const Center = styled.div`
  padding: 32px;
`;

const Name = styled.h2`
  margin-bottom: 16px;
  font-size: 36px;
  font-weight: 600;
  line-height: 100%;
  margin: 0;
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 0;
  flex-direction: row;
  font-size: 14px;
  overflow: hidden;
  width: 100%;
  gap: 8px;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;

  background: #141414;
  border-radius: 16px;
  align-items: flex-start;
  overflow: hidden;
  padding: 16px 12px;
  height: 110px;
  line-height: 100%;
`;

const GiftCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;

  background: #141414;
  border-radius: 16px;
  align-items: flex-start;
  overflow: hidden;
  line-height: 100%;

  span {
    opacity: 0.5;
  }
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

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

const UsernameBadge = styled.div`
  background-color: #141414;
  border-radius: 50px;
  padding: 8px 12px;
  font-size: 12px;
  color: #777777;
  font-weight: 500;
  width: fit-content;
`;

const CustomInput = styled.input`
  padding: 12px;
  background: transparent;
  border-radius: 12px;
  width: 100%;
  outline: none;
  color: white;
  border: 1px solid #ffffff30;
  font-size: 16px;
  font-family:
    Lab Grotesque,
    sans-serif;

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
  border-radius: 50px;
  margin-bottom: 16px;
  font-family: "Disket Mono", monospace;
  font-size: 12px;
  width: 100%;
`;

const AvatarImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
`;

const DrawerAchievementCard = styled.div`
  display: flex;
  justify-content: center;
  perspective: 1000px; /* важно для 3D эффекта */
  margin: 16px 0;
`;

const DrawerAchievementImage = styled.img`
  width: 200px;
  border-radius: 12px;
  transition: transform 0.2s ease;
  transform-style: preserve-3d;

  /* Наведение курсора с динамическим наклоном */
  &:hover {
    transform: rotateX(10deg) rotateY(10deg);
    cursor: pointer;
  }
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(38, 38, 38, 0.5);
  margin: 16px 0;
`;

const DateText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  margin-top: 8px;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  justify-content: space-between;
  width: calc(100% - 32px);
  display: flex;
  align-items: center;
  color: #808080;
  border-top: 1px solid #8080801a;
  font-weight: 500;
  padding: 16px 0;
  margin: 0 16px;
  box-sizing: border-box;
  cursor: pointer;
  transition: 0.15s ease;
  font-size: 15px;
`;

const GiftCardItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
`;

// const buttonImage = styled.img`
//   width: 16px;
//   filter: invert(100%) sepia(100%) grayscale(100%) brightness(200%);
// `;
