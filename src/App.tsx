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
import Admin from "./pages/Admin";

import type { User } from "./types";

import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";
import { BottomNav } from "./features/BottomNav/BottomNav";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";

/* =========================
   APP
========================= */

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* --- подписка на пользователей --- */
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData: User[] = snapshot.docs.map((doc) => doc.data() as User);
      setUsers(usersData);
    });

    /* --- авторизация --- */
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as User);
        }
      } else {
        setCurrentUser(null);
      }

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

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Router>
      <Navbar currentUser={currentUser} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />

        <Route
          path="/login"
          element={<Login onUserLoaded={setCurrentUser} />}
        />

        <Route path="/users" element={<LeaderboardPage users={users} />} />

        {/* ===== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ===== */}
        <Route path="/users/:uid" element={<UserProfilePage users={users} />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>

      <BottomNav uid={currentUser?.uid} />
    </Router>
  );
};

export default App;

/* =========================
   PROFILE ROUTE WRAPPER
========================= */

const UserProfilePage: React.FC<{ users: User[] }> = ({ users }) => {
  const { uid } = useParams<{ uid: string }>();
  const user = users.find((u) => u.uid === uid);

  return <ProfilePage user={user} />;
};
