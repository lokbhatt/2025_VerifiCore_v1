import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaMapMarkedAlt,
  FaCity,
  FaLayerGroup,
  FaVenusMars,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaClock,
  FaIdCard,
  FaUser
} from "react-icons/fa";
import { Link } from "react-router-dom";
import css from "../../../css/backend/admin/SideBar.module.scss";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [parentOpen, setParentOpen] = useState(false);

  return (
    <aside className={`${css.sidebar} ${isOpen ? "" : css.collapsed}`}>
      <div className={css.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </div>

      <ul className={css.menu}>
        <li>
          <Link to="/admin/dashboard">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
        </li>

        <li onClick={() => setParentOpen(!parentOpen)} className={css.dropdownToggle}>
          <div className={css.parentLink}>
            <FaUsers />
            <span>Parent Data</span>
            {parentOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {parentOpen && (
            <ul className={css.submenu}>
              <li>
                <Link to="/admin/parent-data/district">
                  <FaMapMarkedAlt />
                  <span>District</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/parent-data/municipality">
                  <FaCity />
                  <span>Municipality</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/parent-data/ward">
                  <FaLayerGroup />
                  <span>Ward</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/parent-data/gender">
                  <FaVenusMars />
                  <span>Gender</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/admin/kyc">
            <FaIdCard />
            <span>KYC</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/user">
            <FaUser />
            <span>Member</span>
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
