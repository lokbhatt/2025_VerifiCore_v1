import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaCaretDown } from "react-icons/fa";
import { MdDensityMedium } from "react-icons/md";
import css from "../../../css/backend/member/NavBar.module.scss";
import logo from '../../../../../public/img/logo.png';
import { useAuth } from "../../../auth/AuthContext";
import { FaBars } from "react-icons/fa";
import api from "../../../api/axios";

const MemberNavBar = ({ toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchUser = async () => {
    try {
      const res = await api.get("member/me");
      const data = res.data?.data ?? res.data;
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const profileImage = user?.user_detail?.image
  ? `/images/profiles/${user.user_detail.image.split("\\").pop().split("/").pop()}`
  : "/profile.png";

  return (
    <nav className={css.wrapper}>
      <div className={css.nav_left}>
        <h3>
          <Link to="/member/dashboard">
            <img src={logo} alt="Member Logo" className={css.logo} />
          </Link>
        </h3>
        <button onClick={toggleSidebar} className={css.sidebar_toggle}>
          <FaBars />
        </button>
      </div>

      <div className={`${css.main_menu} ${menuOpen ? css.open : ""}`}>
        <div className={css.searchWrapper}>
          <input
            className={css.searchInput}
            type="text"
            placeholder="Search..."
          />
        </div>
        <ul>
          <li><Link to="/member/events">Events</Link></li>
          <li><Link to="/member/resources">Resources</Link></li>
        </ul>
      </div>

      <div className={css.right_section}>
        <div className={css.profile_area}>
          <button onClick={toggleDropdown} className={css.profile_button}>
            <img
              src={profileImage}
              alt="Profile"
              className={css.profile_img}
            />
            <span className={css.username}>
              {user ? user.name : "Loading..."}
            </span>
            <FaCaretDown />
          </button>

          {dropdownOpen && (
            <ul className={css.dropdown_menu}>
              <li>
                <Link to={`/member/user/${user?.id}`}>
                  <FaUser /> View Profile
                </Link>
              </li>
              <li>
                <Link to={`/member/user/${user?.id}/edit`}>
                  <FaCog /> Settings
                </Link>
              </li>
              <li>
                <button style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }} type="button" onClick={logout}>
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
