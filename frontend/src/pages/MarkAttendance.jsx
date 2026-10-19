import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import PageShell from "../components/PageShell";
import Notice from "../components/Notice";
import FileDrop from "../components/FileDrop";
import { ScanIcon } from "../components/Icons";

/**
 * Attendance check-in. Reached only by scanning the session QR shown by
 * faculty (/mark?session=<id>) — it is intentionally not linked from the
 * Student Portal.
 */
function MarkAttendance() {
  const [params] = useSearchParams();
  const sessionId = params.get("session") || "";

  const [usn, setUsn] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const markAttendance = async (e) => {
    e.preventDefault();
    setResult(null);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("usn", usn.trim());
      formData.append("image", image);

      const faceResponse = await axios.post(`${API_URL}/face/verify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!faceResponse.data.verified) {
        setResult({
          type: "error",
          title: "Face verification failed",
          text: "Your selfie did not match the registered face. Try again in good lighting.",
        });
        return;
      }

      const attendanceResponse = await axios.post(`${API_URL}/attendance/mark`, {
        session_id: sessionId,
        usn: usn.trim(),
      });

      setResult({
        type: "success",
        title: "Attendance recorded",
        text: attendanceResponse.data.message,
      });
    } catch (err) {
      console.error(err);
      setResult({
        type: "error",
        title: "Could not mark attendance",
        text: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const done = result?.type === "success";

  return (
    <PageShell
      width="md"
      icon={ScanIcon}
      title="Mark Attendance"
      subtitle="Verify your face to check in to this class session"
      footer={
        <>
          <Link to="/student-portal" className="ft-link">Student Portal</Link>
          <Link to="/attendance" className="ft-link">View my attendance</Link>
        </>
      }
    >
      {!sessionId ? (
        <>
          <Notice type="warning" title="No active session">
            Scan the QR code displayed by your faculty to open a check-in link.
          </Notice>
          <Link to="/scan" className="ft-btn ft-btn--primary ft-btn--block">
            <ScanIcon size={18} /> Scan session QR
          </Link>
        </>
      ) : (
        <form onSubmit={markAttendance}>
          {result && <Notice type={result.type} title={result.title}>{result.text}</Notice>}

          <div className="ft-field">
            <label className="ft-label" htmlFor="session">Session ID</label>
            <input id="session" className="ft-input" type="text" value={sessionId} readOnly />
          </div>

          <div className="ft-field">
            <label className="ft-label" htmlFor="usn">University Seat Number (USN)</label>
            <input
              id="usn"
              className="ft-input"
              type="text"
              placeholder="e.g. 1RV21CS001"
              value={usn}
              disabled={done}
              onChange={(e) => setUsn(e.target.value.toUpperCase())}
            />
          </div>

          <div className="ft-field">
            <span className="ft-label">Verification selfie</span>
            <FileDrop
              id="selfie-file"
              file={image}
              onChange={setImage}
              capture="user"
              title="Take a selfie"
              hint="Opens your camera on mobile devices"
            />
          </div>

          <button
            className="ft-btn ft-btn--primary ft-btn--block"
            type="submit"
            disabled={loading || done || !usn.trim() || !image}
          >
            {loading && <span className="ft-spinner" />}
            {loading ? "Verifying face…" : done ? "Attendance marked" : "Verify & mark attendance"}
          </button>
        </form>
      )}
    </PageShell>
  );
}

export default MarkAttendance;
