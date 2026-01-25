import styled from "styled-components";
import type { User } from "../types";

type AvatarProps = {
  user: User;
  size?: number;
};

export const Avatar: React.FC<AvatarProps> = ({ user, size = 90 }) => {
  const photoUrl = user.telegram?.photo_url;

  return photoUrl ? (
    <AvatarImage src={photoUrl} alt={`${user.firstName} avatar`} size={size} />
  ) : (
    <AvatarLetter size={size}>{user.firstName?.[0] ?? "?"}</AvatarLetter>
  );
};

/* ===== Стили ===== */

const AvatarImage = styled.img<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin: 0 auto;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarLetter = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: #777;
  display: grid;
  place-items: center;
  font-size: ${({ size }) => size / 2.25}px;
  font-weight: 600;
`;
