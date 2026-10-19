import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import FacultyDashboard from "./pages/FacultyDashboard";
import MarkAttendance from "./pages/MarkAttendance";
import QRScanner from "./pages/QRScanner";
import FaceRegistration from "./pages/FaceRegistration";
import FaceVerification from "./pages/FaceVerification";
import StudentAttendance from "./pages/StudentAttendance";
import StudentPortal from "./pages/StudentPortal";
import FaceStatus
  from "./pages/FaceStatus";

function LegacyStudentRedirect() {
  const { search } = useLocation();
  return <Navigate to={search ? `/mark${search}` : "/student-portal"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/faculty"
          element={<FacultyDashboard />}
        />

        <Route
          path="/mark"
          element={<MarkAttendance />}
        />

        {/* Legacy QR links (/student?session=…) keep working */}
        <Route path="/student" element={<LegacyStudentRedirect />} />

        <Route
          path="/scan"
          element={<QRScanner />}
        />

        <Route
          path="/face-register"
          element={<FaceRegistration />}
        />

        <Route
          path="/face-verify"
          element={<FaceVerification />}
        />

        <Route
          path="/attendance"
          element={<StudentAttendance />}
        />

        <Route
          path="/student-portal"
          element={<StudentPortal />}
        />

        <Route
          path="/face-status"
          element={<FaceStatus />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;