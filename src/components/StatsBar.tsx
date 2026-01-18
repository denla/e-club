// components/StatsBar.tsx
import styled from "styled-components";

const Bar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 12px;
`;

const Value = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
`;

export const StatsBar = () => (
  <Bar>
    <Card>
      <Value>#1</Value>
      <Label>место</Label>
    </Card>
    <Card>
      <Value>12</Value>
      <Label>посещений</Label>
    </Card>
  </Bar>
);
