import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./QRScanner.css";

function QRScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("QR Code:", decodedText);

        // Extract session ID if decodedText is a URL
        let sessionId = decodedText;
        if (decodedText.includes("?session=")) {
          const urlParams = new URLSearchParams(decodedText.split("?")[1]);
          sessionId = urlParams.get("session") || decodedText;
        }

        // Save Session ID
        localStorage.setItem("session_id", sessionId);

        // Redirect to Student Dashboard with parameter
        window.location.href = `/student?session=${sessionId}`;
      },
      (error) => {
        // Ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="scanner-container">
      <div className="scanner-card">
        <div className="scanner-header">
          <div className="scanner-icon">📷</div>
          <h1 className="scanner-title">Scan QR Attendance</h1>
          <p className="scanner-subtitle">
            Point your camera at the screen QR code to check in
          </p>
        </div>

        <div id="reader"></div>

        <div className="scanner-footer">
          <Link to="/student" className="scanner-back-link">
            ← Student Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;