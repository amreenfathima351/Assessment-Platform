import React,{useState,useEffect} from 'react'
import axios from 'axios';
import CNavbar from '../../Components/CNavbar';
import { jsPDF } from "jspdf"; // Import jsPDF

const AssessmentInstruction = () => {
    
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
      doc.text("Assessment Instruction", margin, 30);

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
        "1. AI Proctoring is enabled during this test.",
        "2. Negative marking may apply, depending on the specific assessment.",
        "3. In case of technical difficulties, please document the issue and notify the exam administrators right away.",
        "4. Ensure that all your answers are correctly submitted before the test concludes.",
        "5. Any form of malpractice will result in immediate disqualification from the test.",
        "6. The format and type of questions will vary depending on the specific assessment.",
        "7. Providing feedback is mandatory to help improve the quality of the assessment and AI proctoring, ensuring fairness and security.",
        "8. You are not allowed to communicate with anyone during the test. All interactions should be limited to the exam platform.",
        "9. The test platform will automatically log you out if it detects prolonged inactivity, so remain engaged with the test interface.",
        "10. The use of calculators, software tools, or any external resources is prohibited unless explicitly allowed in the test instructions.",
        "11. By starting the test, you agree to comply with all the rules and regulations outlined in these instructions. Failure to adhere to these guidelines may result in disciplinary action.",
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
      doc.save("assessment_instruction.pdf");
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
            Assessment Instruction
          </h1>

          <div className="bg-white ml-5 p-6 rounded-lg shadow-md ">
            <h2 className="text-2xl font-bold mb-4">
              Instruction to be followed while you are taking test in Elite:
            </h2>
            <ul className="list-disc list-inside space-y-2 text-xl">
              <li>AI Proctoring is enabled during this test. 🤖</li>
              <li>
                Negative marking may apply, depending on the specific
                assessment.
              </li>
              <li>
                In case of technical difficulties, please document the issue and
                notify the exam administrators right away.
              </li>
              <li>
                Ensure that all your answers are correctly submitted before the
                test concludes.
              </li>
              <li>
                Any form of malpractice will result in immediate
                disqualification from the test.
              </li>
              <li>
                The format and type of questions will vary depending on the
                specific assessment. 📝
              </li>
              <li>
                Providing feedback is mandatory to help improve the quality of
                the assessment and AI proctoring, ensuring fairness and
                security.
              </li>
              <li>
                You are not allowed to communicate with anyone during the test.
                All interactions should be limited to the exam platform.
              </li>
              <li>
                The test platform will automatically log you out if it detects
                prolonged inactivity, so remain engaged with the test interface.
              </li>
              <li>
                The use of calculators, software tools, or any external
                resources is prohibited unless explicitly allowed in the test
                instructions.
              </li>
              <li>
                By starting the test, you agree to comply with all the rules and
                regulations outlined in these instructions. Failure to adhere to
                these guidelines may result in disciplinary action.
              </li>
            </ul>

            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                onClick={downloadPDF} // Attach download function to button
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

export default AssessmentInstruction
