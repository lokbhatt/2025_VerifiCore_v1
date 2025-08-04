// src/components/SessionMessage.jsx
import { useSession } from "../context/SessionContext";
import "../css/session.css";

const SessionMessage = () => {
  const { message } = useSession();

  if (!message) return null;

  return (
    <div className={`session-toast ${message.type}`}>
      {message.text}
    </div>
  );
};

export default SessionMessage;
