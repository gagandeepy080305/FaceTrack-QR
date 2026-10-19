import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import {
  CameraIcon,
  ChartIcon,
  ChevronRightIcon,
  UserCheckIcon,
} from "../components/Icons";

const OPTIONS = [
  {
    to: "/attendance",
    icon: ChartIcon,
    title: "View Attendance",
    desc: "Subject-wise attendance and percentages",
  },
  {
    to: "/face-register",
    icon: CameraIcon,
    title: "Face Registration",
    desc: "Enrol your face for QR check-ins",
  },
  {
    to: "/face-status",
    icon: UserCheckIcon,
    title: "Face Status",
    desc: "Check whether your face is registered",
  },
];

function StudentPortal() {
  return (
    <PageShell
      width="md"
      icon={UserCheckIcon}
      title="Student Portal"
      subtitle="Manage your face profile and review your attendance"
      back={{ to: "/", label: "Faculty sign in" }}
    >
      <nav className="ft-hub" aria-label="Student services">
        {OPTIONS.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="ft-hub__item">
            <span className="ft-hub__icon"><Icon size={22} /></span>
            <span className="ft-hub__body">
              <strong>{title}</strong>
              <span>{desc}</span>
            </span>
            <ChevronRightIcon size={18} className="ft-hub__chev" />
          </Link>
        ))}
      </nav>

      <p className="ft-hint" style={{ marginTop: 20 }}>
        To mark attendance, scan the QR code shown by your faculty in class.
      </p>
    </PageShell>
  );
}

export default StudentPortal;
