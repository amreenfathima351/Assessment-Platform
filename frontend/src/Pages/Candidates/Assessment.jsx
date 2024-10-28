import React, { useEffect, useState } from "react";
import logoElite from "../../img/logo1.png";
import logoOnlineTest from "../../img/TestHeader2.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Assessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testCode } = location.state || {}; // Retrieve testCode from state
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/assessments/${testCode}`
        );
        if (response.data) {
          setAssessmentTitle(response.data.title);
          setNumberOfQuestions(response.data.questions.length);
        } else {
          console.error("No data found for the provided test code.");
        }
      } catch (error) {
        console.error("Failed to fetch assessment details:", error);
      }
    };

    if (testCode) {
      fetchAssessmentDetails();
    }
  }, [testCode]);

  const start = () => {
    navigate("/start-test2");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-[#e9f0f9] p-2 rounded-md w-full">
        <div className="w-28">
          <img src={logoElite} alt="Elite Logo" className="w-full" />
        </div>
        <h1 className="text-4xl font-bold text-center text-gray-800 flex-grow">
          {assessmentTitle || "Assessment Title"}
        </h1>
        <div className="w-28">
          <img src={logoOnlineTest} alt="Online Test Logo" className="w-full" />
        </div>
      </div>

      {/* Instructions Section */}
      <h2 className="text-center text-xl my-4">
        Instructions to be followed by Candidate
      </h2>
      <ul className="list-disc pl-5 text-lg text-left w-3/4 mx-auto my-4">
        <li>
          This is an AI Proctored test.{" "}
          <span role="img" aria-label="Magnifying glass">
            🔍
          </span>
        </li>
        <li>Each correct answer carries 1 mark.</li>
        <li>No negative marking.</li>
        <li>
          If you encounter any technical issues, document them and report them
          to the exam administrators immediately.
        </li>
        <li>
          Double-check that all your answers are submitted correctly before the
          test ends.
        </li>
        <li>Malpractice will lead to disqualification of the test.</li>
        <li>
          The test contains {numberOfQuestions || 0} questions to be answered in
          30 minutes.{" "}
          <span role="img" aria-label="Clipboard">
            📋
          </span>
        </li>
      </ul>

      {/* Button Section */}
      <div className="text-center">
        <button
          className="bg-[#4574CF] text-white py-2 px-4 rounded-md text-lg hover:bg-[#0056b3] transition duration-200"
          onClick={start}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Assessment;
