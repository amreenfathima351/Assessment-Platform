import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { BiPulse } from "react-icons/bi";
import ANavbar from "../../Components/ANavbar";
import { useNavigate } from "react-router-dom";
const MonitoringDashboard = () => {
  const [systemHealth, setSystemHealth] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [ongoingAssessments, setOngoingAssessments] = useState([]);
  const [candidateActivity, setCandidateActivity] = useState([]);
  const navigate = useNavigate();
   const [user, setUser] = useState({ name: "", role: "" });
 
  // Fetch system health, alerts, and ongoing assessments on load
  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/system-monitor"
        );
        setSystemHealth(response.data.systemHealth);
        setAlerts(response.data.alerts);
        setOngoingAssessments(response.data.ongoingAssessments);
        setCandidateActivity(response.data.candidateActivity);
      } catch (error) {
        console.error("Error fetching monitoring data:", error);
      }
    };

    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
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
        <div className="min-h-screen bg-gray-100 p-8">
          <h1 className="text-4xl font-bold mb-6 text-center">
            System Monitoring Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* System Health Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BiPulse className="mr-2 text-green-500" /> System Health
              </h2>
              <p className="text-lg font-medium">
                CPU Usage: {systemHealth.cpu}%
              </p>
              <p className="text-lg font-medium">
                Memory Usage: {systemHealth.memory}%
              </p>
              <p className="text-lg font-medium">
                Active Connections: {systemHealth.connections}
              </p>
            </div>

            {/* Proctoring Alerts Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <AiOutlineWarning className="mr-2 text-red-500" /> Proctoring
                Alerts
              </h2>
              {alerts.length > 0 ? (
                <ul className="space-y-2">
                  {alerts.map((alert, index) => (
                    <li
                      key={index}
                      className="text-lg font-medium text-red-500"
                    >
                      {alert.message} - Candidate: {alert.candidate}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-gray-500">No active alerts.</p>
              )}
            </div>

            {/* Ongoing Assessments Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Ongoing Assessments
              </h2>
              {ongoingAssessments.length > 0 ? (
                <ul className="space-y-2">
                  {ongoingAssessments.map((assessment) => (
                    <li key={assessment.id} className="text-lg">
                      {assessment.title} - {assessment.candidateCount}{" "}
                      Candidates
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-gray-500">No ongoing assessments.</p>
              )}
            </div>
          </div>

          {/* Candidate Behavior Table */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Candidate Behavior</h2>
            {candidateActivity.length > 0 ? (
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">
                      Candidate
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Action</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {candidateActivity.map((activity, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {activity.candidate}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {activity.action}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(activity.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-lg text-gray-500">
                No recent candidate activity.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
