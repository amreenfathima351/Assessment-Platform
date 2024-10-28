import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Editor } from "@monaco-editor/react";

const codeTemplates = {
  javascript: `function example() { return 'Hello, JavaScript!'; }`,
  python: `def example(): return "Hello, Python!"`,
  java: `public class Main { public static void main(String[] args) { System.out.println("Hello, Java!"); }}`,
  cpp: `#include <iostream>\nusing namespace std;\nint main() { cout << "Hello, C++!" << endl; return 0; }`,
  csharp: `using System;\nclass Program { static void Main() { Console.WriteLine("Hello, C#!"); }}`,
};

const AssessmentTaking = () => {
  const { code } = useParams();
  const location = useLocation();
  const { name, email } = location.state || {};
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/assessments/${code}`
        );
        if (response.data) {
          const questions = response.data.questions || [];
          setAssessment({ ...response.data, questions });
          setAnswers(
            questions.map((q) =>
              q.type === "coding-challenge" ? codeTemplates.javascript : ""
            )
          );
        } else {
          setError("Invalid assessment data.");
        }
      } catch (error) {
        setError("Failed to load assessment.");
      }
    };
    fetchAssessment();
  }, [code]);
useEffect(() => {
  const checkPermissions = async () => {
    try {
      const permission = await navigator.permissions.query({ name: "camera" });
      if (permission.state === "granted") {
        startVideo();
      } else if (permission.state === "prompt") {
        // Camera permission hasn't been granted yet, so request it
        await startVideo();
      } else {
        alert(
          "Camera access denied. Please enable it in your browser settings."
        );
      }
    } catch (error) {
      console.error("Permission check error: ", error);
      alert("An error occurred while checking camera permissions.");
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        console.error("Permissions check failed: ", error);
        alert(
          "Permission to access the camera was denied. Please enable it in your browser settings."
        );
      } else {
        console.error("Error accessing the webcam: ", error);
        alert(
          "An error occurred while trying to access the webcam. Please check your device settings."
        );
      }
    }
  };

  checkPermissions();

  return () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  };
}, []);



  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (!allQuestionsAnswered()) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/assessments/submit", {
        assessmentId: assessment.id,
        userId: name,
        answers,
      });
      alert("Assessment submitted successfully!");
      navigate("/candidate-dashboard");
    } catch (error) {
      setError("Failed to submit response.");
    }
  };

  useEffect(() => {
    // Function to enter fullscreen
    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    };

    // Enter fullscreen when the component mounts
    enterFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        alert("You must stay in fullscreen mode!");
        // Automatically submit the test when exiting fullscreen
        handleSubmit();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [handleSubmit]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value || "";
    setAnswers(updatedAnswers);
  };

  const allQuestionsAnswered = () => {
    return answers.every((answer) => answer !== "");
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    const initialCode = codeTemplates[selectedLanguage] || "";
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[selectedQuestionIndex] = initialCode; // Update based on selected question
      return updatedAnswers;
    });
  };

  const selectQuestion = (index) => {
    setSelectedQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (selectedQuestionIndex < assessment.questions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  };

  if (!assessment) return <p>Loading assessment...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
return (
  <div className="flex p-6">
    {/* Right Side: Selected Question */}
    <div className="w-2/3 pr-4">
      {selectedQuestionIndex !== null && (
        <div>
          <h1 className="text-3xl font-bold mb-4 flex justify-between">
            <span>Question {selectedQuestionIndex + 1}:</span>
          </h1>
          {/* Move question text down */}
          <p className="mb-4 text-lg">
            {assessment.questions[selectedQuestionIndex].question}
          </p>
          {/* Display description and test cases for coding questions */}
          {assessment.questions[selectedQuestionIndex].type ===
            "coding-challenge" && (
            <div className="mb-4">
              <p className="font-semibold">Description:</p>
              <p>{assessment.questions[selectedQuestionIndex].description}</p>
              <p className="font-semibold">Test Cases:</p>
              {assessment.questions[selectedQuestionIndex].testCases.map(
                (testCase, index) => (
                  <div key={index}>
                    <p>
                      <strong>Input {index + 1}:</strong> {testCase.input}
                    </p>
                    <p>
                      <strong>Output {index + 1}:</strong> {testCase.output}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
          {assessment.questions[selectedQuestionIndex].type ===
            "short-answer" && (
            <textarea
              value={answers[selectedQuestionIndex]}
              onChange={(e) =>
                handleAnswerChange(selectedQuestionIndex, e.target.value)
              }
              className="border p-3 w-full text-lg"
              rows="6"
              placeholder="Write your short answer here..."
            />
          )}
          {assessment.questions[selectedQuestionIndex].type ===
            "multiple-choice" && (
            <div>
              {assessment.questions[selectedQuestionIndex].options.map(
                (option, i) => (
                  <div key={i} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`option-${i}`}
                      name={`question-${selectedQuestionIndex}`}
                      value={option}
                      checked={answers[selectedQuestionIndex] === option}
                      onChange={() =>
                        handleAnswerChange(selectedQuestionIndex, option)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={`option-${i}`}>{option}</label>
                  </div>
                )
              )}
            </div>
          )}
          {assessment.questions[selectedQuestionIndex].type ===
            "coding-challenge" && (
            <div className="mb-4">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="border p-2 w-full mb-2 text-lg"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
              </select>
              <Editor
                height="400px"
                width="100%"
                language={language}
                value={answers[selectedQuestionIndex] || ""} // Ensure a string is passed
                onChange={(ev, value) =>
                  handleAnswerChange(selectedQuestionIndex, value || "")
                }
                className="border"
                options={{
                  theme: "vs-dark",
                  readOnly: false,
                }}
              />
            </div>
          )}
          <div className="mt-4">
            {selectedQuestionIndex > 0 && (
              <button
                onClick={previousQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Previous
              </button>
            )}
            {selectedQuestionIndex < assessment.questions.length - 1 ? (
              <button
                onClick={nextQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className=""
              >
                
              </button>
            )}
          </div>
        </div>
      )}
    </div>

    {/* Left Side: Combined User Info and Video */}
    <div className="w-1/3 border-l pl-4 flex flex-col">
      <div className="mb-4 p-4 bg-yellow-100 rounded-lg shadow flex flex-col">
        <div className="flex justify-between mb-2">
          <div className="w-2/3 p-2">
            <p>
              <strong>Username:</strong> {name || "Guest"}
            </p>
            <p>
              <strong>Email:</strong> {email || "Not Provided"}
            </p>
            <p>
              <strong>Assessment ID:</strong> {assessment.id}
            </p>
            <p>
              <strong>Title:</strong> {assessment.title}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-2">Questions</h2>
      <ul className="list-disc pl-5 flex">
        {assessment.questions.map((question, index) => {
          const isAnswered = answers[index] !== "";
          const cardColor = isAnswered ? "bg-green-300" : "bg-red-300"; // Change color based on answer status

          return (
            <li
              key={index}
              className={`${cardColor} mb-3 p-3 rounded mr-1 w-150 h-150 flex items-center justify-center`}
              style={{ listStyleType: "none" }}
            >
              <button
                onClick={() => selectQuestion(index)}
                className="text-white text-3xl font-semibold"
              >
                {index + 1}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white py-3 px-6 rounded-lg text-xl"
        >
          Submit Assessment
        </button>
      </div>
    </div>

    <div className="fixed bottom-4 right-4">
      <video ref={videoRef} className="border w-48 h-36" autoPlay playsInline>
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
);


};

export default AssessmentTaking;
