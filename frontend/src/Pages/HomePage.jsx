import {React,useState  } from "react";
import Header from "../Components/Header";
import Live from "../img/LiveProctoring.png";
import time from "../img/TimedTest.png";
import multiple from "../img/MultipleQn.png";
import video from "../img/Video.png";
import report from "../img/Report.png";
import ChatBot from "../img/Chatbot.png";
import schedule from "../img/Assessment.png";
import auto from "../img/Grading.png";
import settings from "../img/Settings.png";
import encrypt from "../img/Encrypt.png";
import Download from "../img/Download.png";
import Feedback from "../img/Feedback.png";
import MonitorIcon from "../img/Monitor.png";
import AIIcon from "../img/Artificial Intelligence.png";
import InsightIcon from "../img/Customer Insight.png";
import SecurityIcon from "../img/Security Lock.png";
import HandshakeIcon from "../img/Handshake Heart.png";
import BannerImage from "../img/elite1 1.png"; // Adjust the path as necessary


const HomePage = () => {
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [submissionStatus, setSubmissionStatus] = useState(null); // State for submission status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null); // Reset submission status before sending the request

    try {
      const response = await fetch("https://formspree.io/f/mdkoobdg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus("success"); // Set success message
        setFormData({ email: "", message: "" }); // Reset form data
      } else {
        setSubmissionStatus("error"); // Set error message if response is not ok
      }
    } catch (error) {
      setSubmissionStatus("error"); // Set error message on catch
      console.error("Error submitting form:", error);
    }
  };
  return (
    <section className="shadow-[0_4px_6px_4px_rgba(0,0,0,0.15),0_2px_2px_0px_rgba(0,0,0,0.3)] bg-gradient-to-r from-[#93ccf4] via-[rgba(201,229,249,0.65)] to-[rgba(255,255,255,0.3)] flex flex-col">
      <Header />
      {/* Main Content with adjusted padding for spacing */}
      <main
        className="border border-[rgba(147,204,244,0.4)] pt-[120px] md:pt-[150px] h-full"
        id="home"
      >
        <div
          className="flex flex-col md:flex-row gap-16 w-full h-full items-start"
          id="home"
        >
          <section className="w-full md:w-1/2 flex flex-col justify-start">
            <div className="text-center md:text-center">
              <h1 className="font-bold text-5xl font-sansita mb-10">
                Welcome to Elite!
              </h1>
              <p className="font-semibold text-lg font-open-sans mb-4">
                {" "}
                {/* Adjusted margin */}
                "Welcome to Elite Platform—secure assessments powered by AI
                <br />
                Experience seamless and reliable testing with real-time
                proctoring.
                <br />
                Elevate your evaluation process with cutting-edge technology
                <br />
                and unmatched accuracy. Transform your assessments with our
                innovative
                <br />
                solutions and gain deeper insights into performance."
              </p>
            </div>
            {/* Features Section */}
            <section className="bg-gradient-to-r from-[#93ccf4] via-[rgba(201,229,249,0.65)] to-[rgba(255,255,255,0.3)] shadow-lg rounded-lg p-8 mt-10">
              <h2 className="text-center font-bold text-xl font-open-sans">
                Why Choose Elite
              </h2>
              <div className="grid grid-cols-4 gap-6 mt-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img
                      src={feature.icon}
                      alt={feature.alt}
                      className="w-18 aspect-square"
                    />
                    <p className="mt-2 text-center text-sm font-open-sans">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </section>
          {/* Banner Image on the Right */}
          <aside className="w-full md:w-1/2 flex justify-center items-start">
            {" "}
            {/* Changed items-center to items-start */}
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cece25cdf6184e9a9290da7047e681940a370db3e563978665af7efcb3e1f432?placeholderIfAbsent=true&apiKey=0114e6a929e54dfeb19b347b17a8ef79"
              alt="Elite Platform Banner"
              className="w-full max-w-[70%] mx-4" // Added margin on both sides
            />
          </aside>
        </div>
      </main>
      <section
        className="flex flex-col p-8 gap-8 pt-[100px] md:pt-[100px]"
        id="about"
      >
        <div className="flex flex-col md:flex-row gap-8" id="about">
          {/* Banner Image Column */}
          <div className="flex flex-col w-full md:w-3/5">
            <img
              src={BannerImage}
              alt="Banner illustration"
              className="w-full max-w-[59.5%] object-contain object-top"
            />
          </div>

          {/* Banner Text Column */}
          <div className="flex flex-col w-full md:w-2/5 ml-[-60px]">
            {" "}
            {/* Move slightly left */}
            <ul className="flex flex-col mt-11 text-black text-lg font-semibold">
              {" "}
              {/* Increase font size */}
              <li className="flex items-start p-8 mb-10 rounded-lg bg-[#d4e8f1]">
                {" "}
                {/* Increase box size */}
                <img
                  src={MonitorIcon}
                  alt="Monitor"
                  className="w-16 h-16 mr-4"
                />
                <p className="flex-grow">
                  Elite is a cutting-edge AI Proctored Online Assessment
                  platform designed to streamline the recruitment process.
                </p>
              </li>
              <li className="flex items-start p-8 mb-8 rounded-lg bg-[#d4e8f1]">
                <img src={AIIcon} alt="AI" className="w-16 h-16 mr-4" />
                <p className="flex-grow">
                  Our Platform combines advanced AI technology with robust
                  proctoring features to ensure secure and efficient
                  evaluations.
                </p>
              </li>
              <li className="flex items-start p-8 mb-8 rounded-lg bg-[#d4e8f1]">
                <img
                  src={InsightIcon}
                  alt="Customer Insight"
                  className="w-16 h-16 mr-4"
                />
                <p className="flex-grow">
                  We provide a seamless experience for both candidates and
                  recruiters, enhancing accuracy and reducing time-to-hire.
                </p>
              </li>
              <li className="flex items-start p-8 mb-8 rounded-lg bg-[#d4e8f1]">
                <img
                  src={SecurityIcon}
                  alt="Security"
                  className="w-16 h-16 mr-4"
                />
                <p className="flex-grow">
                  Hexaware can confidently assess talent while maintaining the
                  highest standards of integrity and fairness.
                </p>
              </li>
              <li className="flex items-start p-8 rounded-lg bg-[#d4e8f1]">
                <img
                  src={HandshakeIcon}
                  alt="Handshake"
                  className="w-16 h-16 mr-4"
                />
                <p className="flex-grow">
                  Join us in revolutionizing recruitment with intelligent,
                  effective and reliable solutions.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section
        className="h-screen bg-gradient-to-r from-[#93ccf4] via-[rgba(201,229,249,0.65)] to-[rgba(255,255,255,0.3)] pt-[120px] md:pt-[150px]"
        id="contact"
      >
        <div className="flex gap-5 h-full items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5aadc5e42b64ad3cf1352287936f512b80ea1550175e693d7e28671aaad99c12?placeholderIfAbsent=true&apiKey=0114e6a929e54dfeb19b347b17a8ef79"
            alt="Contact illustration"
            className="w-[43%] object-contain -mt-10"
          />

          <div className="flex flex-col ml-60">
            <div className="px-8 text text-center">
              <h1 className="text-4xl font-extrabold font-['Open_Sans'] text-black">
                Contact Us
              </h1>
              <p className="mt-8 text-lg leading-7 text-gray-800 font-['Poly']">
                Need to get in touch with us? Contact us with your mail{" "}
              </p>
            </div>

            <form
              className="bg-[#eff4fa] shadow-lg border border-blue-100 rounded-2xl mt-6 px-12 py-8 w-[600px] flex flex-col"
              onSubmit={handleSubmit} 
            >
              <label htmlFor="email" className="mt-5 text-left text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="rounded-xl shadow-md mt-4 px-4 py-3"
                value={formData.email}
                onChange={handleChange}
              />

              <label htmlFor="message" className="mt-8 text-left text-lg">
                What can we help you with?
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="rounded-xl shadow-md mt-4 px-4 py-3 h-36 resize-none"
                value={formData.message}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="bg-[#2d4990] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-md mt-8 self-center"
              >
                Submit
              </button>

              {/* Display Submission Status */}
              {submissionStatus === "success" && (
                <p className="text-green-600 mt-4 text-center">
                  Your message has been sent successfully!
                </p>
              )}
              {submissionStatus === "error" && (
                <p className="text-red-600 mt-4 text-center">
                  There was an error sending your message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </section>
  );
};

// Features Data
const features = [
  {
    icon: Live,
    alt: "Live Proctoring Icon",
    text: "Live proctoring",
  },
  {
    icon: multiple,
    alt: "Multiple Question Types Icon",
    text: "Multiple question types",
  },
  {
    icon: video,
    alt: "Video and Images Icon",
    text: "Including video / images",
  },
  {
    icon: time,
    alt: "Timed Tests Icon",
    text: "Timed tests",
  },
  {
    icon: report,
    alt: "Powerful Report Icon",
    text: "Powerful Report",
  },
  {
    icon: ChatBot,
    alt: "Intelligence-chatbot",
    text: "Intelligent Chatbot",
  },
  {
    icon: schedule,
    alt: "Scheduled Assessment Icon",
    text: "Scheduled Assessment",
  },
  {
    icon: auto,
    alt: "Auto-Grading Icon",
    text: "Auto-Grading",
  },
  {
    icon: settings,
    alt: "Advanced Configuration Icon",
    text: "Advanced Configuration",
  },
  {
    icon: encrypt,
    alt: "SSL Encryption Icon",
    text: "Secured with SSL encryption",
  },
  {
    icon: Download,
    alt: "Download Reports Icon",
    text: "Download Reports",
  },
  {
    icon: Feedback,
    alt: "Share Feedback Icon",
    text: "Share feedback",
  },
];

export default HomePage;
