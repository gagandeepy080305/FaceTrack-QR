import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./FaceUtility.css";

function FaceVerification() {
  const [usn, setUsn] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyFace = async () => {
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
        "http://192.168.29.24:5000/face/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.verified) {
        alert(
          `Face Verified\nDistance: ${response.data.distance}`
        );
      } else {
        alert(
          `Face Not Matched\nDistance: ${response.data.distance}`
        );
      }
    } catch (error) {
      console.error(error);
      alert("Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="face-container">
      <div className="face-card">
        <div className="face-header">
          <div className="face-icon">🔍</div>
          <div>
            <h1 className="face-title">Face Verification</h1>
            <p className="face-subtitle">Test check-in face match algorithms</p>
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
          <label className="face-label">Selfie Image</label>
          <label htmlFor="verify-image" className="face-file-box">
            <div className="file-icon">📸</div>
            <div className="file-text">
              {image ? "Change Verification Photo" : "Choose Selfie Photo"}
            </div>
            <div className="file-subtext">JPEG or PNG file capture</div>
            {image && (
              <span className="file-badge">
                Selected: {image.name.length > 20 ? image.name.substring(0, 17) + "..." : image.name}
              </span>
            )}
          </label>
          <input
            id="verify-image"
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
          onClick={verifyFace}
          disabled={loading || !usn || !image}
        >
          {loading ? "Verifying..." : "Verify Face Match"}
        </button>

        <div className="face-footer-links">
          <Link to="/student" className="face-footer-link">
            ← Student Dashboard
          </Link>
          <Link to="/face-register" className="face-footer-link">
            Register Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FaceVerification;