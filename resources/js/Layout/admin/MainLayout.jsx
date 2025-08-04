import React from "react";
import Navbar from '../../components/backend/admin/NavBar';
import Sidebar from "../../components/backend/admin/SideBar";
import '../../css/backend/admin/layout.css';
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <div className="main-body">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="page-content">
          <Outlet/>
        </div>
      </div>
  </div>
  );
}
