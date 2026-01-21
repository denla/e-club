import "./Preloader.css";
import logo from "../../assets/logo/logo.svg";

export const Preloader = () => {
  return (
    <div className="preloader">
      <div className="logo">
        <img src={logo} alt="logo" width={48} />
      </div>
      <div className="bar" />
    </div>
  );
};

export default Preloader;
