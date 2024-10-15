import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [editUser, setEditUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async () => {
    // Check if passwords match before sending to the backend
    if (newUser.password !== newUser.confirmPassword) {
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

  const handleEditUser = async (user) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Password should remain empty for editing
      confirmPassword: "",
    });
  };

  const handleUpdateUser = async () => {
    if (!currentPassword) {
      return alert("Current password is required to update user.");
    }

    const token = localStorage.getItem("token");

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Add/Edit User</h2>
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
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border rounded p-2 mr-2"
          required={editUser ? false : true} // Make password mandatory only when adding
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={newUser.confirmPassword}
          onChange={(e) =>
            setNewUser({ ...newUser, confirmPassword: e.target.value })
          }
          className="border rounded p-2 mr-2"
          required={editUser ? false : true} // Make confirm password mandatory only when adding
        />
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
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white rounded p-2"
          >
            Add User
          </button>
        )}
      </div>

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.role}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-yellow-500 text-white rounded p-1 mr-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white rounded p-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
