import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
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
import Settings from "./Pages/Educators/Settings"
import ProctorInstruction from "./Pages/Candidates/ProctorInstruction";
import StartPage from "./Pages/Candidates/StartPage";
import UserManagement from "./Pages/Admins/UserManagement";
const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/candidate-dashboard" element={<CDashboard />} />
        <Route path="/educator-dashboard" element={<EDashboard />} />
        <Route path="/admin-dashboard" element={<ADashboard />} />
        <Route path="/system-check" element={<SystemCheck />} />
        <Route
          path="/assessment-instruction"
          element={<AssessmentInstruction />}
        />
        <Route
          path="/proctoring-instruction"
          element={<ProctoringInstruction />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/create-test"
          element={() => {
            window.location.href = "https://code-nitrix-frontend.vercel.app/";
            return null;
          }}
        />
        <Route path="/start-test" element={<Assessment />} />
        <Route path="/assessment-management" element={<AssessmentManagement />} />
        <Route path="/report-management" element={<EReports />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/start-test2" element={<ProctorInstruction />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/manage-users" element={<UserManagement/>}/>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;
