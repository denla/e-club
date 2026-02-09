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
