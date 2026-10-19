import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import PageShell from "../components/PageShell";
import { ScanIcon } from "../components/Icons";

function QRScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { qrbox: { width: 250, height: 250 }, fps: 5 },
      false
    );

    scanner.render(
      (decodedText) => {
        // The QR holds either a full check-in URL or a bare session id.
        let sessionId = decodedText;
        try {
          sessionId = new URL(decodedText).searchParams.get("session") || decodedText;
        } catch {
          /* not a URL — treat as raw session id */
        }
        window.location.href = `/mark?session=${encodeURIComponent(sessionId)}`;
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <PageShell
      width="md"
      icon={ScanIcon}
      title="Scan Session QR"
      subtitle="Point your camera at the QR code shown by your faculty"
      back={{ to: "/student-portal", label: "Student Portal" }}
    >
      <div className="ft-scanner">
        <div id="reader" />
      </div>
    </PageShell>
  );
}

export default QRScanner;
