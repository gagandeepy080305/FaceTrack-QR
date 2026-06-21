import { useNavigate } from "react-router-dom";
import "./StudentPortal.css";

function StudentPortal() {

  const navigate = useNavigate();

  return (
    <div className="portal-container">

      <div className="portal-card">

        <h1>
          Student Portal
        </h1>

        <p>
          Smart Attendance System
        </p>

        <div className="portal-grid">

          <div
            className="portal-item"
            onClick={() =>
              navigate("/attendance")
            }
          >
            <h2>📊</h2>
            <h3>View Attendance</h3>
          </div>

          <div
            className="portal-item"
            onClick={() =>
              navigate("/face-register")
            }
          >
            <h2>📸</h2>
            <h3>Face Registration</h3>
          </div>

          <div
  className="portal-item"
  onClick={() =>
    navigate("/face-status")
  }
>
  <h2>👤</h2>
  <h3>Face Status</h3>
</div>

        </div>

      </div>

    </div>
  );
}

export default StudentPortal;