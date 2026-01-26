import { useEffect } from "react";

export function useTelegramInsets() {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    const applyInsets = () => {
      const top = tg.safeAreaInset?.top ?? 0;
      const bottom = tg.safeAreaInset?.bottom ?? 0;

      document.documentElement.style.setProperty("--tg-top", `${top}px`);
      document.documentElement.style.setProperty("--tg-bottom", `${bottom}px`);
    };

    applyInsets();

    tg.onEvent("viewportChanged", applyInsets);

    return () => {
      tg.offEvent("viewportChanged", applyInsets);
    };
  }, []);
}
