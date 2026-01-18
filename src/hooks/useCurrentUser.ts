import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { User } from "../types";

export const useCurrentUser = (tgId: number | null) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tgId) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      const uid = tgId.toString();
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as User);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Ошибка при получении пользователя:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [tgId]);

  return { currentUser, loading };
};
