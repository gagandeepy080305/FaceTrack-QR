import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [usn, setUsn] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");
    if (session) {
      setSessionId(session);
    }
  }, []);

  const markAttendance = async () => {
    try {
      setLoading(true);

      if (!usn) {
        alert("Enter USN");
        return;
      }

      if (!sessionId) {
        alert("Invalid Session");
        return;
      }

      if (!image) {
        alert("Take a Selfie First");
        return;
      }

      const formData = new FormData();
      formData.append("usn", usn);
      formData.append("image", image);

      // Face Verification
      const faceResponse = await axios.post(
        "http://192.168.29.24:5000/face/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!faceResponse.data.verified) {
        alert(
          `Face Verification Failed\nDistance: ${faceResponse.data.distance}`
        );
        return;
      }

      // Mark Attendance
      const attendanceResponse = await axios.post(
        "http://192.168.29.24:5000/attendance/mark",
        {
          session_id: sessionId,
          usn: usn,
        }
      );

      alert(attendanceResponse.data.message);
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Operation Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-container">
      <div className="student-card">
        <div className="student-header">
          <div className="student-icon">
            👤
          </div>
          <div>
            <h1 className="student-title">Student Portal</h1>
            <div className="student-subtitle">Mark your attendance via AI Face Verification</div>
          </div>
        </div>

        <div className="student-input-group">
          <label className="student-label">University Seat Number (USN)</label>
          <input
            className="student-input"
            type="text"
            placeholder="e.g. 1RV21CS001"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
          />
        </div>

        <div className="student-input-group">
          <label className="student-label">Active Session ID</label>
          <input
            className="student-input"
            type="text"
            placeholder="No Active Session Found"
            value={sessionId}
            readOnly
          />
        </div>

        <div className="student-input-group">
          <label className="student-label">Verification Selfie</label>
          
          <label htmlFor="selfie-file" className="selfie-upload-container">
            <div className="selfie-icon">📸</div>
            <div className="selfie-text">
              {image ? "Change Selfie Photo" : "Upload / Capture Selfie"}
            </div>
            <div className="selfie-subtext">
              Supports device camera or image files
            </div>
            {image && (
              <span className="preview-badge">
                Selected: {image.name.length > 20 ? image.name.substring(0, 17) + "..." : image.name}
              </span>
            )}
          </label>
          
          <input
            id="selfie-file"
            className="selfie-hidden-input"
            type="file"
            accept="image/*"
            capture="user"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />
        </div>

        <button
          className="primary-action-btn"
          onClick={markAttendance}
          disabled={loading || !sessionId || !usn || !image}
        >
          {loading ? "Verifying Face..." : "Mark Attendance"}
        </button>

        <div className="student-footer-links">
          <Link to="/" className="footer-link">
            Faculty Login
          </Link>
          <Link to="/attendance" className="footer-link">
            Check Attendance History
          </Link>
          <Link to="/scan" className="footer-link">
            Scan Session QR
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;