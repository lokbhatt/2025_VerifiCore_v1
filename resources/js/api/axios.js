import axios from "axios";
import { triggerSessionMessage } from "../context/SessionBus";

const REGISTRATION_ROLES = ["member", "staff"];
const LOGIN_ROLES = ["admin", "staff", "member"];

const api = axios.create({
  baseURL: "http://192.168.101.6:8000/api",
  headers:{
    "Content-type":"application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export const csrf = () => axios.get(import.meta.env.VITE_API_URL + "/sanctum/csrf-cookie", {
  withCredentials: true,
});

export const register = (role, data) => {
  if (!REGISTRATION_ROLES.includes(role)) {
    return Promise.reject(new Error(`Registration not allowed for: ${role}`));
  }

  return csrf().then(() => api.post(`/auth/register/${role}`, data));
};

export const login = (data) =>
  csrf().then(() =>
    api.post("/auth/login", data).then((res) => {
      const userRole = res?.data?.data?.role;

      if (!LOGIN_ROLES.includes(userRole)) {
        return Promise.reject(new Error("Unauthorized role"));
      }
      return res;
    })
  );

export const logout = () => api.post("/logout");
export const checkVerified = () => api.get("/email/verified-check");
export const sendVerification = () => api.post("/email/verify/send");
export const getUser = () => api.get("/user");
export const getMemberProfile = () => api.get("/member/me");
export const getMembers = () => api.get("/member/members");
export const getDashboardStats = () => api.get("/dashboard-stats");
export const getAdminProfile = () => api.get("/admin/admin-profile");
export const resendVerificationEmail = () =>
  csrf().then(() => api.post("/email/resend"));

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const message = response?.data?.message;
    if (message) {
      triggerSessionMessage("success", message);
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    if (error.response?.status === 401) {
      console.warn("Unauthorized — login required.");
    } else if (error.response?.status === 403) {
      console.warn("Forbidden — insufficient permissions.");
    } else if (error.response?.status >= 500) {
      console.error("Server error — try again later.");
    }

    triggerSessionMessage("error", message);
    return Promise.reject(error);
  }
);

export default api;
