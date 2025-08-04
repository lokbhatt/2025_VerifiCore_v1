import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { login as loginRequest, sendVerification } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import NotAllowed from "../../components/NotAllowed";
import { triggerSessionMessage } from "../../context/SessionBus";
import "../../css/frontend/Login.css";

// Define valid roles and dashboard routes
const ROLE_ROUTES = {
  member: "/member/dashboard",
  admin: "/admin/dashboard",
};

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const isVerified = new URLSearchParams(location.search).get("verified");

  useEffect(() => {
    if (isVerified) {
      triggerSessionMessage("info", "Email verified successfully!");
    }
    document.title = `${role?.toUpperCase() || "Login"} - VerifiCore`;
  }, [role, isVerified]);

  if (!Object.keys(ROLE_ROUTES).includes(role)) {
    return <NotAllowed role={role} type="login" />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const validateForm = () => {
    const usernameRegex = /^[A-Z][A-Za-z\d]{3,5}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!form.username) return "Username is required.";
    if (!usernameRegex.test(form.username)) return "Invalid username format.";
    if (!form.password) return "Password is required.";
    if (!passwordRegex.test(form.password)) return "Invalid password format.";
    return "";
  };

  const handleSendVerification = async () => {
    setIsSendingVerification(true);
    try {
      await sendVerification();
      setError("✅ Verification email sent.");
    } catch {
      setError("⚠️ Failed to send verification email.");
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMsg = validateForm();
    if (validationMsg) return setError(`⚠️ ${validationMsg}`);

    setLoading(true);
    try {
      const res = await loginRequest(form);
      const { token, role: userRole, remember_token } = res.data.data;
      const redirectPath = ROLE_ROUTES[userRole];
      if (!redirectPath) return setError(`🚫 Invalid role: ${userRole}`);

      if (form.remember) localStorage.setItem("token", token);
      else sessionStorage.setItem("token", token);

      if (remember_token) localStorage.setItem("remember_token", remember_token);

      login(token, userRole);
      navigate(redirectPath);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      const isVerification = err.response?.status === 403 && message.toLowerCase().includes("verify");
      setError(
        isVerification ? (
          <>
            ⚠️ {message}{" "}
            <button onClick={handleSendVerification} disabled={isSendingVerification}>
              {isSendingVerification ? "Sending..." : "Resend Email"}
            </button>
          </>
        ) : `⚠️ ${message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box" noValidate>
        <h2 className="login-title">🔐 {role.toUpperCase()} Login</h2>
        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} autoComplete="username" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} autoComplete="current-password" />
        </div>

        <div className="form-group checkbox">
          <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
          <label>Remember Me</label>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
