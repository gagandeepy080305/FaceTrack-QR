import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import PageShell from "../components/PageShell";
import Notice from "../components/Notice";
import { UserCheckIcon } from "../components/Icons";

function FaceStatus() {
  const [usn, setUsn] = useState("");
  const [checkedUsn, setCheckedUsn] = useState("");
  const [registered, setRegistered] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStatus = async (e) => {
    e.preventDefault();
    setError("");
    setRegistered(null);

    if (!usn.trim()) {
      setError("Enter your USN to check your face status.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/face/status/${encodeURIComponent(usn.trim())}`
      );
      setRegistered(response.data.registered);
      setCheckedUsn(usn.trim());
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not check face status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      width="md"
      icon={UserCheckIcon}
      title="Face Status"
      subtitle="Check whether your face profile is registered"
      back={{ to: "/student-portal", label: "Student Portal" }}
      footer={
        <>
          <span />
          <Link className="ft-link" to="/face-register">Register face →</Link>
        </>
      }
    >
      <form onSubmit={checkStatus}>
        <label className="ft-label" htmlFor="usn">University Seat Number (USN)</label>
        <div className="ft-row">
          <input
            id="usn"
            className="ft-input"
            type="text"
            placeholder="e.g. 1RV21CS001"
            value={usn}
            onChange={(e) => setUsn(e.target.value.toUpperCase())}
          />
          <button className="ft-btn ft-btn--primary" type="submit" disabled={loading}>
            {loading && <span className="ft-spinner" />}
            {loading ? "Checking…" : "Check status"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 20 }}>
        <Notice type="error">{error}</Notice>
        {registered === true && (
          <Notice type="success" title="Face registered">
            {checkedUsn} is ready for QR check-ins.
          </Notice>
        )}
        {registered === false && (
          <Notice type="warning" title="Face not registered">
            {checkedUsn} has no face profile yet. Register your face to use QR check-ins.
          </Notice>
        )}
      </div>
    </PageShell>
  );
}

export default FaceStatus;
