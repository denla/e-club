import React from "react";
import type { User } from "../types";

const levels = [2, 5, 8, 11, 14, 17, 20, 22, 25, 30];

type Props = { user: User };

const MapVisualization: React.FC<Props> = ({ user }) => {
  return (
    <div style={{ margin: "10px 0" }}>
      <h3>Дорожная карта болельщика</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {levels.map((lvl, index) => {
          const unlocked = user.visitsCount >= lvl;
          const merch = user.merchReceived[lvl];
          return (
            <div
              key={lvl}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: unlocked ? "#4caf50" : "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  position: "relative",
                  cursor: "pointer",
                  border: "2px solid #0002",
                }}
              >
                {lvl}
                {merch && (
                  <span style={{ position: "absolute", top: -8, right: -8 }}>
                    🎁
                  </span>
                )}
              </div>
              <span style={{ marginTop: "5px", fontSize: "12px" }}>
                {lvl} матч{lvl > 1 ? "ей" : ""}
              </span>
              {index < levels.length - 1 && (
                <div
                  style={{
                    height: 4,
                    width: 40,
                    background: "#0002",
                    margin: "10px 0",
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapVisualization;
