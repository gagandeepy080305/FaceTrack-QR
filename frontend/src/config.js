export const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname
    ? `http://${window.location.hostname}:5001`
    : "http://localhost:5001");

export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  (typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "http://localhost:5173");
