import { AlertIcon, CheckIcon, InfoIcon } from "./Icons";

const ICONS = { success: CheckIcon, error: AlertIcon, info: InfoIcon, warning: AlertIcon };

export default function Notice({ type = "info", title, children }) {
  if (!children && !title) return null;
  const Icon = ICONS[type];
  return (
    <div className={`ft-notice ft-notice--${type}`} role={type === "error" ? "alert" : "status"}>
      <Icon size={18} />
      <div>
        {title && <strong>{title}</strong>}
        {children && <span>{children}</span>}
      </div>
    </div>
  );
}
