import { useState } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { MdDensityMedium } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from '../../../../public/img/logo.png';
import css from "./NavBar.module.scss";

const NavBar = () => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  return (
    <div className={css.wrapper}>
      <div className={css.nav_left}>
        <h3>
          <Link to="/"><img src={logo} alt="headerLogo" className="header-logo" width='70%' /></Link>
        </h3>
      </div>

      <div className={`${css.main_menu} ${toggle ? css["main_menu--open"] : ""}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about-us">About</Link></li>
          <li><Link to="/contact-us">Contact</Link></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/login/member">Login</Link></li>
          <li><Link to="/register/member">Register</Link></li>
        </ul>
      </div>

      <div className={css.right_section}>
        <div className={css.search_box}>
          <BsSearchHeart />
          <input type="text" placeholder="Search..." />
        </div>
        <MdDensityMedium className={css.toggle_btn} onClick={handleToggle} />
      </div>
    </div>
  );
};

export default NavBar;
