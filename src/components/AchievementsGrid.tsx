// components/AchievementsGrid.tsx
import styled from "styled-components";
import { AchievementCard } from "./AchievementCard";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

export const AchievementsGrid = () => (
  <Grid>
    <AchievementCard level={1} active />
    <AchievementCard level={3} active />
    <AchievementCard level={5} active />
    <AchievementCard level={1} />
    <AchievementCard level={3} />
    <AchievementCard level={5} />
  </Grid>
);
