import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../img/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt, // Replacing faHome
  faUserFriends, // Replacing faLaptop
  faClipboardList, // Replacing faInfoCircle
  faChalkboardTeacher, // Replacing faVideo
  faChartBar, // Replacing faFileAlt
  faCogs, // Replacing faUser
  faDoorOpen, // Replacing faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const ANavbar = () => {
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
          to="/admin-dashboard"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/admin-dashboard" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
          Dashboard
        </Link>
        <Link
          to="/manage-users"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/manage-users" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
          Users Accounts
        </Link>
        <Link
          to="/config"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/config" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
          Schedule Assessment
        </Link>
        <Link
          to="/monitor"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/monitor" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
          Proctoring Performance
        </Link>
        <Link
          to="/report-page"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/report-page" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faChartBar} className="mr-2" />
          Reports
        </Link>
        <Link
          to="/security-setting"
          className={`flex items-center px-4 py-2 text-gray-600 text-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 ${
            location.pathname === "/security-setting" ? "bg-gray-200" : ""
          }`}
        >
          <FontAwesomeIcon icon={faCogs} className="mr-2" />
          Settings
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 text-gray-600 text-lg mt-auto hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
      >
        <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default ANavbar;
