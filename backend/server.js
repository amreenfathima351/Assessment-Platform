const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // Serve static profile images

// JWT secret key
const JWT_SECRET =
  "7d0c897bd7be91a8746e5eb48b80401c91b1b825babd707dfca47f6a92909025";

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/elite", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Models
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    mail: { type: String },
    qualification: { type: String },
    location: { type: String },
    profileImage: { type: String },
    contact: { type: String },
    bio: { type: String },
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

const activitySchema = new mongoose.Schema({
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
const Activity = mongoose.model("Activity", activitySchema);

let systemStatus = "Online"; // System status

// Middleware for JWT authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/profileImages";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Routes

// User Signup
app.post("/signup", async (req, res) => {
  const { name, email, role, password, confirmPassword } = req.body;

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, role, password: hashedPassword });

    // Save the user and activity log
    const savedUser = await newUser.save();
    const activity = new Activity({
      description: `User ${name} registered.`,
      userId: savedUser._id,
    });

    await activity.save();

    // Return success response
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Error creating user:", err.message); // Log error for debugging
    res.status(500).json({ msg: "Error creating user", error: err.message });
  }
});
// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await new Activity({
      description: `User ${user.name} logged in.`,
      userId: user._id,
    }).save();

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// User Logout
app.post("/logout", authMiddleware, async (req, res) => {
  try {
    await new Activity({
      description: `User ${req.user.name} logged out.`,
      userId: req.user.id,
    }).save();
    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error logging out", error: err.message });
  }
});

// Fetch All Users (Exclude Passwords)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users", error: err.message });
  }
});
// Delete User
app.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await new Activity({
      description: `User ${user.name} was deleted.`,
      userId: user._id,
    }).save();
    res.status(204).send(); // No content to send back
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user", error: err.message });
  }
});

// Update User Profile
app.put("/users/:id", authMiddleware, async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, ...updates } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Incorrect current password" });

    // Handle updating user
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10); // Hash new password if provided
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    await new Activity({
      description: `User ${updatedUser.name} updated their profile.`,
      userId: updatedUser._id,
    }).save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile", error: err.message });
  }
});

// Update Password
app.put("/users/update-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await new Activity({
      description: `User ${user.name} updated their password.`,
      userId: user._id,
    }).save();
    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error updating password", error: err.message });
  }
});

// Get Recent Activities
app.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(5);
    res.json(activities);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error fetching activities", error: err.message });
  }
});

// System Status
app.get("/status", (req, res) => {
  res.json({ status: systemStatus });
});

// Get Current User
app.get("/user/me", authMiddleware, async (req, res) => {
  try {
    // Fetch the user based on the ID from the token
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user); // This should include name and role
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Update System Status
app.post("/status/update", (req, res) => {
  systemStatus = req.body.status || systemStatus;
  res.json({ msg: "System status updated", status: systemStatus });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
