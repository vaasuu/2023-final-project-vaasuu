import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <h1>TODO: sidebar here</h1>
      <Outlet />
    </div>
  );
};

export default Layout;
