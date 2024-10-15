import { React, useState, useEffect } from "react";
import axios from "axios";
import CNavbar from "../../Components/CNavbar";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    role: "",
    createdAt: "",
    contact: "",
    bio: "",
    profileImage: "",
    mail: "", // New: alternate email field
    qualification: "", // New: qualification field
    location: "", // New: location field
  });
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [newProfileImage, setNewProfileImage] = useState(null);

  // Fetch user data on component load
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
 const capitalizeName = (name) =>
   name
     .split(" ")
     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
     .join(" ");
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewProfileImage(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");

      const formData = new FormData();
      formData.append("contact", user.contact);
      formData.append("bio", user.bio);
      formData.append("mail", user.mail); // Add alternate email to formData
      formData.append("qualification", user.qualification); // Add qualification to formData
      formData.append("location", user.location); // Add location to formData

      if (newProfileImage) {
        formData.append("profileImage", newProfileImage);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // Send updated data to the backend
      await axios.put("http://localhost:5000/user/update", formData, config);

      // Fetch updated user data after submitting the form
      const updatedResponse = await axios.get(
        "http://localhost:5000/user/me",
        config
      );
      setUser(updatedResponse.data);

      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Loading...";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CNavbar />
      <div className="flex-grow ml-60 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-xl font-bold">PROFILE</h2>
            <button
              onClick={handleEditToggle}
              className="text-sm text-blue-500 underline"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>
        <div className="flex-grow mt-6">
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Details Section */}
              <div className="md:col-span-2 bg-gray-50 p-6 rounded-md shadow-sm">
                <h2 className="font-semibold text-lg mb-4">Personal details</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Alternate Email ID: </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mail"
                        value={user.mail}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                      />
                    ) : (
                      user.mail
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Contact no: </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contact"
                        value={user.contact}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                      />
                    ) : (
                      user.contact
                    )}
                  </p>
                  <p>
                    <span className="font-medium">
                      Educational Qualification:{" "}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="qualification"
                        value={user.qualification}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                      />
                    ) : (
                      user.qualification
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Location: </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={user.location}
                        onChange={handleInputChange}
                        className="border rounded p-2"
                      />
                    ) : (
                      user.location
                    )}
                  </p>
                </div>
              </div>

              {/* Image Section */}
              <div className="flex flex-col items-center bg-gray-50 space-y-4">
                <img
                  src={
                    user.profileImage
                      ? `http://localhost:5000${user.profileImage}`
                      : "https://via.placeholder.com/100"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full shadow-md mt-8"
                />
                {isEditing && (
                  <div>
                    <input type="file" onChange={handleImageChange} />
                  </div>
                )}
                <p>
                  <span className="font-medium">Name: </span>
                  {user.name}
                </p>
                <p>
                  <span className="font-medium">Email: </span>
                  {user.email}
                </p>
              </div>

              {/* Bio Section */}
              <div className="md:col-span-2 bg-gray-50 p-6 rounded-md shadow-sm">
                <h2 className="font-semibold text-lg mb-4">Bio</h2>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                    rows="4"
                  />
                ) : (
                  <p className="text-gray-600">
                    {user.bio || "No bio available"}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 p-6 rounded-md shadow-sm">
                <h2 className="font-semibold text-lg mb-4">Role :</h2>
                <p className="text-gray-600">{capitalizeName(user.role)}</p>
              </div>
            </div>

            {isEditing && (
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
