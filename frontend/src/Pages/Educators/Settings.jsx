import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ENavbar from "../../Components/ENavbar";
import axios from "axios";

const Settings = () => {
  const [user, setUser] = useState({
    name: "",
    role: "",
    email: "",
    id: "",
    profileImage: "", // Updated: Ensure it matches backend response
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    push: false,
    app: false,
  });
  const [apiKey, setApiKey] = useState("");
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
        setNotifications(response.data.notifications || notifications); // Assuming notifications are part of user data
        setApiKey(response.data.apiKey || ""); // Assuming apiKey is part of user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePicChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage); // Ensure key matches backend
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("role", user.role);
      // Include notifications and API key in the form data
      formData.append("notifications", JSON.stringify(notifications));
      formData.append("apiKey", apiKey);

      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.put("http://localhost:5000/user/update", formData, config); // Update the endpoint
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        "http://localhost:5000/user/update-password",
        { currentPassword, newPassword },
        config
      );
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password. Please check your current password.");
    }
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
      <ENavbar />
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
                <p className="font-bold">{capitalizeName(user.name)}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-5 text-blue-500">Settings</h1>
          <h1 className="text-2xl font-semibold mb-5 ">
            Manage Your account and configure platform settings
          </h1>
          <div className="container mx-auto my-10 p-5 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
            {/* Profile Settings Section */}
            <div className="flex-grow mb-8 p-5 border rounded-lg bg-gray-50 md:mr-4">
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

          {/* Password Update Section */}
          <div className="mb-8 p-5 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">Change Password</h2>
            <input
              type="password"
              placeholder="Current Password*"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border rounded w-full p-2 my-2"
            />
            <input
              type="password"
              placeholder="New Password*"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded w-full p-2 my-2"
            />
            <input
              type="password"
              placeholder="Confirm Password*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded w-full p-2 my-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={handlePasswordUpdate}
            >
              Save Password
            </button>
          </div>

          {/* Notifications Preferences Section */}
          <div className="mb-8 p-5 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">
              Notifications Preferences
            </h2>
            <div className="flex flex-col">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      email: !prev.email,
                    }))
                  }
                  className="mr-2"
                />
                Email Notifications
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={() =>
                    setNotifications((prev) => ({ ...prev, sms: !prev.sms }))
                  }
                  className="mr-2"
                />
                SMS Notifications
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() =>
                    setNotifications((prev) => ({ ...prev, push: !prev.push }))
                  }
                  className="mr-2"
                />
                Push Notifications
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.app}
                  onChange={() =>
                    setNotifications((prev) => ({ ...prev, app: !prev.app }))
                  }
                  className="mr-2"
                />
                App Notifications
              </label>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={handleUpdateProfile} // Reuse profile update function to save notifications
            >
              Update Preferences
            </button>
          </div>

          {/* Integrations & API Keys Section */}
          <div className="p-5 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">
              Integrations & API Keys
            </h2>
            <label htmlFor="api-key" className="block font-medium">
              API Key:
            </label>
            <input
              type="text"
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
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
        </div>
      </div>
    </div>
  );
};

export default Settings;
