import { AiOutlineFileExcel } from "react-icons/ai";
import ANavbar from "../../Components/ANavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
const ReportsPage = () => {
  const [reportType, setReportType] = useState("performance");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [user, setUser] = useState({ name: "", role: "" });
  
  const navigate = useNavigate();

  // Mock function to generate report data based on selected filters
  const generateReport = () => {
    const mockData = {
      performance: [
        { assessment: "Java Test", score: 85, candidate: "Alice" },
        { assessment: "React Quiz", score: 90, candidate: "Bob" },
      ],
      activity: [
        { user: "Alice", action: "Logged In", timestamp: "2024-10-14 09:30" },
        {
          user: "Bob",
          action: "Started Assessment",
          timestamp: "2024-10-15 10:00",
        },
      ],
      compliance: [
        { check: "Webcam Enabled", status: "Passed" },
        { check: "Proctoring Alerts Reviewed", status: "Pending" },
      ],
    };

    setGeneratedReport(mockData[reportType]);
  };

  const exportReport = () => {
    const data = JSON.stringify(generatedReport, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportType}_report_${new Date().toISOString()}.json`;
    link.click();
  };
  
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
    <div className="min-h-screen bg-gray-100 p-8">
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
          <h1 className="text-4xl font-bold mb-6 text-center">
            Reports and Analytics
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Report Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-lg font-semibold mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="performance">Assessment Performance</option>
                  <option value="activity">User Activity</option>
                  <option value="compliance">System Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Generate and Export Buttons */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={generateReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                Generate Report
              </button>
              <button
                onClick={exportReport}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
              >
                <AiOutlineFileExcel className="mr-2" /> Export as JSON
              </button>
            </div>

            {/* Generated Report Display */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Generated Report</h2>
              {generatedReport ? (
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      {Object.keys(generatedReport[0]).map((key, index) => (
                        <th key={index} className="border px-4 py-2 text-left">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex} className="border px-4 py-2">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-lg text-gray-500">
                  No report generated yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
