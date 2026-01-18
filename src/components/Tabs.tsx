// components/Tabs.tsx
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  margin: 24px 0;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px 0;
  border-radius: 20px;
  background: ${({ active }) => (active ? "#fff" : "transparent")};
  color: ${({ active }) => (active ? "#000" : "#fff")};
  font-weight: 500;
`;

interface Props {
  value: "achievements" | "history";
  onChange: (v: Props["value"]) => void;
}

export const Tabs = ({ value, onChange }: Props) => (
  <Wrapper>
    <Tab
      active={value === "achievements"}
      onClick={() => onChange("achievements")}
    >
      Достижения
    </Tab>
    <Tab active={value === "history"} onClick={() => onChange("history")}>
      История
    </Tab>
  </Wrapper>
);
