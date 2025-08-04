import { useNavigate } from "react-router-dom";

const NotAllowed = ({ role, type = "registration" }) => {
  const navigate = useNavigate();

  const title =
    type === "login"
      ? "🚫 Login Not Allowed"
      : "🚫 Registration Not Allowed";

  const message =
    type === "login"
      ? `Sorry, login for the role "${role}" is not permitted.`
      : `Sorry, registration for the role "${role}" is not permitted.`;

  const suggestion =
    type === "login"
      ? "Please use a valid role or contact support if you believe this is an error."
      : "Please choose a valid role or contact support if you believe this is an error.";

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.message}>
          {message}
        </p>
        <p style={styles.suggestion}>
          {suggestion}
        </p>
        <button style={styles.button} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe6e6",
    padding: "1rem",
    boxSizing: "border-box",
  },
  box: {
    maxWidth: "400px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#cc0000",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    color: "#660000",
  },
  suggestion: {
    fontSize: "1rem",
    marginBottom: "2rem",
    color: "#990000",
  },
  button: {
    padding: "0.7rem 2rem",
    fontSize: "1rem",
    backgroundColor: "#cc0000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default NotAllowed;
