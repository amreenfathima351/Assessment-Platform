import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../img/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLaptop,
  faInfoCircle,
  faVideo,
  faFileAlt,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const CNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage to remove user data
    localStorage.removeItem("user");

    // Navigate to the login page after logout
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-white w-52 fixed top-0 left-0 pt-5">
      <div className="flex items-center mb-6">
        <img src={logo} alt="Logo" className="w-12 h-12 ml-5" />
        <h3 className="ml-4 text-4xl">Elite</h3>
      </div>
      <nav className="flex flex-col">
        <Link
          to="/candidate-dashboard"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/candidate-dashboard" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          Dashboard
        </Link>
        <Link
          to="/system-check"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/system-check" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faLaptop} className="mr-2" />
          System Check
        </Link>
        <Link
          to="/assessment-instruction"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/assessment-instruction" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
          Assessment Instruction
        </Link>
        <Link
          to="/proctoring-instruction"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/proctoring-instruction" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faVideo} className="mr-2" />
          Proctoring Instruction
        </Link>
        
        <Link
          to="/profile"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/profile" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Profile
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 text-gray-600 text-lg mt-auto hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default CNavbar;
