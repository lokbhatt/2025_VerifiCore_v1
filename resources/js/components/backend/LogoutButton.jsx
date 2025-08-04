import React from "react";
import { useAuth } from "../../auth/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className="logout-btn">
      🚪 Logout
    </button>
  );
};

export default LogoutButton;