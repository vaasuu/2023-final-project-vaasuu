import { Menu, MenuItem, Sidebar, useProSidebar } from "react-pro-sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaListAlt, FaPlus } from "react-icons/fa";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { GrUser, GrUserSettings } from "react-icons/gr";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";

import "./MarketLayout.css";
import { AuthContext } from "../../shared/context/auth-context";
import { NavigationContext } from "../../shared/context/navigation-context";

const Layout = () => {
  const { collapseSidebar, toggleSidebar, collapsed } = useProSidebar();
  const auth = useContext(AuthContext);
  const navigationContext = useContext(NavigationContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (auth.isLoaded && auth.isLoggedIn != null && !auth.isLoggedIn) {
      if (location.pathname != "/auth") {
        navigationContext.setOriginalPage(location.pathname);
        navigate("/auth");
      }
    }
  }, [auth.isLoggedIn, auth.isLoaded]);

  const handleLogout = () => {
    auth.logout();
  };

  const SidebarChevronIcon = () => {
    return collapsed ? (
      <HiOutlineChevronDoubleRight onClick={() => collapseSidebar()} />
    ) : (
      <HiOutlineChevronDoubleLeft onClick={() => collapseSidebar()} />
    );
  };

  const handleAutoToggleOnMobile = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <div className="market-layout-container">
      <Sidebar breakPoint="sm" backgroundColor="rgb(249, 249, 249, 0.95)">
        <div className="sidebar-collapse-button">
          <SidebarChevronIcon />
        </div>
        <Menu
          onClick={() => {
            handleAutoToggleOnMobile();
          }}
        >
          <MenuItem
            icon={<FaListAlt />}
            component={<Link to="/market/listings" />}
          >
            Listings
          </MenuItem>
          <MenuItem icon={<FiUsers />} component={<Link to="/market/users" />}>
            Users
          </MenuItem>
          <MenuItem
            icon={<FaPlus />}
            component={<Link to="/market/listings/new" />}
          >
            Create new listing
          </MenuItem>
          <MenuItem
            icon={<GrUser />}
            component={<Link to={`/market/users/${auth.userId}`} />}
          >
            My profile
          </MenuItem>
          <MenuItem
            icon={<GrUserSettings />}
            component={<Link to={`/market/users/${auth.userId}/edit`} />}
          >
            User settings
          </MenuItem>
          <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
      <div className="market-layout__main-content-container">
        <div className="smallScreenToggleSidebar">
          <FaBars onClick={() => toggleSidebar()} />
        </div>
        <main className="market-layout__main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
