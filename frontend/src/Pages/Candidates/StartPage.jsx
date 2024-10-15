import React from "react";
import logo from "../../img/logo1.png";
import header from "../../img/TestHeader2.png";
import StartImg from "../../img/start.png";
const StartPage = () => {
  const TakeTest = () => {
    window.location.href = "https://code-nitrix-frontend.vercel.app";
  };
  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="bg-white">
        <div className="flex justify-between items-center w-full bg-[#e9f0f9] p-2 rounded-md mb-5">
          <div className="logo-left">
            <img src={logo} alt="Elite Logo" className="w-24 h-24" />
          </div>
          <h1 className="text-2xl m-2">JavaScript Developer Assessment</h1>
          <div className="logo-right">
            <img src={header} alt="Online Test Logo" className="w-24 h-24" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-5">
          <img src={StartImg} alt="Test Start Image" className="w-[600px]" />
          <h1 className="text-2xl">Get Started with your test</h1>
          <div className="text-center mt-0">
            <button className="py-2 px-5 bg-[#4574CF] text-white font-bold rounded hover:bg-[#0056b3] w-24" onClick={TakeTest}>
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
