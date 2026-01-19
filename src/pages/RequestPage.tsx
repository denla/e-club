import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Props {
  currentUserId?: string;
}

export const RequestPage: React.FC<Props> = ({ currentUserId }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!text) return alert("Введите текст заявки");

    setLoading(true);

    try {
      let imageUrl = "";

      if (file) {
        const fileRef = ref(storage, `requests/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "requests"), {
        userId: currentUserId,
        text,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Заявка отправлена!");
      navigate("/profile"); // возвращаемся на профиль
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке заявки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Создать заявку</h1>
      <textarea
        placeholder="Введите текст"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Отправка..." : "Отправить"}
      </button>
    </div>
  );
};
