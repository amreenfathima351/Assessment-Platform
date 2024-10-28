import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ENavbar from "../../Components/ENavbar";
import axios from "axios";

const AssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState({ name: "", role: "", _id: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:5000/user/me",
          config
        );

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          "http://localhost:5000/api/assessments",
          config
        );

        // Filter assessments to only include those created by the logged-in user
        const userAssessments = response.data.filter(
          (assessment) => assessment.userId === user._id
        );
        setAssessments(userAssessments);
      } catch (error) {
        console.error("Error fetching assessments:", error.response.data);
        setError("Failed to fetch assessments.");
      }
    };

    fetchUserData();
    fetchAssessments();
  }, [user._id]); // Run the fetchAssessments function whenever user._id changes

  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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

  const { date, time } = formatDateAndTime();

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
            Assessment Reports
          </h1>
          <div>
            <h1>Your Assessments</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {assessments.length > 0 ? (
              assessments.map((assessment) => (
                <div key={assessment.id}>
                  <h3>{assessment.title}</h3>
                  <p>ID: {assessment.id}</p>
                </div>
              ))
            ) : (
              <p>No assessments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentManagement;
