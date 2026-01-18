// components/AchievementCard.tsx
import styled from "styled-components";

const Card = styled.div<{ active?: boolean }>`
  text-align: center;
  opacity: ${({ active }) => (active ? 1 : 0.35)};
`;

const Badge = styled.div<{ active?: boolean }>`
  width: 56px;
  height: 56px;
  margin: 0 auto 8px;
  border-radius: 16px;
  background: ${({ active, theme }) =>
    active ? theme.colors.accent : theme.colors.inactive};
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 700;
`;

const Text = styled.div`
  font-size: 12px;
`;

interface Props {
  level: number;
  active?: boolean;
}

export const AchievementCard = ({ level, active }: Props) => (
  <Card active={active}>
    <Badge active={active}>{level}</Badge>
    <Text>1 посещение</Text>
    <Text>12 февраля</Text>
  </Card>
);
