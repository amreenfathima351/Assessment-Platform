import React, { useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const AIProctoringPage = () => {
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [screenRecordingEnabled, setScreenRecordingEnabled] = useState(false);
  const [rules, setRules] = useState({
    allowBreaks: false,
    disableCopyPaste: true,
    flagSuspiciousActivity: true,
  });

  const toggleFeature = (feature, setter) => {
    setter((prev) => !prev);
  };

  const handleRuleChange = (e) => {
    const { name, checked } = e.target;
    setRules((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveSettings = () => {
    alert("Proctoring settings have been saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        AI Proctoring Configuration
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
        {/* Proctoring Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Webcam",
              enabled: webcamEnabled,
              setter: setWebcamEnabled,
            },
            { name: "Microphone", enabled: micEnabled, setter: setMicEnabled },
            {
              name: "Screen Recording",
              enabled: screenRecordingEnabled,
              setter: setScreenRecordingEnabled,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg flex items-center justify-between"
            >
              <span className="text-xl font-semibold">{feature.name}</span>
              <button
                onClick={() => toggleFeature(feature.name, feature.setter)}
                className={`px-4 py-2 rounded-lg ${
                  feature.enabled ? "bg-green-600" : "bg-red-600"
                } text-white`}
              >
                {feature.enabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}
        </div>

        {/* Proctoring Rules */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Proctoring Rules and Guidelines
          </h2>
          <div className="space-y-4">
            {[
              { name: "allowBreaks", label: "Allow breaks during assessment" },
              { name: "disableCopyPaste", label: "Disable copy-paste" },
              {
                name: "flagSuspiciousActivity",
                label: "Flag suspicious activities",
              },
            ].map((rule, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  name={rule.name}
                  checked={rules[rule.name]}
                  onChange={handleRuleChange}
                  className="mr-2"
                />
                <label className="text-lg">{rule.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Status */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Configuration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Webcam", status: webcamEnabled },
              { name: "Microphone", status: micEnabled },
              { name: "Screen Recording", status: screenRecordingEnabled },
            ].map((config, index) => (
              <div key={index} className="flex items-center">
                {config.status ? (
                  <AiOutlineCheckCircle
                    className="text-green-600 mr-2"
                    size={24}
                  />
                ) : (
                  <AiOutlineCloseCircle
                    className="text-red-600 mr-2"
                    size={24}
                  />
                )}
                <span className="text-lg">
                  {config.name}: {config.status ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIProctoringPage;
