import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../img/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, // Icon for Dashboard
  faTasks, // Icon for Assessment Management
  faFileAlt, // Use faFileAlt for Reports (valid icon)
  faCog, // Icon for Settings
  faSignOutAlt, // Icon for Logout
} from "@fortawesome/free-solid-svg-icons";

const ENavbar = () => {
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
          to="/educator-dashboard"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/educator-dashboard" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          Dashboard
        </Link>
        <Link
          to="/assessment-management"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/assessment-management" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faTasks} className="mr-2" />
          Assessment
        </Link>
        <Link
          to="/report-management"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/report-management" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
          Reports
        </Link>
        <Link
          to="/setting"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/setting" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faCog} className="mr-2" />
          Setting
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

export default ENavbar;
