import React from "react";
import { Link } from "react-scroll"; // Smooth scrolling
import { NavLink } from "react-router-dom"; // Navigation between routes
import EliteLogo from "../img/EliteLogo.png";

const Header = () => {
  return (
    <header
      className="flex items-center justify-between bg-white text-black font-semibold w-full px-8 py-6 fixed top-0 left-0 h-[100px] shadow-md"
      style={{ fontFamily: "'Open Sans', sans-serif", zIndex: 1000 }}
    >
      {/* Logo on the Left */}
      <div className="flex items-center">
        <img
          src={EliteLogo}
          alt="Elite Platform Logo"
          className="w-[100px] h-[100px] object-contain"
        />
      </div>

      {/* Navigation Links on the Right */}
      <nav className="flex items-center space-x-12">
        <Link
          to="home"
          smooth={true}
          duration={500}
          activeClass="text-[#4A85F6] underline" // Active class when scrolled
          className="text-[28px] hover:underline cursor-pointer"
        >
          Home
        </Link>
        <Link
          to="about"
          smooth={true}
          duration={500}
          activeClass="text-[#4A85F6] underline"
          className="text-[28px] hover:underline cursor-pointer"
        >
          About Us
        </Link>
        <Link
          to="contact"
          smooth={true}
          duration={500}
          activeClass="text-[#4A85F6] underline"
          className="text-[28px] hover:underline cursor-pointer"
        >
          Contact
        </Link>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `text-[28px] ${
              isActive ? "text-[#4A85F6] underline" : ""
            } hover:underline`
          }
        >
          Login
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
