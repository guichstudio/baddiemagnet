import { useEffect } from "react";

export default function Reset() {
  useEffect(() => {
    localStorage.removeItem("bm_session");
    window.location.href = "/";
  }, []);

  return <p style={{ color: "#1A1A1A", padding: 40 }}>Resetting...</p>;
}
