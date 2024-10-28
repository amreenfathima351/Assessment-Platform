import React, { useState, useEffect } from "react";
import ANavbar from "../../Components/ANavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AssessmentConfiguration = () => {
  const [user, setUser] = useState({ name: "", role: "" });
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();
  const [assessmentDetails, setAssessmentDetails] = useState({
    assessmentId: "",
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    duration: "",
    timeZone: "",
    allowResources: { calculator: false, notes: false, books: false },
    proctoringEnabled: false,
    webcamEnabled: false,
    microphoneEnabled: false,
    fullscreenMode: false,
  });

  // Handle form input changes, including nested fields like allowResources
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (assessmentDetails.allowResources.hasOwnProperty(name)) {
        setAssessmentDetails((prev) => ({
          ...prev,
          allowResources: { ...prev.allowResources, [name]: checked },
        }));
      } else {
        setAssessmentDetails((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setAssessmentDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "http://localhost:5000/assessments",
        assessmentDetails,
        config
      );
      alert("Assessment saved successfully!");
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("Failed to save assessment.");
    }
  };

  const handlePreview = () => setShowPreview(true);
  const handleClosePreview = () => setShowPreview(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const capitalize = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const formatDate = (date = new Date()) =>
    date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date = new Date()) =>
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <ANavbar />
      <div className="flex-grow ml-60 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-xl font-semibold">Welcome,</h2>
            <h2 className="text-xl font-bold">{capitalize(user.name)}</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="font-bold">{formatDate()}</p>
              <p className="font-bold">{formatTime()}</p>
            </div>
            <div
              className="flex items-center space-x-4"
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

        {/* Assessment Configuration Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Assessment Configuration
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Assessment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="assessmentId"
                value={assessmentDetails.assessmentId}
                onChange={handleChange}
                placeholder="Assessment ID"
                className="border rounded p-2"
                required
              />
              <input
                type="text"
                name="title"
                value={assessmentDetails.title}
                onChange={handleChange}
                placeholder="Assessment Title"
                className="border rounded p-2"
                required
              />
              <textarea
                name="description"
                value={assessmentDetails.description}
                onChange={handleChange}
                placeholder="Assessment Instruction"
                className="border rounded p-2 md:col-span-2"
                rows="3"
              />
            </div>

            <h2 className="text-xl font-semibold mt-4 mb-2">
              Scheduling Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                name="startDate"
                value={assessmentDetails.startDate}
                onChange={handleChange}
                className="border rounded p-2"
                required
              />
              <input
                type="time"
                name="startTime"
                value={assessmentDetails.startTime}
                onChange={handleChange}
                className="border rounded p-2"
                required
              />
              <input
                type="date"
                name="endDate"
                value={assessmentDetails.endDate}
                onChange={handleChange}
                className="border rounded p-2"
                required
              />
              <input
                type="time"
                name="endTime"
                value={assessmentDetails.endTime}
                onChange={handleChange}
                className="border rounded p-2"
                required
              />
              <input
                type="number"
                name="maxAttempts"
                value={assessmentDetails.maxAttempts}
                onChange={handleChange}
                placeholder="Max Attempts"
                className="border rounded p-2"
              />
              <input
                type="text"
                name="passingCriteria"
                value={assessmentDetails.passingCriteria}
                onChange={handleChange}
                placeholder="Pass Criteria (e.g., 60%)"
                className="border rounded p-2"
              />
            </div>

            <h2 className="text-xl font-semibold mt-4 mb-2">
              AI Proctoring Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="webcamEnabled"
                  checked={assessmentDetails.webcamEnabled}
                  onChange={handleChange}
                  className="mr-2"
                />
                Enable Webcam
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="microphoneEnabled"
                  checked={assessmentDetails.microphoneEnabled}
                  onChange={handleChange}
                  className="mr-2"
                />
                Enable Microphone
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="screenRecordingEnabled"
                  checked={assessmentDetails.screenRecordingEnabled}
                  onChange={handleChange}
                  className="mr-2"
                />
                Enable Screen Recording
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="screenRecordingEnabled"
                  checked={assessmentDetails.screenRecordingEnabled}
                  onChange={handleChange}
                  className="mr-2"
                />
                Full Screen mode
              </label>
              <textarea
                name="proctoringGuidelines"
                value={assessmentDetails.proctoringGuidelines}
                onChange={handleChange}
                placeholder="Enter the mail ID's of Candidate who are all going to attend the assessment"
                className="border rounded p-2 md:col-span-2"
                rows="4"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={handlePreview}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Preview
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentConfiguration;
