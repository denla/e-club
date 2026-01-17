export type Visit = {
  level: number;
  date: string;
};

export type User = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "fan" | "admin";
  visitsCount: number;
  achievements: number[];
  merchReceived: { [key: number]: boolean };
  visits: Visit[];
};
