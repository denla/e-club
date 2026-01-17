import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    setError("");

    // 🔍 Базовые проверки
    if (!email.includes("@")) {
      setError("Введите корректный email");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/users");
    } catch (e: any) {
      // 🎯 Человеческие ошибки
      switch (e.code) {
        case "auth/email-already-in-use":
          setError("Этот email уже зарегистрирован");
          break;
        case "auth/user-not-found":
          setError("Пользователь не найден");
          break;
        case "auth/wrong-password":
          setError("Неверный пароль");
          break;
        case "auth/invalid-email":
          setError("Неверный email");
          break;
        default:
          setError("Ошибка авторизации");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        {isRegister ? "Регистрация" : "Вход"}
      </h2>

      <input
        style={{ width: "100%", marginBottom: 10 }}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={{ width: "100%", marginBottom: 10 }}
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          background: "#4caf50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Загрузка..." : isRegister ? "Зарегистрироваться" : "Войти"}
      </button>

      <p
        style={{
          marginTop: 10,
          textAlign: "center",
          cursor: "pointer",
          color: "#1976d2",
        }}
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация"}
      </p>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;
