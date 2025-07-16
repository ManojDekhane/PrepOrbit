import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function PrepBotChat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const res = await API.post("/groqChatBot/chatbot", { userMessage: userInput });
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl h-[90vh] sm:h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm hover:underline focus:outline-none"
          >
            ← Back
          </button>
          <div className="font-semibold text-lg">🤖 PrepBot</div>
          <div className="w-12" /> {/* Spacer to balance layout */}
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50 space-y-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100"
          ref={scrollRef}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-xl px-4 py-2 text-sm max-w-[80%] shadow-sm whitespace-pre-wrap
                  ${msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-green-100 text-gray-800 rounded-bl-none"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 text-xs italic text-center">
              PrepBot is typing...
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-2 border-t px-3 py-2 bg-white">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question..."
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrepBotChat;
