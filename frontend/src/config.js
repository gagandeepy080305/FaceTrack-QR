
export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://facetrack-qr-backend.onrender.com";

export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL ||
  (typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "http://localhost:5173");
