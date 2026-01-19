// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import { useTelegram } from "../hooks/useTelegram";
// import type { User } from "../types";

// export default function Admin() {
//   const { user: tgUser, ready, isWebApp } = useTelegram();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!ready || !tgUser) return;

//     const fetchUser = async () => {
//       try {
//         const uid = tgUser.id.toString();
//         const userRef = doc(db, "users", uid);
//         const userSnap = await getDoc(userRef);

//         if (!userSnap.exists()) {
//           setError("Пользователь не найден в базе данных.");
//           setLoading(false);
//           return;
//         }

//         const finalUser = userSnap.data() as User;

//         setUser({
//           ...finalUser,
//           telegram: {
//             id: tgUser.id,
//             first_name: tgUser.first_name,
//             last_name: tgUser.last_name,
//             username: tgUser.username,
//             language_code: tgUser.language_code,
//             photo_url: (tgUser as any).photo_url ?? "",
//           },
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError("Ошибка при загрузке данных пользователя.");
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [ready, tgUser]);

//   if (!isWebApp) return <div>Пожалуйста, откройте через Telegram WebApp.</div>;
//   if (!ready) return <div>Инициализация Telegram WebApp…</div>;
//   if (loading) return <div>Загрузка данных пользователя…</div>;
//   if (error) return <div>{error}</div>;
//   if (!user) return <div>Не удалось получить пользователя.</div>;

//   // Проверка роли
//   if (user.role !== "admin") {
//     return <div>Доступ запрещён. Только для администраторов.</div>;
//   }

//   // Админский интерфейс
//   return (
//     <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
//       <h1>Панель администратора</h1>
//       <p>
//         Добро пожаловать, {user.firstName} {user.lastName}!
//       </p>

//       <h2>Данные пользователя</h2>
//       <pre>{JSON.stringify(user, null, 2)}</pre>

//       <h2>Данные Telegram</h2>
//       <pre>{JSON.stringify(user.telegram, null, 2)}</pre>

//       <p>
//         Здесь можно добавить админские функции: управление пользователями,
//         просмотр статистики и т.д.
//       </p>
//     </div>
//   );
// }

//CHECK ROLE

import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";

interface Request {
  id: string;
  userId: string;
  text: string;
  imageUrl?: string;
  createdAt?: any;
}

interface Props {
  currentUser?: {
    uid: string;
    role: string;
  } | null;
}

interface Request {
  id: string;
  userId: string;
  text: string;
  imageUrl?: string;
  createdAt?: any;
}

interface Props {
  currentUser?: {
    uid: string;
    role: string;
  } | null;
}

export const AdminPage = ({ currentUser }: Props) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const isAdminProfile = currentUser?.role === "admin";

  const fetchRequests = async () => {
    const snapshot = await getDocs(collection(db, "requests"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Request[];
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (request: Request) => {
    try {
      const userRef = doc(db, "users", request.userId);
      await updateDoc(userRef, {
        visitsCount: increment(1),
        visits: arrayUnion({ date: new Date(), level: 1 }),
      });
      await deleteDoc(doc(db, "requests", request.id));
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (err) {
      console.error(err);
      alert("Ошибка при принятии заявки");
    }
  };

  const handleReject = async (request: Request) => {
    try {
      await deleteDoc(doc(db, "requests", request.id));
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (err) {
      console.error(err);
      alert("Ошибка при отклонении заявки");
    }
  };

  if (!isAdminProfile) {
    return <p>Доступ запрещён. Только для администраторов.</p>;
  }

  return (
    <div>
      <h1>Админ-панель</h1>
      {requests.length === 0 && <p>Нет новых заявок</p>}
      {requests.map((req) => (
        <div
          key={req.id}
          style={{ border: "1px solid #ccc", marginBottom: 12, padding: 8 }}
        >
          <p>{req.text}</p>
          {req.imageUrl && (
            <img src={req.imageUrl} alt="заявка" style={{ maxWidth: 200 }} />
          )}
          <div>
            <button onClick={() => handleAccept(req)}>Принять</button>
            <button onClick={() => handleReject(req)}>Отклонить</button>
          </div>
        </div>
      ))}
    </div>
  );
};
