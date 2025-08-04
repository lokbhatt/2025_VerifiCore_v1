import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Message = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const message = params.get("message");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login/member");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const isSuccess = status === "1";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "28px", color: isSuccess ? "#28a745" : "#dc3545" }}>
          {isSuccess ? "✅ Success" : "❌ Error"}
        </h2>
        <p style={{ fontSize: "18px", margin: "20px 0", color: "#333" }}>
          {message || "Something went wrong. Please try again."}
        </p>
        <button
          onClick={() => navigate("/login/member")}
          style={{
            padding: "12px 24px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          Go to Login
        </button>
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#888" }}>
          Redirecting to login in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default Message;
