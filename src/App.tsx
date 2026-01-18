import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import UsersList from "./pages/UsersList";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

import type { User } from "./types";

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Подписка на всех пользователей
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData: User[] = snapshot.docs.map((doc) => doc.data() as User);
      setUsers(usersData);
    });

    // Подписка на текущего пользователя (Firebase Auth)
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setCurrentUser(docSnap.data() as User);
      } else setCurrentUser(null);
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubAuth();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <Router>
      <Navbar currentUser={currentUser} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route
          path="/login"
          element={<Login onUserLoaded={setCurrentUser} />}
        />
        <Route path="/users" element={<UsersList users={users} />} />
        <Route
          path="/users/:uid"
          element={<UserProfileWrapper users={users} />}
        />
        <Route
          path="/admin"
          element={
            <Admin
              users={users}
              tgId={currentUser?.telegram?.id ?? null} // передаём Telegram ID
            />
          }
        />
        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>
    </Router>
  );
};

export default App;

// Обертка для Profile с useParams
const UserProfileWrapper: React.FC<{ users: User[] }> = ({ users }) => {
  const { uid } = useParams<{ uid: string }>();
  const user = users.find((u) => u.uid === uid);
  return <Profile user={user} />;
};
