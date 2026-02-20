import React, { useRef, useState, useEffect } from "react";
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
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  // Используем rAF для плавного обновления
  const updatePosition = () => {
    if (drawerRef.current) {
      drawerRef.current.style.transform = `translateY(${currentYRef.current}px)`;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
    if (drawerRef.current) {
      drawerRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    if (deltaY > 0) {
      currentYRef.current = deltaY;
      requestAnimationFrame(updatePosition);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!drawerRef.current) return;

    drawerRef.current.style.transition = "transform 0.3s ease";

    if (currentYRef.current > 100) {
      // свайп вниз на >100px закрывает
      drawerRef.current.style.transform = `translateY(100%)`;
      setTimeout(onClose, 300); // закрываем после анимации
    } else {
      // возвращаем обратно
      currentYRef.current = 0;
      drawerRef.current.style.transform = "translateY(0)";
    }
  };

  // Сбрасываем позицию при открытии заново
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.style.transition = "transform 0.3s ease";
      currentYRef.current = 0;
      drawerRef.current.style.transform = "translateY(0)";
    }
  }, [isOpen]);

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
  z-index: 100000;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  max-width: 500px;
  background: #0d0d0d;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px;
  position: relative;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  touch-action: none;
  gap: 12px;
  flex-direction: column;
  transform: translateY(100%);
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
