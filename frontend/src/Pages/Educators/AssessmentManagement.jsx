import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ENavbar from "../../Components/ENavbar";
import axios from "axios";
const AssessmentManagement = () => {
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
    window.location.href = "https://code-nitrix-frontend.vercel.app/";
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
                  <p className="text-sm text-gray-500">{capitalizeName(user.role) }</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow mt-6">
          <h1 className="text-3xl font-semibold ml-5 mb-6 text-blue-500">
            Assessment Management
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AssessmentManagement;
