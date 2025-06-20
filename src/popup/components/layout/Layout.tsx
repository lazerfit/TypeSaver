import Header from "./Header";
import Footer from "./Footer";
import { useOutlet } from "react-router-dom";
import "./Layout.scss";

const Layout = () => {
  const outlet = useOutlet();

  return (
    <>
      <Header />
      <main className="home">{outlet}</main>
      <Footer />
    </>
  );
};

export default Layout;
