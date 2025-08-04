import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaCaretDown } from "react-icons/fa";
import { MdDensityMedium } from "react-icons/md";
import css from "../../../css/backend/admin/NavBar.module.scss";
import logo from '../../../../../public/img/logo.png';
import { useAuth } from "../../../auth/AuthContext";

const MemberNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const {logout} = useAuth();

  return (
    <nav className={css.wrapper}>
      <div className={css.nav_left}>
        <h3>
          <Link to="/admin/dashboard">
            <img src={logo} alt="Member Logo" className={css.logo} />
          </Link>
        </h3>
      </div>

      <div className={`${css.main_menu} ${menuOpen ? css.open : ""}`}>
        <div className={css.searchWrapper}>
          <input
            className={css.searchInput}
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className={css.right_section}>
        <div className={css.profile_area}>
          <button onClick={toggleDropdown} className={css.profile_button}>  
            <span className={css.username}>Admin</span>
            <FaCaretDown />
          </button>

          {dropdownOpen && (
            <ul className={css.dropdown_menu}>
              <li>
                <Link to="admin-profile">
                  <FaUser /> View Profile
                </Link>
              </li>
              <li>
                 <button style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }} type='button' onClick={logout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </ul>
          )}
        </div>

        <MdDensityMedium className={css.toggle_btn} onClick={toggleMenu} />
      </div>
    </nav>
  );
};

export default MemberNavBar;
