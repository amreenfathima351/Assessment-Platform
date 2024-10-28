// src/AssessmentCreation.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ENavbar from "../../Components/ENavbar";

const AssessmentCreation = () => {
  const [assessment, setAssessment] = useState({ id: "", title: "" });
  const [questions, setQuestions] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState({ name: "", role: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          "http://localhost:5000/user/me",
          config
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const capitalizeName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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

  const generateRandomAssessmentCode = () =>
    `ELITE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const handleAssessmentChange = (e) => {
    const { name, value } = e.target;
    setAssessment((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on change
  };

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        type: "multiple-choice",
        question: "",
        options: [],
        correctAnswer: "",
        testCases: [],
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

const addTestCase = (index) => {
  setQuestions((prev) => {
    const updated = [...prev]; // Create a copy of the questions array

    // Ensure testCases is initialized as an array (if it's undefined)
    const updatedTestCases = updated[index].testCases
      ? [...updated[index].testCases]
      : [];

    // Add the new test case to the testCases array immutably
    updatedTestCases.push({ input: "", output: "" });

    // Set the updated test cases back in the question
    updated[index] = {
      ...updated[index], // Copy the existing question object
      testCases: updatedTestCases, // Update the testCases immutably
    };

    return updated;
  });
};


  const handleTestCaseChange = (questionIndex, testCaseIndex, event) => {
    const { name, value } = event.target;
    setQuestions((prev) => {
      const updated = [...prev];
      updated[questionIndex].testCases[testCaseIndex][name] = value;
      return updated;
    });
  };

  const removeTestCase = (questionIndex, testCaseIndex) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[questionIndex].testCases.splice(testCaseIndex, 1);
      return updated;
    });
  };


const handleSubmit = async (event) => {
  event.preventDefault();
  if (questions.length === 0) {
    setError("You must add at least one question.");
    return;
  }

  try {
    const token = localStorage.getItem("authToken"); // Retrieve the token
    const config = { headers: { Authorization: `Bearer ${token}` } }; // Set up the config with the token

    const existingAssessments = await axios.get(
      "http://localhost:5000/api/assessments",
      config // Include config with headers
    );

    const isDuplicate = existingAssessments.data.some(
      (item) => item.id === assessment.id
    );

    if (isDuplicate) {
      setError("Assessment ID already exists. Please choose a unique ID.");
      return;
    }

    const code = generateRandomAssessmentCode();
    setPreview({ assessment, questions, code });
    setError(""); // Clear any previous error
  } catch (error) {
    console.error("Error checking assessments:", error);
    setError(
      "Failed to save assessment: " +
        (error.response?.data?.message || "Unauthorized")
    );
  }
  };
  
  const fetchUsernameById = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `http://localhost:5000/user/${userId}`,
        config
      );
      return response.data.name; // Assuming response contains { name: '...' }
    } catch (error) {
      console.error("Error fetching username:", error);
      return "";
    }
  };


  const handlePreviewSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const newAssessment = {
        id: assessment.id,
        title: assessment.title,
        code: preview.code,
        questions: questions,
        createdBy: user._id, // Store the ID of the creator
        createdName: user.name, // Store the name of the creator
        createdDate: new Date(), // Current date and time
        role: user.role, // Store the role of the creator
        userId: user._id, // Include userId if required
      };

      const response = await axios.post(
        "http://localhost:5000/api/assessments",
        newAssessment,
        config
      );

      console.log("Assessment created:", response.data);
      // Reset state after successful submission
      setAssessment({ id: "", title: "" });
      setQuestions([]);
      setPreview(null);
      navigate("/assessment-create"); // Navigate to assessments list or relevant page
    } catch (error) {
      console.error("Error submitting assessment:", error.response?.data);
      setError(
        "Error submitting assessment: " +
          (error.response?.data?.message || "Unauthorized")
      );
    }
  };









const generateUniqueId = () => {
  return `assessment_${new Date().getTime()}`; // Simple unique ID generation
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
              <p className="font-bold">{date}</p>
              <p className="font-bold">{time}</p>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={
                  user.profileImage
                    ? `http://localhost:5000${user.profileImage}`
                    : "https://via.placeholder.com/100"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full shadow-md"
              />
              <div>
                <p className="font-bold">{capitalizeName(user.name)}</p>
                <p className="text-sm text-gray-500">
                  {capitalizeName(user.role)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow mt-6">
          <h1 className="text-2xl mb-4">Create Assessment</h1>
          {error && <p className="text-red-500">{error}</p>}
          <label className="block mb-2">
            Assessment ID:
            <input
              type="text"
              name="id"
              value={assessment.id}
              onChange={handleAssessmentChange}
              className="border p-2 w-full"
              required
            />
          </label>
          <label className="block mb-2">
            Title:
            <input
              type="text"
              name="title"
              value={assessment.title}
              onChange={handleAssessmentChange}
              className="border p-2 w-full"
              required
            />
          </label>
          <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <div key={index} className="mb-4 border p-4 rounded">
                <label className="block mb-2">
                  Question {index + 1}:
                  <input
                    type="text"
                    name="question"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e)}
                    className="border p-2 w-full"
                    required
                  />
                </label>
                <label className="block mb-2">
                  Question Type:
                  <select
                    name="type"
                    value={q.type}
                    onChange={(e) => handleQuestionChange(index, e)}
                    className="border p-2 w-full"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="short-answer">Short Answer</option>
                    <option value="coding-challenge">Coding Challenge</option>
                  </select>
                </label>

                {q.type === "multiple-choice" && (
                  <>
                    <label className="block mb-2">
                      Options (comma-separated):
                      <input
                        type="text"
                        onChange={(e) => {
                          const options = e.target.value.split(",");
                          setQuestions((prev) => {
                            const updated = [...prev];
                            updated[index].options = options;
                            return updated;
                          });
                        }}
                        className="border p-2 w-full"
                      />
                    </label>
                    <label className="block mb-2">
                      Correct Answer:
                      <input
                        type="text"
                        name="correctAnswer"
                        value={q.correctAnswer}
                        onChange={(e) => handleQuestionChange(index, e)}
                        className="border p-2 w-full"
                        required
                      />
                    </label>
                  </>
                )}

                {q.type === "short-answer" && (
                  <>
                    <label className="block mb-2">
                      Keywords (comma-separated):
                      <input
                        type="text"
                        name="keywords"
                        value={q.keywords || ""}
                        onChange={(e) => handleQuestionChange(index, e)}
                        className="border p-2 w-full"
                      />
                    </label>
                  </>
                )}

                {q.type === "coding-challenge" && (
                  <>
                    <label className="block mb-2">
                      Description:
                      <textarea
                        name="description"
                        value={q.description || ""}
                        onChange={(e) => handleQuestionChange(index, e)}
                        className="border p-2 w-full"
                      />
                    </label>

                    <h3 className="font-semibold">Test Cases:</h3>

                    {q.testCases.map((tc, tcIndex) => (
                      <div key={tcIndex} className="mb-2 border p-2 rounded">
                        <label className="block mb-2">
                          Input:
                          <input
                            type="text"
                            name="input"
                            value={tc.input}
                            onChange={(e) =>
                              handleTestCaseChange(index, tcIndex, e)
                            }
                            className="border p-2 w-full"
                          />
                        </label>
                        <label className="block mb-2">
                          Output:
                          <input
                            type="text"
                            name="output"
                            value={tc.output}
                            onChange={(e) =>
                              handleTestCaseChange(index, tcIndex, e)
                            }
                            className="border p-2 w-full"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeTestCase(index, tcIndex)}
                          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                        >
                          Remove Test Case
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addTestCase(index)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Add Test Case
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                  Remove Question
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Preview Assessment
            </button>
          </form>

          {preview && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl font-semibold">Preview Assessment</h2>
                <p>Assessment ID: {preview.assessment.id}</p>
                <p>Title: {preview.assessment.title}</p>
                <p>Code: {preview.code}</p>
                <h3 className="font-semibold">Questions:</h3>
                {preview.questions.map((q, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      Question {index + 1}: {q.question}
                    </p>
                    {/* You can add more question details here */}
                  </div>
                ))}
                <button
                  onClick={handlePreviewSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                >
                  Submit Assessment
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading && <p className="text-blue-500">Submitting assessment...</p>}
        </div>
      </div>
    </div>
  );
};

export default AssessmentCreation;
