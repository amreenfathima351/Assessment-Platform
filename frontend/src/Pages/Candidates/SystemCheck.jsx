import React, { useState, useEffect } from "react";
import CNavbar from "../../Components/CNavbar";
import axios from "axios";

const SystemCheck = () => {
  const [user, setUser] = useState({ name: "", role: "" });
  const [loadingSpeed, setLoadingSpeed] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

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

  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDateAndTime = () => {
    const optionsDate = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date().toLocaleDateString(undefined, optionsDate);
    const time = new Date().toLocaleTimeString(undefined, optionsTime);
    return { date, time };
  };

  const { date, time } = formatDateAndTime();

  const checkCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      alert("Camera is working!");
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      alert("Unable to access camera. Please check your permissions.");
      console.error("Camera check error:", error);
    }
  };

  const checkMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      alert("Microphone is working!");
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      alert("Unable to access microphone. Please check your permissions.");
      console.error("Microphone check error:", error);
    }
  };

  // Function to check internet speed
  const checkInternetSpeed = () => {
    return new Promise((resolve) => {
      const ws = new WebSocket("ws://localhost:8080"); // Connect to the WebSocket server
      let startTime;
      let totalBytes = 0;

      ws.onopen = () => {
        startTime = new Date().getTime();
        setLoadingSpeed(true);
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        if (event.data instanceof Blob) {
          totalBytes += event.data.size; // Get the size of the Blob data
          console.log(`Received ${event.data.size} bytes`);
        } else {
          console.warn("Received data is not a Blob");
        }
      };

      ws.onclose = () => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // in seconds

        if (totalBytes === 0) {
          alert("No data received. Please try again.");
          resolve(0); // Resolve with 0 speed
        } else {
          const speedInMbps = ((totalBytes * 8) / (duration * 1000000)).toFixed(
            2
          ); // Convert to Mbps
          alert(`Your Internet speed is ${speedInMbps} Mbps`);
          resolve(speedInMbps); // Resolve with speed
        }

        setLoadingSpeed(false);
      };

      ws.onerror = (error) => {
        alert("Error checking internet speed: " + error.message);
        console.error("Internet speed check error:", error);
        setLoadingSpeed(false);
        resolve(0); // Resolve with 0 speed on error
      };
    });
  };

  // Function to run all checks simultaneously
  const runAllChecks = async () => {
    await Promise.all([checkCamera(), checkMicrophone(), checkInternetSpeed()]);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CNavbar />
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
              <div className="flex items-center space-x-2">
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
                  <p className="text-sm text-gray-500">{capitalizeName(user.role)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow mt-6">
          <h1 className="text-3xl font-semibold mb-6 text-blue-500">
            System Check
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Ensure Your System's Camera, Microphone, and Internet Speed
            </h2>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={checkCamera}
                className="bg-green-400 text-white py-2 px-6 rounded-full"
              >
                Camera
              </button>
              <button
                onClick={checkMicrophone}
                className="bg-green-400 text-white py-2 px-6 rounded-full"
              >
                Microphone
              </button>
              <button
                onClick={checkInternetSpeed}
                className="bg-green-400 text-white py-2 px-6 rounded-full"
              >
                Internet Speed
              </button>
            </div>

            <p className="mb-4 text-center">
              Press the buttons above to check the system's capabilities.
            </p>

            <button
              onClick={runAllChecks}
              className="bg-blue-500 text-white py-2 px-6 rounded-full mb-4"
            >
              Run
            </button>

            <div className=" text-center">
              <p className="text-gray-600">
                <span className="cursor-pointer">👎</span> Your Internet speed
                is too low for the assessment.
              </p>
              <p className="text-gray-600">
                <span className="cursor-pointer">👎</span> Ensure proper network
                connectivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemCheck;
