import React, { useState } from "react";
import Navbar from '../../components/backend/member/NavBar';
import Sidebar from "../../components/backend/member/SideBar";
import '../../css/backend/member/layout.css';
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  return (
    <div className="layout-wrapper">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="main-body">
        <div className={`sidebar-wrapper ${isSidebarOpen ? "" : "collapsed"}`}>
          <Sidebar isOpen={isSidebarOpen} />
        </div>
        <div className="page-content">
          <Outlet/>
        </div>
      </div>
  </div>
  );
}
