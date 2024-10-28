import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import CDashboard from "./Pages/Candidates/CDashboard";
import EDashboard from "./Pages/Educators/EDashboard";
import ADashboard from "./Pages/Admins/ADashboard";
import SystemCheck from "./Pages/Candidates/SystemCheck";
import AssessmentInstruction from "./Pages/Candidates/AssessmentInstruction";
import ProctoringInstruction from "./Pages/Candidates/ProctoringInstruction";
import ProfilePage from "./Pages/Candidates/ProfilePage";
import Assessment from "./Pages/Candidates/Assessment";
import AssessmentManagement from "./Pages/Educators/AssessmentManagement";
import EReports from "./Pages/Educators/EReports";
import Settings from "./Pages/Educators/Settings";
import ProctorInstruction from "./Pages/Candidates/ProctorInstruction";
import StartPage from "./Pages/Candidates/StartPage";
import UserManagement from "./Pages/Admins/UserManagement";
import AssessmentConfiguration from "./Pages/Admins/AssessmentConfiguration";
import MonitoringDashboard from "./Pages/Admins/MonitoringDashboard";
import ReportsPage from "./Pages/Admins/ReportsPage";
import AIProctoringPage from "./Pages/Admins/AIProctoringPage";
import AssessmentManagementPage from "./Pages/Admins/AssessmentManagementPage";
import SecuritySettingsPage from "./Pages/Admins/SecuritySettingsPage"
import HomePage from "./Pages/HomePage";
import AssessmentCreation from "./Pages/Educators/AssessmentCreation";
import AssessmentTaking from "./Pages/Candidates/AssessmentTaking";
import EnterTestCode from "./Pages/Candidates/EnterTestCode";
// Function to check if the user is authenticated
const isAuthenticated = () => {
  // Check authentication status (e.g., token existence)
  return !!localStorage.getItem("authToken");
};

// Protected Route Component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/candidate-dashboard"
          element={
            <PrivateRoute>
              <CDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/educator-dashboard"
          element={
            <PrivateRoute>
              <EDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <ADashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/system-check"
          element={
            <PrivateRoute>
              <SystemCheck />
            </PrivateRoute>
          }
        />
        <Route
          path="/assessment-instruction"
          element={
            <PrivateRoute>
              <AssessmentInstruction />
            </PrivateRoute>
          }
        />
        <Route
          path="/proctoring-instruction"
          element={
            <PrivateRoute>
              <ProctoringInstruction />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/start-test"
          element={
            <PrivateRoute>
              <Assessment />
            </PrivateRoute>
          }
        />
        <Route
          path="/assessment-management"
          element={
            <PrivateRoute>
              <AssessmentManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/report-management"
          element={
            <PrivateRoute>
              <EReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/start-test2"
          element={
            <PrivateRoute>
              <ProctorInstruction />
            </PrivateRoute>
          }
        />
        <Route
          path="/start"
          element={
            <PrivateRoute>
              <StartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/config"
          element={
            <PrivateRoute>
              <AssessmentConfiguration />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/monitor"
          element={
            <PrivateRoute>
              <MonitoringDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/report-page"
          element={
            <PrivateRoute>
              <ReportsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/security-setting"
          element={
            <PrivateRoute>
              <SecuritySettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-config"
          element={
            <PrivateRoute>
              <AIProctoringPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/management"
          element={
            <PrivateRoute>
              <AssessmentManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/assessment-create"
          element={
            <PrivateRoute>
              <AssessmentCreation />
            </PrivateRoute>
          }
        />
        <Route path="/assessment/:code" element={<AssessmentTaking />} />
        <Route path="/test-code" element={<EnterTestCode/>}/>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
