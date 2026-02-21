import { useEffect, useState } from "react";
import "./Preloader.css";
import logo from "../../assets/logo/logo.svg";
import { AppButton } from "../AppButton/AppButton";

export const Preloader = () => {
  const [showReload, setShowReload] = useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReload(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="preloader">
      <div className="logo">
        <img src={logo} alt="logo" width={48} />
      </div>

      <div className="bar" />

      {showReload && (
        <div className="reload-card">
          <p className="reload-text">
            Если загрузка занимает слишком много времени, попробуйте
            перезагрузить приложение.
          </p>
          <AppButton onClick={handleReload} variant="grey">
            Перезагрузить
          </AppButton>
        </div>
      )}
    </div>
  );
};

export default Preloader;
