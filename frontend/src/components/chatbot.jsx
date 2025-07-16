
import { Link, useLocation } from "react-router-dom";
import robot from "../assets/robot.png";

export default function FloatingChatButton() {
  const location = useLocation();

 
  if (location.pathname === "/prepbot") return null;

  return (
    <Link
      to="/prepbot"
      className="fixed bottom-6 right-6 z-50  p-1  transition hover:scale-105"
      title="Ask PrepBot"
    >
      <img
        src={robot}
        alt="Chatbot"
        className="w-25 h-25 animate-bounce "
      />
    </Link>
  );
}
