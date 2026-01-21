import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uploadFile } from "../firebase";

interface Props {
  currentUserId?: string;
}

export const RequestPage: React.FC<Props> = ({ currentUserId }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!text) return alert("Введите текст заявки");
    setLoading(true);

    try {
      let imageUrl = "";

      if (file) {
        // используем нашу функцию uploadFile
        imageUrl = (await uploadFile(file)) as unknown as string;
      }

      await addDoc(collection(db, "requests"), {
        userId: currentUserId,
        text,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Заявка отправлена!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Ошибка при отправке заявки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 16 }}>
      <h1>Создать заявку</h1>

      <textarea
        placeholder="Введите текст"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        style={{ width: "100%", marginBottom: 12, padding: 8 }}
      />

      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div style={{ margin: "12px 0" }}>
          <img
            src={previewUrl}
            alt="Превью"
            style={{ maxWidth: "100%", maxHeight: 200 }}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Отправка..." : "Отправить"}
      </button>
    </div>
  );
};
