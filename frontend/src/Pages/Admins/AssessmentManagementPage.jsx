import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AssessmentManagementPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAssessments, setFilteredAssessments] = useState([]);

  // Fetch assessments from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/assessments")
      .then((res) => {
        setAssessments(res.data);
        setFilteredAssessments(res.data);
      })
      .catch((err) => console.error("Error fetching assessments:", err));
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = assessments.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.status.toLowerCase().includes(query)
    );
    setFilteredAssessments(filtered);
  };

  // Handle delete assessment
  const deleteAssessment = (id) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      axios
        .delete(`http://localhost:5000/assessments/${id}`)
        .then(() => {
          setAssessments(assessments.filter((a) => a._id !== id));
          setFilteredAssessments(
            filteredAssessments.filter((a) => a._id !== id)
          );
        })
        .catch((err) => console.error("Error deleting assessment:", err));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Assessment Management</h1>
        <input
          type="text"
          placeholder="Search assessments..."
          value={searchQuery}
          onChange={handleSearch}
          className="border rounded px-4 py-2"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date Created</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssessments.map((assessment) => (
            <tr key={assessment._id}>
              <td className="border p-2">{assessment.title}</td>
              <td className="border p-2">{assessment.status}</td>
              <td className="border p-2">
                {new Date(assessment.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2 flex gap-2">
                <Link
                  to={`/assessments/edit/${assessment._id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteAssessment(assessment._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
                <Link
                  to={`/assessments/results/${assessment._id}`}
                  className="text-green-600"
                >
                  View Results
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentManagementPage;
