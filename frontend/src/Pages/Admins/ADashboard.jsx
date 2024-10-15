import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ANavbar from "../../Components/ANavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [user, setUser] = useState({ name: "", role: "", profileImage: "" });
  const [users, setUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState("Offline");
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


    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchRecentActivities = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get("http://localhost:5000/activities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const activities = response.data.slice(0, 10); // Fetch only the latest 10 activities
        setRecentActivities(activities);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    const fetchSystemStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/status");
        setSystemStatus(response.data.status || "Online");
      } catch (error) {
        console.error("Error fetching system status:", error);
      }
    };

    fetchUserData();
    fetchUsers();
    fetchRecentActivities();
    fetchSystemStatus();
  }, []);

  const formatDateAndTime = (dateString) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options); // Format date
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <ANavbar />
      <div className="flex-grow ml-60 p-6">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-xl font-semibold">Welcome,</h2>
            <h2 className="text-xl font-bold">{user.name}</h2>
          </div>
<div className="flex items-center space-x-6">
  <div className="text-right">
    <p className="font-bold">{formatDateAndTime(new Date())}</p>
    <p className="font-bold">{new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
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
                  <p className="text-sm text-gray-500">{capitalizeName(user.role)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">System Status</h3>
            <p
              className={`font-bold ${
                systemStatus === "Online" ? "text-green-600" : "text-red-600"
              }`}
            >
              {systemStatus}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">Recent Activities</h3>
            <ul className="max-h-32 overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <li key={index} className="border-b last:border-none py-2">
                  {activity.description}
                  {/* Use updated format */}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul>
              <li>
                <button
                  className="text-blue-500"
                  onClick={() => navigate("/create-exam")}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Create Exam
                </button>
              </li>
              <li>
                <button
                  className="text-blue-500"
                  onClick={() => navigate("/add-user")}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add User
                </button>
              </li>
              <li>
                <button
                  className="text-blue-500"
                  onClick={() => navigate("/manage-users")}
                >
                  <FontAwesomeIcon icon={faSort} className="mr-2" />
                  Manage Users
                </button>
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Manage Users</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">Registered Date</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="border-b last:border-none hover:bg-gray-100"
              >
                <td className="py-4 px-6">
                  <div>{capitalizeName(user.name)}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    {capitalizeName(user.role)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {formatDateAndTime(user.createdAt)} {/* Use updated format */}
                </td>
                <td className="py-4 px-6">
                  <button
                    className="text-red-600"
                    onClick={() => deleteUser(user._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="text-blue-600 ml-4"
                    onClick={() => navigate("/manage-users")}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
