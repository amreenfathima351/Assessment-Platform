import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ENavbar from '../../Components/ENavbar';
import axios from 'axios';
const EDashboard = () => {
  const [user, setUser] = useState({ name: "", role: "" });
  const navigate = useNavigate();
  useEffect(() => {
    // Make an API call to fetch user data
    const fetchUserData = async () => {
      try {
        // Assuming you have a token stored in localStorage after login
        const token = localStorage.getItem("authToken");

        // Set up the authorization header with the token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        };

        // Fetch the user data from the backend
        const response = await axios.get(
          "http://localhost:5000/user/me",
          config
        );

        console.log("Fetched user data:", response.data); // Log the response

        // Set user data in the state
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to capitalize the first letter of each word in the name
  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get current date and time in a more readable format
  const formatDateAndTime = () => {
    const optionsDate = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date().toLocaleDateString(undefined, optionsDate);
    const time = new Date().toLocaleTimeString(undefined, optionsTime);
    return { date, time };
  };
  const createTest = () => {
   navigate("/assessment-create")
 };


  const { date, time } = formatDateAndTime(); // Destructure date and time

    return (
      <div className="flex bg-gray-100 min-h-screen">
        <ENavbar />
        <div className="flex-grow ml-60 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-baseline space-x-2">
              <h2 className="text-xl font-semibold">Welcome,</h2>
              <h2 className="text-xl font-bold">{capitalizeName(user.name)}</h2>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="font-bold">{date}</p>
                <p className="font-bold">{time}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={
                      user.profileImage
                        ? `http://localhost:5000${user.profileImage}`
                        : "https://via.placeholder.com/100"
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full shadow-md"
                  />
                  <div>
                    <p className="font-bold">{capitalizeName(user.name)}</p>
                    <p className="text-sm text-gray-500">
                      {capitalizeName(user.role)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow mt-6">
            <h1 className="text-3xl font-semibold ml-5 mb-6 text-blue-500">
              Dashboard Overview
            </h1>

            <div className="bg-white ml-5 p-6 rounded-lg shadow-md ">
              <div className="assessment-stats flex justify-between mb-5">
                <div className="stat-column w-1/3 pr-4">
                  <div className="stat-box bg-gray-100 p-10 rounded-full shadow-sm flex flex-col items-center">
                    <span className="stat-title text-lg text-gray-600">
                      Assessment Created
                    </span>
                    <span className="stat-value text-2xl font-bold">10</span>
                  </div>
                </div>
                <div className="stat-column w-1/3 pr-4">
                  <div className="stat-box bg-gray-100 p-10 rounded-full shadow-sm flex flex-col items-center">
                    <span className="stat-title text-lg text-gray-600">
                      Assessment In Progress
                    </span>
                    <span className="stat-value text-2xl font-bold">1</span>
                  </div>
                </div>
                <div className="stat-column w-1/3 pl-4">
                  <div className="stat-box bg-gray-100 p-10 rounded-full shadow-sm flex flex-col items-center">
                    <span className="stat-title text-lg text-gray-600">
                      Upcoming Assessment
                    </span>
                    <span className="stat-value text-2xl font-bold">3</span>
                  </div>
                </div>
              </div>

              <h3 className="recent-activity-title text-lg font-bold mb-4">
                Recent Activity
              </h3>
              <div className="container flex justify-between">
                {/* Recent Activity */}
                <div className="activity w-1/2 pr-2">
                  <ul className="list-none p-0">
                    <li className="activity-item bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                      Completed Quiz on JavaScript
                    </li>
                    <li className="activity-item bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                      Submitted Report on Python Basics
                    </li>
                  </ul>
                </div>

                {/* Notifications */}
                <div className="notifications w-1/2 pl-2">
                  <ul className="list-none p-0">
                    <li className="notification-item bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                      New Assignment Added
                    </li>
                    <li className="notification-item bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                      Upcoming Event: Workshop on React
                    </li>
                  </ul>
                </div>
              </div>
              <h3 className="recent-activity-title text-lg font-bold mb-4">
                Notifications
              </h3>
              <div className="container flex justify-between">
                {/* Recent Activity */}
                <div className="activity w-1/2 pr-2">
                  <ul className="list-none p-0">
                    <li className="activity-item bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                      System Maintainance on 17th Oct
                    </li>
                    <li className="activity-item bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                      Reminder: upload assessment for Full Stack Developer
                    </li>
                  </ul>
                </div>

                {/* Notifications */}
                <div className="notifications w-1/2 pl-2">
                  <ul className="list-none p-0">
                    <li className="notification-item bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                      Admin Notified You
                    </li>
                    <li className="notification-item bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                      125 Candidates taken your assessment
                    </li>
                  </ul>
                </div>
              </div>

              {/* Create Assessment Button */}
              <div className="create-assessment-container mt-10 text-center">
                <button
                  className="create-assessment-button bg-blue-500 text-white px-6 py-3 rounded-lg text-lg flex items-center justify-center mx-auto"
                  onClick={createTest}
                >
                  Create Assessment
                  <i className="button-icon text-xl ml-2">+</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default EDashboard