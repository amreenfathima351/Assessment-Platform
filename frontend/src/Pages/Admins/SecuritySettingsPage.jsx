import React, { useState, useEffect } from "react";
import axios from "axios";
import ANavbar from "../../Components/ANavbar";
import { useNavigate } from "react-router-dom";

const SystemSettingsPage = () => {
  const [user, setUser] = useState({
    name: "",
    role: "",
    email: "",
    profileImage: "",
    notifications: {
      email: false,
      sms: false,
      push: false,
      app: false,
    },
    apiKey: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
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

    const fetchAuditLogs = () => {
      const mockLogs = [
        {
          action: "Login",
          user: "Alice",
          timestamp: "2024-10-15 09:00",
          status: "Success",
        },
        {
          action: "Changed Password",
          user: "Bob",
          timestamp: "2024-10-15 10:30",
          status: "Success",
        },
        {
          action: "Access Denied",
          user: "Charlie",
          timestamp: "2024-10-15 11:00",
          status: "Failed",
        },
      ];
      setAuditLogs(mockLogs);
    };

    fetchUserData();
    fetchAuditLogs();
  }, []);

  const handleProfilePicChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("role", user.role);
      formData.append("notifications", JSON.stringify(user.notifications));
      formData.append("apiKey", user.apiKey);

      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.put("http://localhost:5000/user/update", formData, config);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleNotificationChange = (key) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

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
    const optionsTime = { hour: "2-digit", minute: "2-digit" };
    const date = new Date().toLocaleDateString(undefined, optionsDate);
    const time = new Date().toLocaleTimeString(undefined, optionsTime);
    return { date, time };
  };

  const { date, time } = formatDateAndTime();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <ANavbar />
      <div className="flex-grow ml-60 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-xl font-semibold">Welcome,</h2>
            <h2 className="text-xl font-bold">{capitalizeName(user.name)}</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-gray-500">Today,</p>
              <p className="font-bold">{date}</p>
              <p className="font-bold">{time}</p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={
                  user.profileImage
                    ? `http://localhost:5000${user.profileImage}`
                    : "default-profile-pic.png"
                }
                alt="User Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-5 text-blue-500">Settings</h1>
          <h1 className="text-2xl font-semibold mb-5 ">
            Manage Your account and configure platform settings
          </h1>

          <div className="mb-8 p-5 border rounded-lg bg-gray-50 flex md:flex-row">
            <div className="flex-grow mb-8 p-5 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-3">Profile Settings</h2>
              <div>
                <p>
                  <strong>ID:</strong> {user._id}
                </p>
                <p>
                  <strong>Name:</strong> {capitalizeName(user.name)}
                </p>
                <p>
                  <strong>Role:</strong> {capitalizeName(user.role)}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="border rounded w-full p-2 my-2"
                />
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleUpdateProfile}
              >
                Update Profile
              </button>
            </div>

            {/* Profile Image Display Section */}
            <div className="mb-8 p-5 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-3">Profile Picture</h2>
              <img
                src={
                  user.profileImage
                    ? `http://localhost:5000${user.profileImage}`
                    : "https://via.placeholder.com/100"
                }
                alt="Profile"
                className="w-48 h-48 rounded-full shadow-md"
              />
            </div>
          </div>
          {/* Notifications Preferences Section */}
          

          {/* Integrations & API Keys Section */}
          <div className="p-5 border rounded-lg bg-gray-50 mb-8">
            <h2 className="text-lg font-semibold mb-3">
              Integrations & API Keys
            </h2>
            <label htmlFor="api-key" className="block font-medium">
              API Key:
            </label>
            <input
              type="text"
              id="api-key"
              value={user.apiKey}
              onChange={(e) => setUser({ ...user, apiKey: e.target.value })}
              placeholder="Enter Your API Key"
              className="border rounded w-full p-2 my-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={handleUpdateProfile} // Reuse profile update function to save API key
            >
              Save API Key
            </button>
          </div>

          {/* Audit Logs Section */}
          <h2 className="text-2xl font-semibold mb-4">Audit Logs</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Action</th>
                <th className="border px-4 py-2 text-left">User</th>
                <th className="border px-4 py-2 text-left">Timestamp</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{log.action}</td>
                  <td className="border px-4 py-2">{log.user}</td>
                  <td className="border px-4 py-2">{log.timestamp}</td>
                  <td
                    className={`border px-4 py-2 ${
                      log.status === "Success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {log.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
