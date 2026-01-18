import styles from "./Tabs.module.css";
import React, { useState } from "react";
import type { ReactNode } from "react";

// Тип для одного таба
interface Tab {
  label: string;
  content: ReactNode;
}

// Пропсы для компонента Tabs
interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className={styles["tabs-container"]}>
      {/* Заголовки табов */}
      <div className={styles["tabs-header"]}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles["tab-button"]} ${
              activeIndex === index ? styles["active"] : ""
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент активного таба */}
      <div className={styles["tabs-content"]}>{tabs[activeIndex].content}</div>
    </div>
  );
};

export default Tabs;
