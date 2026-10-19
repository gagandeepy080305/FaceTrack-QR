import { Link } from "react-router-dom";
import { ArrowLeftIcon, CapIcon } from "./Icons";
import "./ui.css";

/**
 * Shared page frame: brand bar, optional back link, and a centred card with
 * an icon-tile header. Used by every student-facing page for consistency.
 */
export default function PageShell({
  icon: Icon,
  title,
  subtitle,
  back,
  width = "md",
  bare,
  children,
  footer,
}) {
  return (
    <div className="ft-page">
      <header className="ft-topbar">
        <Link to="/" className="ft-brand">
          <span className="ft-brand__mark"><CapIcon size={18} /></span>
          <span>FaceTrack&nbsp;QR</span>
        </Link>
        <span className="ft-topbar__tag">Smart Attendance System</span>
      </header>

      <main className="ft-main">
        {bare ? children : (
        <div className={`ft-card ft-card--${width}`}>
          {back && (
            <Link to={back.to} className="ft-back">
              <ArrowLeftIcon size={16} /> {back.label}
            </Link>
          )}

          <div className="ft-card__head">
            {Icon && (
              <span className="ft-tile"><Icon size={24} /></span>
            )}
            <div>
              <h1 className="ft-h1">{title}</h1>
              {subtitle && <p className="ft-sub">{subtitle}</p>}
            </div>
          </div>

          {children}

          {footer && <div className="ft-card__foot">{footer}</div>}
        </div>
        )}
      </main>
    </div>
  );
}
