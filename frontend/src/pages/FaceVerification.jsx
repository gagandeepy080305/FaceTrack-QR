import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import PageShell from "../components/PageShell";
import Notice from "../components/Notice";
import FileDrop from "../components/FileDrop";
import { UserCheckIcon } from "../components/Icons";

function FaceVerification() {
  const [usn, setUsn] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const verifyFace = async (e) => {
    e.preventDefault();
    setResult(null);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("usn", usn.trim());
      formData.append("image", image);

      const response = await axios.post(`${API_URL}/face/verify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { verified, distance } = response.data;
      setResult(
        verified
          ? { type: "success", title: "Face verified", text: `Match distance: ${distance}` }
          : { type: "error", title: "Face not matched", text: `Match distance: ${distance}` }
      );
    } catch (err) {
      console.error(err);
      setResult({
        type: "error",
        title: "Verification failed",
        text: err.response?.data?.message || "Could not verify. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      width="md"
      icon={UserCheckIcon}
      title="Test Face Verification"
      subtitle="Confirm your registered face is recognised before class"
      back={{ to: "/face-register", label: "Face Registration" }}
      footer={
        <>
          <Link to="/student-portal" className="ft-link">Student Portal</Link>
          <span />
        </>
      }
    >
      <form onSubmit={verifyFace}>
        {result && <Notice type={result.type} title={result.title}>{result.text}</Notice>}

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
          <span className="ft-label">Selfie</span>
          <FileDrop
            id="verify-image"
            file={image}
            onChange={setImage}
            capture="user"
            title="Take or choose a selfie"
            hint="Opens your camera on mobile devices"
          />
        </div>

        <button
          className="ft-btn ft-btn--primary ft-btn--block"
          type="submit"
          disabled={loading || !usn.trim() || !image}
        >
          {loading && <span className="ft-spinner" />}
          {loading ? "Verifying…" : "Verify face"}
        </button>
      </form>
    </PageShell>
  );
}

export default FaceVerification;
