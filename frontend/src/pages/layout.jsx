// Layout.jsx
import Header from "../components/Header.jsx"; 
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="p-6">
        <Outlet /> 
      </main>
    </>
  );
};

export default Layout;
