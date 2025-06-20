import "./Footer.scss";
import { useNavigate } from "react-router-dom";
import { CiSettings, CiHome, CiVault, CiFolderOn } from "react-icons/ci";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="footer-content-wrapper">
        <div className="footer-content">
          <CiVault className="icon" onClick={() => navigate("/vault")} />
          <CiHome className="icon" onClick={() => navigate("/")} />
          <CiFolderOn className="icon" onClick={() => navigate("/folder")} />
          <CiSettings className="icon" onClick={() => navigate("/setting")} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
