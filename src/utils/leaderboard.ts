import type { User } from "../types";

export const buildLeaderboard = (users: User[]) =>
  [...users]
    .sort((a, b) => b.visitsCount - a.visitsCount)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
