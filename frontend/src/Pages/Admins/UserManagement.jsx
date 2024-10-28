import React, { useState, useEffect } from "react";
import axios from "axios";
import ANavbar from "../../Components/ANavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const UserManagement = () => {
  const [user, setUser] = useState({ name: "", role: "", profileImage: "" });
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    fetchUserData(); // Correctly invoke this function
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("http://localhost:5000/user/me", config);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleAddUser = async () => {
    const { name, email, role, password, confirmPassword } = newUser;

    // Validate fields
    if (!name || !email || !role) {
      return alert("All fields are required!");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/signup",
        newUser
      );
      console.log("User added successfully:", response.data);
      fetchUsers(); // Refresh user list after adding
      setNewUser({
        name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      }); // Reset form
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Clear password fields
      confirmPassword: "",
    });
  };

  const handleUpdateUser = async () => {
    if (!currentPassword) {
      return alert("Current password is required to update user.");
    }

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        `http://localhost:5000/users/${editUser._id}`,
        { ...newUser, currentPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
      setEditUser(null);
      setCurrentPassword(""); // Reset the current password
      setNewUser({
        name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
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

  const formatDateAndTime = (dateString) => {
    const optionsDate = {
      weekday:"long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date().toLocaleDateString(undefined, optionsDate);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <ANavbar />
      <div className="flex-grow ml-60 p-6">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-xl font-semibold">Welcome,</h2>
            <h2 className="text-xl font-bold">{capitalizeName(user.name)}</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="font-bold">{formatDateAndTime(new Date())}</p>
              <p className="font-bold">
                {new Date().toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-2"
                onClick={() => navigate("/security-setting")}
              >
                <img
                  src={
                    user.profileImage
                      ? `http://localhost:5000${user.profileImage}`
                      : "https://via.placeholder.com/100"
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-md"
                />
                <div></div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          User Management
        </h1>
        <h2 className="text-xl font-semibold mb-4">Manage User Accounts</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border rounded p-2 mr-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border rounded p-2 mr-2"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border rounded p-2 mr-2"
            required
          >
            <option value="">Select Role</option>
            <option value="candidate">Candidate</option>
            <option value="educator">Educator</option>
            <option value="admin">Administrator</option>
          </select>

          {editUser ? (
            <>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border rounded p-2 mr-2"
                required
              />
              <button
                onClick={handleUpdateUser}
                className="bg-blue-500 text-white rounded p-2"
              >
                Update User
              </button>
            </>
          ) : (
            <>
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="border rounded p-2 mr-2"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={newUser.confirmPassword}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirmPassword: e.target.value })
                }
                className="border rounded p-2 mr-2"
                required
              />
              <button
                onClick={handleAddUser}
                className="bg-green-500 text-white rounded p-2"
              >
                Add User
              </button>
            </>
          )}
        </div>

        {loading ? ( // Loading state
          <p>Loading users...</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Created At</th>{" "}
                {/* New column for created date */}
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-4 px-6">{capitalizeName(user.name)}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{capitalizeName(user.role)}</td>
                  <td className="py-4 px-6">
                    {formatDate(user.createdAt)}
                  </td>{" "}
                  {/* Display createdAt */}
                  <td className="py-4 px-6">
                    <FontAwesomeIcon
                      icon={faPen}
                      className="cursor-pointer text-blue-500 mx-2"
                      onClick={() => handleEditUser(user)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="cursor-pointer text-red-500 mx-2"
                      onClick={() => handleDeleteUser(user._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
