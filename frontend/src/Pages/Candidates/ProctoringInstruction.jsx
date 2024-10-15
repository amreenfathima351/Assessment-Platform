import React,{useState,useEffect} from 'react'
import CNavbar from '../../Components/CNavbar'
import axios from 'axios';
import { jsPDF } from "jspdf"; // Import jsPDF
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDesktop,
  faCamera,
  faMicrophone,
  faBellSlash,
  faBatteryFull,
  faWifi,
  faTimes,
  faExpand,
  faHome,
  faVideoSlash,
  faVideo,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
const ProctoringInstruction = () => {
    
    
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
    const downloadPDF = () => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16, // or "smart", default is 16
      });

      // Set margins
      const margin = 20; // 20mm margin
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;

      // Title
      doc.setFontSize(24);
      doc.text("Proctoring Instruction", margin, 30);

      // Elite Platform Information
      doc.setFontSize(16);
      doc.text("About the Elite Platform:", margin, 50);

      doc.setFontSize(12);
      const platformInfo = [
        "Elite is a comprehensive assessment platform designed to enhance the learning and evaluation experience.",
        "Our platform employs advanced AI technology to ensure a secure and fair testing environment.",
        "We aim to provide students with a seamless experience, enabling them to focus on their performance.",
      ];

      let y = 60; // Initial vertical position
      platformInfo.forEach((info) => {
        doc.text(info, margin, y, { maxWidth: pageWidth });
        y += 10; // Increment vertical position for the next line
      });

      // Instructions Header
      doc.setFontSize(16);
      doc.text(
        "Instruction to be followed while you are taking test in Elite:",
        margin,
        y + 10
      );

      // Instructions
      doc.setFontSize(12);
      const instructions = [
        "1. This is an AI Proctored test. Should be taken only from desktop/laptop.",
        "2. Ensure camera and microphone are on.",
        "3. Turn off notifications on your computer and phone to prevent interruptions.",
        "4. Ensure that all your answers are correctly submitted before the test concludes.",
        "5. Ensure your desktop/laptop is fully charged and connected to a reliable power source.",
        "6. Test your internet connection to make sure it's stable and meets the minimum speed requirement of 2 MBPS.",
        "7. Close all unnecessary applications and tabs on your computer to avoid distractions and accidental window swaps.",
        "8. Stay in full-screen Mode to avoid accidental termination of the test.",
        "9.  Find a quiet place where you won’t be disturbed during the exam.",
      ];

      y += 20; // Move down for instructions
      instructions.forEach((instruction) => {
        doc.text(instruction, margin, y, { maxWidth: pageWidth });
        y += 10; // Increment vertical position for the next line
      });

      // Footer
      doc.setFontSize(10);
      doc.text(
        "Thank you for using Elite. We wish you the best of luck!",
        margin,
        y + 20
      );

      // Save the PDF
      doc.save("proctoring_instruction.pdf");
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
          <h1 className="text-3xl font-semibold ml-5 mb-6 text-blue-500">
            Proctoring Instruction
          </h1>

          <div className="bg-white ml-5 p-6 rounded-lg shadow-md ">
            <h2 className="text-2xl font-bold mb-4">
              Instruction to be followed while you are taking test in Elite:
            </h2>
            <ul className="list-none mb-8">
              <li className="mb-4 text-xl">
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faDesktop} />
                </span>
                This is an AI Proctored test. Should be taken only from
                desktop/laptop.
              </li>
              <li className="mb-4 text-xl">
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faCamera} />
                </span>
                Ensure camera and{" "}
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faMicrophone} />
                </span>
                microphone are on.
              </li>
              <li className="mb-4 text-xl">
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faBellSlash} />
                </span>
                Turn off notifications on your computer and phone to prevent
                interruptions.
              </li>
              <li className="mb-4 text-xl">
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faBatteryFull} />
                </span>
                Ensure your desktop/laptop is fully charged and connected to a
                reliable power source.
              </li>
              <li className="mb-4 text-xl">
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faWifi} />
                </span>
                Test your internet connection to make sure it's stable and meets
                the minimum speed requirement of 2 MBPS.
              </li>
              <li className="mb-4 text-xl">
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                Close all unnecessary applications and tabs on your computer to
                avoid distractions and accidental window swaps.
              </li>
              <li className="mb-4 text-xl">
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faExpand} />
                </span>
                Stay in full-screen Mode to avoid accidental termination of the
                test.
              </li>
              <li className="mb-4 text-xl">
                <span className="text-blue-600 text-lg mr-4">
                  <FontAwesomeIcon icon={faHome} />
                </span>
                Find a quiet place where you won’t be disturbed during the exam.
              </li>
            </ul>

            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                // Attach download function to button
                onClick={downloadPDF}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProctoringInstruction