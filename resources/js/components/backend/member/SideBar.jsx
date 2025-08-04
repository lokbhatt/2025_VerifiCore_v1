import React from "react";
import {
  FaTachometerAlt,
  FaIdCard,
  FaRegCalendarCheck,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import css from "../../../css/backend/member/Sidebar.module.scss";

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`${css.sidebar} ${!isOpen ? css.collapsed : ""}`}>
      <ul className={css.menu}>
        <li>
          <Link to="/member/dashboard" title="Dashboard">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/member/kyc" title="KYC Form">
            <FaIdCard />
            <span>KYC</span>
          </Link>
        </li>
      </ul>

      <div className={css.lastLogin}>
        <FaClock />
        <span>Last login</span>
        <br />
        <small>11th Jul 2025 23:23</small>
      </div>

      <div className={css.footerNote}>
        Created by{" "}
        <a href="/" target="_blank" rel="noreferrer">
          Lokesh
        </a>{" "}
        2025
      </div>
    </aside>
  );
}
