import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import "../../css/frontend/Register.css";
import { triggerSessionMessage } from "../../context/SessionBus";
import NotAllowed from "../../components/NotAllowed";

const Register = () => {
  const navigate = useNavigate();
  const {role} = useParams();
  const ROLE_ROUTE = {member: "login/member"}
  if (!Object.keys(ROLE_ROUTE).includes(role)) {
    return <NotAllowed role={role} type="register" />;
  }
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Member Registration - VerifiCore";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const formErrors = {};
    const nameRegex = /^[A-Za-z\s]{6,26}$/;
    const usernameRegex = /^[A-Z][A-Za-z\d]{3,5}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(97|98)\d{8}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!form.name.trim()) {
      formErrors.name = "Name is required.";
    } else if (!nameRegex.test(form.name)) {
      formErrors.name = "Name must be 6–26 letters only.";
    }

    if (!form.username.trim()) {
      formErrors.username = "Username is required.";
    } else if (!usernameRegex.test(form.username)) {
      formErrors.username = "Start with uppercase letter (4–6 chars).";
    }

    if (!form.email.trim()) {
      formErrors.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      formErrors.email = "Invalid email format.";
    }

    if (!form.phone.trim()) {
      formErrors.phone = "Phone is required.";
    } else if (!phoneRegex.test(form.phone)) {
      formErrors.phone = "Must start with 97/98 and be 10 digits.";
    }

    if (!form.password.trim()) {
      formErrors.password = "Password is required.";
    } else if (!passwordRegex.test(form.password)) {
      formErrors.password = "Min 8 chars, upper/lowercase, number & symbol.";
    }

    if (!form.password_confirmation.trim()) {
      formErrors.password_confirmation = "Password Confirmation is required.";
    } else if (form.password !== form.password_confirmation) {
      formErrors.password_confirmation = "Passwords do not match.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setNotice("");
    setErrors({});

    try {
      const res = await axios.post(`/auth/register/member`, form); //error on this line
      console.log(res);
      
      const success = res.data?.status === true;

      if (success) {
        setNotice("Registration successful! Please verify your email.");
        triggerSessionMessage("info", "A verification email has been sent.");
        localStorage.setItem("pending_email_token", res.data.data?.token || "");
        setTimeout(() => navigate(`/login/member?registered=1`), 3000);
      } else {
        triggerSessionMessage("error", res.data?.message || "Registration failed.");
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors || {};
      setErrors(serverErrors);
      triggerSessionMessage("error", err.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Member Registration</h2>
        {notice && <p className="notice-text success-text">{notice}</p>}

        <form onSubmit={handleSubmit} className="register-form">
          {[
            { name: "name", type: "text", placeholder: "Full Name" },
            { name: "username", type: "text", placeholder: "Username" },
            { name: "email", type: "email", placeholder: "Email Address" },
            { name: "phone", type: "tel", placeholder: "Phone Number" },
            { name: "password", type: "password", placeholder: "Password" },
            { name: "password_confirmation", type: "password", placeholder: "Confirm Password" },
          ].map(({ name, type, placeholder }) => (
            <div className="input-group" key={name}>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className={`form-input ${errors[name] ? "input-error" : ""}`}
              />
              {errors[name] && <span className="error-text">{errors[name]}</span>}
            </div>
          ))}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
