import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import "./FacultyDashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function FacultyDashboard() {
  const [facultyId, setFacultyId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [attendanceSummary, setAttendanceSummary] =
    useState(null);
  const [sessionHistory, setSessionHistory] =
    useState([]);
    const [analytics, setAnalytics] =
  useState(null);

const [trendData, setTrendData] =
  useState([]);

const [selectedAssignment, setSelectedAssignment] =
  useState(null);
  const [defaulters, setDefaulters] =
    useState([]);

  const navigate = useNavigate();

  const API_URL = "http://192.168.29.24:5000";
  const FRONTEND_URL = "http://192.168.29.24:5173";

  useEffect(() => {
    const storedFacultyId = localStorage.getItem("faculty_id");
    if (!storedFacultyId) {
      navigate("/");
      return;
    }
    setFacultyId(storedFacultyId);

    // Auto-fetch assignments and history on login
    const fetchInitialData = async () => {
      try {
        const assignmentsRes = await axios.get(
          `${API_URL}/assignment/faculty/${storedFacultyId}`
        );
        setAssignments(assignmentsRes.data);

        const historyRes = await axios.get(
          `${API_URL}/session/history/${storedFacultyId}`
        );
        setSessionHistory(historyRes.data);
      } catch (error) {
        console.error("Failed to load initial faculty data:", error);
      }
    };
    fetchInitialData();
  }, [navigate]);

  const getAssignments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/assignment/faculty/${facultyId}`
      );
      setAssignments(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to get assignments");
    }
  };

  const createSession = async (assignment) => {
    try {
      const response = await axios.post(`${API_URL}/session/create`, {
        faculty_id: facultyId,
        department_code: assignment.department_code,
        class_name: assignment.class_name,
        subject_code: assignment.subject_code,
      });

      setSessionId(response.data.session_id);
      setAttendanceSummary(null);
      setSelectedAssignment(assignment);
      setDefaulters([]);

      // Auto-load analytics, trend, and refresh history
      const analyticsRes = await axios.get(
        `${API_URL}/attendance/analytics/${assignment.subject_code}/${assignment.class_name}`
      );
      setAnalytics(analyticsRes.data);

      const trendRes = await axios.get(
        `${API_URL}/attendance/trend/${assignment.subject_code}/${assignment.class_name}`
      );
      setTrendData(trendRes.data);

      const historyRes = await axios.get(
        `${API_URL}/session/history/${facultyId}`
      );
      setSessionHistory(historyRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to create session");
    }
  };

  const handleViewDefaultersAndAnalytics = async (assignment) => {
    setSelectedAssignment(assignment);
    try {
      const analyticsRes = await axios.get(
        `${API_URL}/attendance/analytics/${assignment.subject_code}/${assignment.class_name}`
      );
      setAnalytics(analyticsRes.data);

      const trendRes = await axios.get(
        `${API_URL}/attendance/trend/${assignment.subject_code}/${assignment.class_name}`
      );
      setTrendData(trendRes.data);

      const defaultersRes = await axios.get(
        `${API_URL}/attendance/defaulters/${assignment.subject_code}/${assignment.class_name}`
      );
      setDefaulters(defaultersRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load details for this assignment");
    }
  };

  const viewAttendance = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/attendance/final/${sessionId}`
      );
      setAttendanceSummary(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance");
    }
  };

  const downloadCSV = () => {
    window.open(`${API_URL}/attendance/export/${sessionId}`, "_blank");
  };

  const getSessionHistory = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/session/history/${facultyId}`
      );
      setSessionHistory(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch session history");
    }
  };

  const getDefaulters = async (subjectCode, className) => {
    try {
      const response = await axios.get(
        `${API_URL}/attendance/defaulters/${subjectCode}/${className}`
      );
      setDefaulters(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch defaulters");
    }
  };

  const getAnalytics = async () => {
    try {
      if (!selectedAssignment) {
        alert("Generate Session First");
        return;
      }
      const response = await axios.get(
        `${API_URL}/attendance/analytics/${selectedAssignment.subject_code}/${selectedAssignment.class_name}`
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch analytics");
    }
  };

  const getTrend = async () => {
    try {
      if (!selectedAssignment) {
        alert("Generate Session First");
        return;
      }
      const response = await axios.get(
        `${API_URL}/attendance/trend/${selectedAssignment.subject_code}/${selectedAssignment.class_name}`
      );
      setTrendData(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch trend");
    }
  };

  const logout = () => {
    localStorage.removeItem("faculty_id");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-icon">
            🎓
          </div>
          <div>
            <h1 className="dashboard-title">Smart Attendance Dashboard</h1>
            <div className="dashboard-subtitle">Logged in as {facultyId}</div>
          </div>
        </div>
        <div className="header-right">
          <div className="date-chip">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <button className="secondary-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="card accent-indigo">
          <h3>Total Assignments</h3>
          <p>{assignments.length}</p>
        </div>
        <div className="card accent-amber">
          <h3>Active Session</h3>
          <p style={{ fontSize: "14px", marginTop: "16px", wordBreak: "break-all" }}>
            {sessionId ? `ID: ${sessionId}` : "No Active Session"}
          </p>
        </div>
        <div className="card accent-green">
          <h3>Class Average</h3>
          <p>{analytics ? `${analytics.average_attendance}%` : "—"}</p>
        </div>
        <div className="card accent-rose">
          <h3>Defaulters {"(<85%)"}</h3>
          <p>{analytics ? analytics.below_85 : "—"}</p>
        </div>
      </div>

      {sessionId && (
        <div className="section">
          <div className="section-head">
            <h2 className="section-title">Active Session Panel</h2>
          </div>
          <div className="session-panel">
            <div className="qr-card">
              <h3>Attendance Scan QR</h3>
              <p className="qr-desc">Students scan to verify identity and check-in</p>
              <div className="qr-wrapper">
                <QRCodeCanvas
                  value={`${FRONTEND_URL}/student?session=${sessionId}`}
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="session-info-pills">
                <span className="info-pill">Session ID: {sessionId}</span>
                {selectedAssignment && (
                  <span className="info-pill">
                    {selectedAssignment.subject_code} | Class {selectedAssignment.class_name}
                  </span>
                )}
              </div>
              <div className="session-actions">
                <button className="action-btn" onClick={viewAttendance}>
                  View Attendance
                </button>
                <button className="ghost-btn" onClick={downloadCSV}>
                  Download CSV
                </button>
              </div>
            </div>

                {attendanceSummary && (
  <div className="dashboard-cards">

    <div className="card">
      <h3>Total Students</h3>
      <p>
        {attendanceSummary.total_students}
      </p>
    </div>

    <div className="card">
      <h3>Present</h3>
      <p>
        {attendanceSummary.present}
      </p>
    </div>

    <div className="card">
      <h3>Absent</h3>
      <p>
        {attendanceSummary.absent}
      </p>
    </div>

    <div className="card">
      <h3>Attendance %</h3>
      <p>
        {attendanceSummary.attendance_percentage}%
      </p>
    </div>

  </div>
)}

            {attendanceSummary && (
              <div className="attendance-summary-card">
                <h3>Attendance Summary</h3>
                <div className="summary-stats">
                  <div className="stat-pill success">
                    <span>Present</span>
                    <strong>{attendanceSummary.present}</strong>
                  </div>
                  <div className="stat-pill error">
                    <span>Absent</span>
                    <strong>{attendanceSummary.absent}</strong>
                  </div>
                  <div className="stat-pill info">
                    <span>Percentage</span>
                    <strong>{attendanceSummary.attendance_percentage}%</strong>
                  </div>
                </div>

                <div className="table-wrap" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>USN</th>
                        <th>Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceSummary.students.map((student, index) => (
                        <tr key={index}>
                          <td>{student.usn}</td>
                          <td>{student.name}</td>
                          <td>
                            <span className={student.status === "Present" ? "status-present" : "status-absent"}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "32px" }}>
        
        <div>
          <div className="section-head">
            <h2 className="section-title">Your Assignments</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "18px" }}>
            {assignments.map((item, index) => (
              <div className="assignment-card" key={index}>
                <div style={{ display: "flex", justifyContent: "between", alignItems: "start", width: "100%" }}>
                  <div style={{ flexGrow: 1 }}>
                    <h3>{item.subject_code}</h3>
                    <p style={{ margin: "4px 0" }}>Class: <strong>{item.class_name}</strong></p>
                    <p style={{ margin: "4px 0" }}>Department: <strong>{item.department_code}</strong></p>
                  </div>
                </div>
                <div className="assignment-buttons">
                  <button className="action-btn" onClick={() => createSession(item)}>
                    Generate Session
                  </button>
                  <button className="ghost-btn" onClick={() => handleViewDefaultersAndAnalytics(item)}>
                    View Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-head">
            <h2 className="section-title">
              Attendance Trend {selectedAssignment && `— ${selectedAssignment.subject_code}`}
            </h2>
          </div>
          {trendData.length > 0 ? (
            <div className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: "#8b96b3", fontSize: 11, fontWeight: 500 }} 
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: "#8b96b3", fontSize: 11, fontWeight: 500 }} 
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#111a2e", 
                      borderColor: "rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#f1f4f9",
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance_percentage"
                    stroke="#4f6df5"
                    strokeWidth={3}
                    activeDot={{ r: 6, fill: "#7c3aed" }}
                    dot={{ strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-card" style={{ height: "348px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
              Select an assignment to view attendance trends
            </div>
          )}
        </div>

      </div>

      {defaulters.length > 0 && (
        <div className="section">
          <div className="section-head">
            <h2 className="section-title">Defaulters List — {selectedAssignment?.subject_code}</h2>
          </div>
          <div className="table-wrap" style={{ marginTop: "18px" }}>
            <table>
              <thead>
                <tr>
                  <th>USN</th>
                  <th>Name</th>
                  <th>Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map((student, index) => (
                  <tr key={index}>
                    <td>{student.usn}</td>
                    <td>{student.name}</td>
                    <td>
                      <span className="status-absent">
                        {student.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sessionHistory.length > 0 && (
        <div className="section" style={{ marginBottom: "40px" }}>
          <div className="section-head">
            <h2 className="section-title">Session History</h2>
          </div>
          <div className="table-wrap" style={{ marginTop: "18px" }}>
            <table>
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Department</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {sessionHistory.map((session, index) => (
                  <tr key={index}>
                    <td style={{ fontFamily: "monospace", fontSize: "13px", color: "#ffffff" }}>{session.session_id}</td>
                    <td>{session.department_code}</td>
                    <td>{session.class_name}</td>
                    <td>{session.subject_code}</td>
                    <td>
                      <span className={session.status === "active" ? "status-active" : "status-expired"}>
                        {session.status}
                      </span>
                    </td>
                    <td>{session.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {analytics && (

  <div className="dashboard-cards">

    <div className="card">
      <h3>Total Students</h3>
      <p>
        {analytics.total_students}
      </p>
    </div>

    <div className="card">
      <h3>Average Attendance</h3>
      <p>
        {analytics.average_attendance}%
      </p>
    </div>

    <div className="card">
      <h3>Above 85%</h3>
      <p>
        {analytics.above_85}
      </p>
    </div>

    <div className="card">
      <h3>Below 85%</h3>
      <p>
        {analytics.below_85}
      </p>
    </div>

  </div>

)}
    </div>
  );
}

export default FacultyDashboard;