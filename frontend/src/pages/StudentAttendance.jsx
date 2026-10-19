import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import PageShell from "../components/PageShell";
import Notice from "../components/Notice";
import { ChartIcon, SearchIcon } from "../components/Icons";

const REQUIRED = 75;
const GOOD = 85;

const tone = (pct) => (pct >= GOOD ? "good" : pct >= REQUIRED ? "warn" : "bad");

function StudentAttendance() {
  const [usn, setUsn] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getAttendance = async (e) => {
    e.preventDefault();
    setError("");

    if (!usn.trim()) {
      setError("Enter your USN to view your report.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/attendance/student/${encodeURIComponent(usn.trim())}`
      );
      setAttendance(response.data);
    } catch (err) {
      console.error(err);
      setAttendance(null);
      setError(err.response?.data?.message || "Could not fetch attendance for this USN.");
    } finally {
      setLoading(false);
    }
  };

  const rows = attendance?.attendance ?? [];
  const attended = rows.reduce((s, r) => s + Number(r.attended || 0), 0);
  const total = rows.reduce((s, r) => s + Number(r.total || 0), 0);
  const overall = total ? (attended / total) * 100 : 0;
  const lowCount = rows.filter((r) => parseFloat(r.percentage) < REQUIRED).length;

  return (
    <PageShell
      width="lg"
      icon={ChartIcon}
      title="Attendance Report"
      subtitle="Look up subject-wise attendance using your USN"
      back={{ to: "/student-portal", label: "Student Portal" }}
    >
      <form onSubmit={getAttendance}>
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
            {loading ? <span className="ft-spinner" /> : <SearchIcon size={18} />}
            {loading ? "Loading…" : "View report"}
          </button>
        </div>
      </form>

      {error && <div style={{ marginTop: 20 }}><Notice type="error">{error}</Notice></div>}

      {attendance && (
        <>
          <div className="ft-identity">
            <div><small>Student</small><strong>{attendance.name}</strong></div>
            <div><small>USN</small><strong>{attendance.usn}</strong></div>
          </div>

          <div className="ft-stats">
            <div className={`ft-stat ft-stat--${tone(overall)}`}>
              <small>Overall</small><strong>{overall.toFixed(1)}%</strong>
            </div>
            <div className="ft-stat">
              <small>Classes attended</small><strong>{attended} / {total}</strong>
            </div>
            <div className={`ft-stat ${lowCount ? "ft-stat--bad" : "ft-stat--good"}`}>
              <small>Below {REQUIRED}%</small>
              <strong>{lowCount} {lowCount === 1 ? "subject" : "subjects"}</strong>
            </div>
          </div>

          <div className="ft-table-wrap">
            <table className="ft-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th className="ft-num">Attended</th>
                  <th className="ft-num">Total</th>
                  <th className="ft-num">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((subject) => {
                  const pct = parseFloat(subject.percentage) || 0;
                  const t = tone(pct);
                  return (
                    <tr key={subject.subject_code}>
                      <td>{subject.subject_code}</td>
                      <td className="ft-num">{subject.attended}</td>
                      <td className="ft-num">{subject.total}</td>
                      <td>
                        <div className="ft-pct">
                          <div className={`ft-bar ft-bar--${t}`}>
                            <i style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className={`ft-badge ft-badge--${t}`}>{subject.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageShell>
  );
}

export default StudentAttendance;
