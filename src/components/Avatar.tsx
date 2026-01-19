import styled from "styled-components";
import type { User } from "../types";

export const Avatar: React.FC<{ user: User }> = ({ user }) => {
  const photoUrl = user.telegram?.photo_url;

  return photoUrl ? (
    <AvatarImage src={photoUrl} alt={`${user.firstName} avatar`} />
  ) : (
    <AvatarLetter>{user.firstName?.[0] ?? "?"}</AvatarLetter>
  );
};

/* ===== Стили ===== */

const AvatarImage = styled.img`
  width: 72px;
  height: 72px;
  margin: 0 auto 12px;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarLetter = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #777;
  display: grid;
  place-items: center;
  font-size: 32px;
  font-weight: 600;
`;
