import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./StudentAttendance.css";

function StudentAttendance() {
  const [usn, setUsn] = useState("");
  const [attendance, setAttendance] = useState(null);

  const API_URL = "http://192.168.29.24:5000";

  const getAttendance = async () => {
    try {
      if (!usn) {
        alert("Please enter a USN");
        return;
      }
      const response = await axios.get(
        `${API_URL}/attendance/student/${usn}`
      );
      setAttendance(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance");
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        <div className="attendance-header">
          <div className="attendance-icon">
            📊
          </div>
          <div>
            <h1 className="attendance-title">Attendance Lookup</h1>
            <div className="attendance-subtitle">Lookup subjects and check-in percentages</div>
          </div>
        </div>

        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="Enter USN (e.g. 1RV21CS001)"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getAttendance();
              }
            }}
          />
          <button className="search-btn" onClick={getAttendance}>
            View Report
          </button>
        </div>

        {attendance && (
          <div>
            <div className="details-panel">
              <div className="details-item">
                <span className="details-label">Student Name</span>
                <span className="details-value">{attendance.name}</span>
              </div>
              <div className="details-item">
                <span className="details-label">USN / ID</span>
                <span className="details-value">{attendance.usn}</span>
              </div>
            </div>

            <h2 className="report-section-title">Attendance Report</h2>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th style={{ textAlign: "center" }}>Attended</th>
                    <th style={{ textAlign: "center" }}>Total Classes</th>
                    <th style={{ textAlign: "right" }}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.attendance.map((subject, index) => {
                    const pct = parseFloat(subject.percentage);
                    const isGood = pct >= 85;
                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: 600, color: "#ffffff" }}>
                          {subject.subject_code}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {subject.attended}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {subject.total}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span className={isGood ? "status-present" : "status-absent"}>
                            {subject.percentage}%
                          </span>
                          <div className="progress-bar-container">
                            <div 
                              className={`progress-bar-fill ${isGood ? "good" : "poor"}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="attendance-footer">
          <Link to="/student" className="back-link">
            ← Student Dashboard
          </Link>
          <Link to="/" className="back-link">
            Faculty Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentAttendance;