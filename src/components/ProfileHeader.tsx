// components/ProfileHeader.tsx
import styled from "styled-components";
import { StatsBar } from "./StatsBar";

const Wrapper = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #777;
  display: grid;
  place-items: center;
  font-size: 32px;
  margin: 0 auto 12px;
`;

const Name = styled.h2`
  margin: 0 0 16px;
`;

export const ProfileHeader = () => (
  <Wrapper>
    <Avatar>Д</Avatar>
    <Name>Денис Иванов</Name>
    <StatsBar />
  </Wrapper>
);
