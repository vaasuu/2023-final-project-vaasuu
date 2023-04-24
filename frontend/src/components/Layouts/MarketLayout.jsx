import { Menu, MenuItem, Sidebar, useProSidebar } from "react-pro-sidebar";
import { Outlet } from "react-router-dom";
import { FaBars, FaListAlt, FaPlus } from "react-icons/fa";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { GrUserSettings } from "react-icons/gr";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import "./MarketLayout.css";

const Layout = () => {
  const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } =
    useProSidebar();

  const currentUserId = "1"; // TODO: get current user id

  const handleLogout = () => {
    console.log("logout");
    // TODO: logout
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
    <div style={{ display: "flex", height: "100%", minHeight: "400px" }}>
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
            icon={<GrUserSettings />}
            component={<Link to={`/market/users/${currentUserId}/edit`} />}
          >
            User settings
          </MenuItem>
          <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
      <main style={{ display: "flex", padding: "10px" }}>
        <div className="smallScreenToggleSidebar">
          <FaBars onClick={() => toggleSidebar()} />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
