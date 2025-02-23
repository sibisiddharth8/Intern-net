import { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";

const Notification = ({ message, type = "info", onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-close notification after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg ${typeStyles[type]}`}
    >
      <Bell className="w-5 h-5" />
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className="ml-2 cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;
