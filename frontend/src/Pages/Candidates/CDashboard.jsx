import React, { useState, useEffect } from "react";
import CNavbar from "../../Components/CNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import reportimg from "../../img/report.jpg";
import clockimg from "../../img/clock.jpg";
import startimg from "../../img/startimg.jpg";
import CalendarHeader from "../../Components/CalendarHeader";

const CDashboard = () => {
  const [user, setUser] = useState({ name: "", role: "", profileImage: "" });
  const navigate = useNavigate();

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
    const now = new Date();
    const date = now.toLocaleDateString(undefined, optionsDate);
    const time = now.toLocaleTimeString(undefined, optionsTime);
    return { date, time };
  };

  const TakeTest = () => {
    navigate("/start-test");
  };

  const { date, time } = formatDateAndTime();
  const [currentDate, setCurrentDate] = useState(new Date());

  const highlights = {
    14: "bg-red-400 text-white", // 14th is red
    18: "bg-blue-400 text-white", // 18th is blue
    30: "bg-yellow-300 text-black", // 30th is yellow
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty slots before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-[14.28%] h-12"></div>);
    }

    // Render days of the month
    for (let day = 1; day <= lastDay; day++) {
      const highlightClass = highlights[day] || "";
      days.push(
        <div
          key={day}
          className={`w-[14.28%] h-12 flex items-center justify-center rounded-md p-2 ${highlightClass}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CNavbar />
      <div className="flex-grow ml-60 p-6">
        {/* Top Section: Welcome and Date */}
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
                  <p className="text-sm text-gray-500">
                    {capitalizeName(user.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Reminder and Ongoing Test */}
        <div className="grid grid-cols-2 gap-6">
          {/* Test Reminder Card */}
          <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                You have a test arriving soon!!
              </h2>
              <p>Test: AI Developer</p>
              <p>Date: Sep 03 2024</p>
              <p>Time: 11:00 am - 1:00 pm</p>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                Set reminder
              </button>
            </div>
            <img
              src={clockimg} // Replace with your image URL
              alt="Test Reminder"
              className="w-32 h-32 object-cover rounded-lg" // Adjusted size
            />
          </div>

          {/* Ongoing Test Card */}
          <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Ongoing test</h2>
              <p>JavaScript Developer</p>
              <p>Date: Oct 14 2024</p>
              <p>Time: 11:00 am - 12:00 pm</p>
              <p>Test Code: 670cafd1568e2d2c28a3d5cb</p>
              <button
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
                onClick={TakeTest}
              >
                Start test
              </button>
            </div>
            <img
              src={startimg} // Replace with your image URL
              alt="Ongoing Test"
              className="w-32 h-32 object-cover rounded-lg" // Adjusted size
            />
          </div>
        </div>

        {/* Schedule and Missed Test */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Missed Test Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold">Missed test</h2>
            <p>AI & ML Developer</p>
            <p>Date: 4 Sep 2024</p>
            <p>Time: 11:00 am - 1:00 pm</p>
            <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
              Take now
            </button>
          </div>

          {/* Total Attempts Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold">Total attempts</h2>
            <p>Weekly test: 25/28 (3 missed)</p>
            <p>Monthly: 30/32 (2 missed)</p>
            <p>Coding: 56/60 (4 missed)</p>
            <p>Yearly: 39/45 (6 missed)</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              See test results
            </button>
          </div>
        </div>

        {/* Performance & Total Attempts */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mt-4">
              <img
                src={reportimg}
                alt="Graph"
                className="w-full h-auto object-cover"
              />{" "}
              {/* Full width with automatic height */}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <CalendarHeader
              monthYear={monthYear}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDashboard;
