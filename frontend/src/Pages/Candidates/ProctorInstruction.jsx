import React, { useEffect, useState, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import logo from "../../img/logo1.png";
import header from "../../img/TestHeader2.png";

const ProctorInstruction = () => {
  const [videoStream, setVideoStream] = useState(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureCardVisible, setCaptureCardVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startVideoStream = async () => {
      if (isVideoVisible) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          setVideoStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
            };
          }
        } catch (error) {
          console.error("Error accessing webcam: ", error);
          setErrorMessage("Video access is required to proceed.");
        }
      } else if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }
    };

    startVideoStream();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoVisible]);

  const handleVideoToggle = () => {
    setIsVideoVisible((prev) => !prev);
    if (capturedImage) setCapturedImage(null);
  };

  const handleAudioToggle = async () => {
    if (isAudioEnabled) {
      setIsAudioEnabled(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsAudioEnabled(true);
      } catch (error) {
        console.error("Error accessing microphone: ", error);
        setErrorMessage("Audio access is required to proceed.");
      }
    }
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const videoElement = videoRef.current;
    if (videoElement) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoElement, 0, 0);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
      setCaptureCardVisible(true);
    }
  };
const uploadImage = async () => {
  if (!capturedImage) return;

  try {
    // Convert Base64 to Blob
    const blob = await (await fetch(capturedImage)).blob();

    // Create formData object
    const formData = new FormData();
    formData.append("image", blob, "capturedImage.png");

    // Send the POST request
    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image"); // Throw error if response is not OK
    }

    const data = await response.json(); // Parse the response as JSON

    // If the upload was successful
    if (data && data.filePath) {
      setIsImageUploaded(true);
      console.log("Image uploaded successfully:", data.filePath);
    }
  } catch (error) {
    }
};



  const start = async () => {
    setErrorMessage(""); // Clear previous errors

    if (!isVideoVisible || !isAudioEnabled) {
      setErrorMessage("Please enable both video and audio to proceed.");
      return;
    }

    if (!capturedImage) {
      setErrorMessage("Please capture an image to proceed.");
      return;
    }

    if (!isImageUploaded) {
      await uploadImage(); // Upload the image before proceeding
      if (!isImageUploaded) {
        return;
      }
    }

    navigate("/start");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white">
      <div className="flex justify-between items-center w-full bg-[#e9f0f9] p-2 rounded-md mb-5">
        <div className="logo-left">
          <img src={logo} alt="Elite Logo" className="w-24 h-24" />
        </div>
        <h1 className="text-2xl m-2">
          Proctoring Instructions also need to be followed
        </h1>
        <div className="logo-right">
          <img src={header} alt="Online Test Logo" className="w-24 h-24" />
        </div>
      </div>
      <ul className="list-none ml-40 mb-8">
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
          Test your internet connection to make sure it's stable and meets the
          minimum speed requirement of 2 MBPS.
        </li>
        <li className="mb-4 text-xl">
          <span className="text-blue-600 text-lg mr-4">
            <FontAwesomeIcon icon={faTimes} />
          </span>
          Close all unnecessary applications and tabs on your computer to avoid
          distractions and accidental window swaps.
        </li>
        <li className="mb-4 text-xl">
          <span className="text-blue-600 text-lg mr-4">
            <FontAwesomeIcon icon={faExpand} />
          </span>
          Stay in full-screen Mode to avoid accidental termination of the test.
        </li>
        <li className="mb-4 text-xl">
          <span className="text-blue-600 text-lg mr-4">
            <FontAwesomeIcon icon={faHome} />
          </span>
          Find a quiet place where you won’t be disturbed during the exam.
        </li>
      </ul>

      <div className="flex flex-col items-center mb-4">
        {isVideoVisible && (
          <video
            id="video"
            autoPlay
            muted
            className="border border-gray-300 w-80 h-60 mb-4"
            ref={videoRef}
          />
        )}
        <div className="flex mb-4">
          <FontAwesomeIcon
            icon={isVideoVisible ? faVideo : faVideoSlash}
            className="cursor-pointer text-3xl mr-4"
            onClick={handleVideoToggle}
          />
          <FontAwesomeIcon
            icon={isAudioEnabled ? faMicrophone : faMicrophoneSlash}
            className="cursor-pointer text-3xl"
            onClick={handleAudioToggle}
          />
        </div>
        {isVideoVisible && (
          <button
            onClick={handleCapture}
            className="bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Capture
          </button>
        )}
      </div>

      {captureCardVisible && (
        <div className="border border-gray-300 p-4 rounded-lg mb-4">
          <h3 className="text-xl mb-2">Captured Image</h3>
          <img src={capturedImage} alt="Captured" className="w-80 h-60" />
          <button
            onClick={() => {
              setCaptureCardVisible(false);
              setCapturedImage(null);
              setIsImageUploaded(false); // Reset capture and upload state
            }}
            className="bg-red-600 text-white rounded-md px-4 py-2 mt-2"
          >
            Retry
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="text-red-600 mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-end w-full">
        <button
          className="bg-blue-600 text-white rounded-md px-4 py-2 mr-10"
          onClick={start}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default ProctorInstruction;
