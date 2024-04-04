import { Outlet } from "react-router-dom";
/* import Header from "../Header/Header";
import Footer from "../Footer/Footer"; */

const Layout = () => {
  return (
    <div className="app">
      {/* <Header /> */}
      <header>Header</header>
      <Outlet />
      {/* <Footer /> */}
      <footer>Footer</footer>
    </div>
  );
};

export default Layout;
