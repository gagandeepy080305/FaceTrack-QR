import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const [facultyId, setFacultyId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const API_URL = "http://192.168.29.24:5000";

  const facultyLogin = async () => {
    try {
      if (!facultyId || !password) {
        alert("Enter Faculty ID and Password");
        return;
      }

      const response = await axios.post(
        `${API_URL}/faculty/login`,
        {
          faculty_id: facultyId,
          password: password,
        }
      );

      localStorage.setItem(
        "faculty_id",
        response.data.faculty_id
      );

      navigate("/faculty");

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Login Failed");
      }
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="brand-mark">
          🎓
        </div>

        <h1 className="title">
          Smart Attendance System
        </h1>

        <p className="subtitle">
          AI Powered QR Attendance & Face Recognition
        </p>

        <h2 className="section-title">
          Faculty Login
        </h2>

        <div className="field-group">
          <label className="field-label">
            Faculty ID
          </label>

          <input
            className="login-input"
            type="text"
            placeholder="Enter Faculty ID"
            value={facultyId}
            onChange={(e) =>
              setFacultyId(e.target.value)
            }
          />
        </div>

        <div className="field-group">
          <label className="field-label">
            Password
          </label>

          <input
            className="login-input"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <div className="row-aux">
          <span className="link-muted">
            Faculty Portal
          </span>
        </div>

        <button
          className="login-btn"
          onClick={facultyLogin}
        >
          Login to Dashboard
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <Link
          to="/student-portal"
          style={{
            textDecoration: "none"
          }}
        >
          <button className="student-btn">
            Student Portal
          </button>
        </Link>

        <p className="footnote">
          Built using <strong>React</strong>,
          <strong> Flask</strong>,
          <strong> MongoDB Atlas</strong> &
          <strong> DeepFace</strong>
        </p>

      </div>

    </div>
  );
}

export default Login;