// Layout.jsx
import Header from "../components/header.jsx"; // adjust path
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="p-6">
        <Outlet /> {/* This renders the page-specific content */}
      </main>
    </>
  );
};

export default Layout;
