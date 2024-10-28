import React from "react";
import logo from "../../img/logo1.png";
import userIcon from "../../img/TestHeader2.png";
import completeIcon from "../../img/click.png";

function SubmitPage() {
  const viewResult = () => {
    console.log("View result button clicked");
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col items-center bg-white">
      <header className="bg-[#eff4fa] w-full flex items-center justify-between gap-4 p-3">
        <img
          src={logo} // Replaced with the imported image variable
          alt="Python Assessment Logo"
          className="w-24 object-contain"
        />
        <h1 className="text-xl font-normal">Python Developer Assessment</h1>
        <img
          src={userIcon} // Replaced with the imported image variable
          alt="User Profile Icon"
          className="w-24 object-contain"
        />
      </header>

      <img
        src={completeIcon} // Replaced with the imported image variable
        alt="Assessment Complete Icon"
        className="w-40 mt-10 object-contain"
      />

      <main className="mt-12 flex flex-col items-center w-full max-w-[900px]">
        <h2 className="text-2xl font-bold text-black tracking-wider">
          Your answers have been saved
        </h2>
        <button
          className="mt-4 bg-[#4574cf] text-white rounded-md px-6 py-3 shadow-md hover:shadow-lg hover:bg-blue-600 transition-all"
          onClick={viewResult}
        >
          View result
        </button>
      </main>
    </div>
  );
}

export default SubmitPage;
