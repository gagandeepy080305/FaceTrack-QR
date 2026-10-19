import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import PageShell from "../components/PageShell";
import Notice from "../components/Notice";
import FileDrop from "../components/FileDrop";
import { CameraIcon } from "../components/Icons";

function FaceRegistration() {
  const [usn, setUsn] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const registerFace = async (e) => {
    e.preventDefault();
    setResult(null);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("usn", usn.trim());
      formData.append("image", image);

      const response = await axios.post(`${API_URL}/face/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult({ type: "success", text: response.data.message || "Face registered successfully." });
    } catch (err) {
      console.error(err);
      setResult({
        type: "error",
        text: err.response?.data?.message || "Face registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      width="md"
      icon={CameraIcon}
      title="Face Registration"
      subtitle="Enrol your face once to use QR check-ins"
      back={{ to: "/student-portal", label: "Student Portal" }}
      footer={
        <>
          <Link to="/face-status" className="ft-link">Check face status</Link>
          <Link to="/face-verify" className="ft-link">Test verification →</Link>
        </>
      }
    >
      <form onSubmit={registerFace}>
        {result && <Notice type={result.type}>{result.text}</Notice>}

        <div className="ft-field">
          <label className="ft-label" htmlFor="usn">University Seat Number (USN)</label>
          <input
            id="usn"
            className="ft-input"
            type="text"
            placeholder="e.g. 1RV21CS001"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
          />
        </div>

        <div className="ft-field">
          <span className="ft-label">Profile photo</span>
          <FileDrop
            id="face-image"
            file={image}
            onChange={setImage}
            title="Choose a profile photo"
            hint="Clear, front-facing portrait · JPEG or PNG"
          />
          <p className="ft-hint">Use good lighting and keep your face unobstructed.</p>
        </div>

        <button
          className="ft-btn ft-btn--primary ft-btn--block"
          type="submit"
          disabled={loading || !usn.trim() || !image}
        >
          {loading && <span className="ft-spinner" />}
          {loading ? "Registering…" : "Register face"}
        </button>
      </form>
    </PageShell>
  );
}

export default FaceRegistration;
