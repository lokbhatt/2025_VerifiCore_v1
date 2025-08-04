import { createContext, useContext, useState, useEffect } from "react";
import { registerSessionHandler } from "./SessionBus";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000); // Auto-dismiss
  };

  useEffect(() => {
    registerSessionHandler(showMessage);
  }, []);

  return (
    <SessionContext.Provider value={{ message, showMessage }}>
      {children}
      {message && (
        <div className={`toast ${message.type}`}>
          {message.text}
        </div>
      )}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
