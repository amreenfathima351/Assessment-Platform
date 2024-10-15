import React, { useState } from "react";
import SignUpImg from "../img/Signup.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faKey,
  faBriefcase,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for API requests

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For error handling
  const navigate = useNavigate(); // Use useNavigate hook

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the backend for signup
      const res = await axios.post("http://localhost:5000/signup", formData);

      // Save the token in localStorage upon successful signup
      localStorage.setItem("token", res.data.token);

      // If successful, redirect to login page or dashboard
      alert(res.data.msg);
      navigate("/");
    } catch (err) {
      // Handle errors (e.g., passwords don't match, server errors)
      if (err.response) {
        setErrorMessage(err.response.data.msg);
      } else {
        setErrorMessage("Error submitting the form.");
      }
    }
  };

  // Function to edit user
  const editUser = async (userId, updatedData) => {
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    try {
      const res = await axios.put(
        `http://localhost:5000/user/${userId}`,
        updatedData,
        {
          headers: { Authorization: token }, // Send token in headers
        }
      );
      alert(res.data.msg);
    } catch (err) {
      console.error(err.response?.data?.msg || "Error editing user");
    }
  };

  // Function to delete user
  const deleteUser = async (userId) => {
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    try {
      const res = await axios.delete(`http://localhost:5000/user/${userId}`, {
        headers: { Authorization: token }, // Send token in headers
      });
      alert(res.data.msg);
    } catch (err) {
      console.error(err.response?.data?.msg || "Error deleting user");
    }
  };

  return (
    <section className="h-screen bg-blue-200/50">
      <div className="container h-full mx-auto flex justify-center items-center">
        <div className="card bg-white shadow-lg rounded-3xl max-w-4xl w-full">
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              <div className="w-1/2 p-4">
                <p className="text-center text-2xl font-bold mb-4">Sign Up</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Error Message */}
                  {errorMessage && (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                  )}

                  {/* Name Input */}
                  <div className="flex items-center mb-3">
                    <FontAwesomeIcon icon={faUser} className="text-lg mr-2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Your Name"
                      className="form-control w-full bg-gray-100 px-3 py-2 rounded"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex items-center mb-3">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-lg mr-2"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="form-control w-full bg-gray-100 px-3 py-2 rounded"
                      required
                    />
                  </div>

                  {/* Role Select */}
                  <div className="flex items-center mb-3">
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      className="text-lg mr-2"
                    />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="form-select w-full bg-gray-100 px-3 py-2 rounded"
                      required
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      <option value="candidate">Candidate</option>
                      <option value="educator">Educator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Password Input */}
                  <div className="flex items-center mb-3">
                    <FontAwesomeIcon icon={faLock} className="text-lg mr-2" />
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="form-control w-full bg-gray-100 px-3 py-2 rounded"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3"
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="flex items-center mb-3">
                    <FontAwesomeIcon icon={faKey} className="text-lg mr-2" />
                    <div className="relative w-full">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        className="form-control w-full bg-gray-100 px-3 py-2 rounded"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-3"
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="flex justify-center items-center mb-4">
                    <input type="checkbox" className="mr-2" required />
                    <label className="text-sm">
                      By clicking 'sign up' you're agreeing to the{" "}
                      <a href="#!" className="text-blue-500 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#!" className="text-blue-500 hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>

                  {/* Register Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="btn bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>

              {/* Image Section */}
              <div className="w-1/2">
                <img src={SignUpImg} alt="Sign Up" className="rounded-2xl" />
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
