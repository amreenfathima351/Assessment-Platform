import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EnterTestCode = () => {
  const [testCode, setTestCode] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the name and email from localStorage
    const name = localStorage.getItem("userName") || "";
    const email = localStorage.getItem("userEmail") || "";

    setUserName(name);
    setUserEmail(email);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!testCode || !userName) {
      alert("Please enter a test code and your name.");
      return;
    }

    // Redirect to the assessment-taking page with the entered test code, name, and email
    navigate(`/assessment/${testCode}`, {
      state: { name: userName, email: userEmail },
    });
  };


  return (
    <section className="h-screen bg-blue-200">
      <div className="container mx-auto h-full flex justify-center items-center">
        <div className="bg-white shadow-lg border border-black rounded-2xl p-8 max-w-lg">
          <h1 className="text-center text-3xl font-bold mb-5">Take Test!</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-center">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter Your Name"
                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email Address"
                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Test Code"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Start Assessment
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EnterTestCode;
