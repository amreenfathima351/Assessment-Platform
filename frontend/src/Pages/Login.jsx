import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginImg from "../img/Login.jpg"; // Ensure this path is correct
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/login", formData);

      // Get the token and role from the response
      const { token, role } = res.data;

      // Store the token in localStorage
      localStorage.setItem("authToken", token); // Use the same name throughout your app

      // Navigate to the respective role's dashboard
      if (role === "candidate") {
        navigate("/candidate-dashboard");
      } else if (role === "educator") {
        navigate("/educator-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen bg-blue-200/50">
      <div className="container h-full mx-auto flex justify-center items-center">
        <div className="card bg-white shadow-lg rounded-3xl max-w-4xl w-full">
          <div className="card-body p-6">
            <div className="flex justify-between items-center">
              {/* Form Section */}
              <div className="w-1/2 p-4">
                <p className="text-center text-2xl font-bold mb-4">
                  Welcome Back!
                </p>
                <p className="text-center text-lg mb-4">
                  Login to Your Account
                </p>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center mb-4">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-lg mr-3"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control w-full bg-gray-100 px-3 py-2 rounded"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center mb-1">
                      <FontAwesomeIcon icon={faLock} className="text-lg mr-3" />
                      <div className="relative w-full">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control w-full bg-gray-100 px-3 py-2 rounded"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3"
                        >
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="btn bg-blue-600 text-white px-4 py-2 rounded"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <p>
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-blue-500 hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>

              {/* Image Section */}
              <div className="w-1/2 hidden md:block">
                <img
                  src={LoginImg}
                  alt="Sample"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
