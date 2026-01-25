import React, { useRef, useState } from "react";
import styled from "styled-components";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number | null>(null);

  // Начало свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  // Движение свайпа
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null && drawerRef.current) {
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        drawerRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    }
  };

  // Конец свайпа
  const handleTouchEnd = () => {
    if (drawerRef.current) {
      const transformY = parseInt(
        drawerRef.current.style.transform
          .replace("translateY(", "")
          .replace("px)", ""),
      );
      if (transformY > 100) {
        // свайп вниз на >100px закрывает
        onClose();
      } else {
        drawerRef.current.style.transform = "translateY(0)";
      }
    }
    setStartY(null);
  };

  return (
    <Overlay visible={isOpen} onClick={onClose}>
      <Content
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CloseButton onClick={onClose}>✕</CloseButton>
        {children}
      </Content>
    </Overlay>
  );
};

/* ===== STYLES ===== */

const Overlay = styled.div<{ visible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ visible }) => (visible ? "flex" : "none")};
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  max-width: 500px;
  background: #1c1c1e;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px;
  position: relative;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  touch-action: none;
  gap: 12px;
  flex-direction: column;
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};

  &:hover {
    color: #fff;
  }
`;
