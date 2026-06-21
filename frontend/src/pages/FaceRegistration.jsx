import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./FaceUtility.css";

function FaceRegistration() {
  const [usn, setUsn] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerFace = async () => {
    try {
      if (!usn) {
        alert("Enter USN");
        return;
      }
      if (!image) {
        alert("Select an image first");
        return;
      }
      
      setLoading(true);
      const formData = new FormData();
      formData.append("usn", usn);
      formData.append("image", image);

      const response = await axios.post(
        "http://192.168.29.24:5000/face/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Face Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="face-container">
      <div className="face-card">
        <div className="face-header">
          <div className="face-icon">👤</div>
          <div>
            <h1 className="face-title">Face Registration</h1>
            <p className="face-subtitle">Register student face profile for QR check-ins</p>
          </div>
        </div>

        <div className="face-input-group">
          <label className="face-label">Student USN</label>
          <input
            className="face-input"
            type="text"
            placeholder="e.g. 1RV21CS001"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
          />
        </div>

        <div className="face-input-group">
          <label className="face-label">Profile Image</label>
          <label htmlFor="face-image" className="face-file-box">
            <div className="file-icon">📸</div>
            <div className="file-text">
              {image ? "Change Photo File" : "Choose Profile Photo"}
            </div>
            <div className="file-subtext">JPEG or PNG portrait image</div>
            {image && (
              <span className="file-badge">
                Selected: {image.name.length > 20 ? image.name.substring(0, 17) + "..." : image.name}
              </span>
            )}
          </label>
          <input
            id="face-image"
            className="face-hidden-input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />
        </div>

        <button 
          className="face-action-btn" 
          onClick={registerFace}
          disabled={loading || !usn || !image}
        >
          {loading ? "Registering..." : "Register Face"}
        </button>

        <div className="face-footer-links">
          <Link to="/student" className="face-footer-link">
            ← Student Dashboard
          </Link>
          <Link to="/face-verify" className="face-footer-link">
            Test Verification
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FaceRegistration;