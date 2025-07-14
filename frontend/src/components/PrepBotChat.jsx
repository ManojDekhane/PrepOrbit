import { useState } from "react";
import API from "../utils/axios";

function PrepBotChat() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg mt-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">🤖 Ask PrepBot</h2>

            <div className="h-80 overflow-y-auto border p-3 mb-3 rounded bg-gray-50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`mb-2 p-2 rounded ${msg.role === "user"
                                ? "bg-blue-100 text-right"
                                : "bg-green-100 text-left"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {loading && <p className="text-gray-500">PrepBot is typing...</p>}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-grow border rounded px-3 py-2"
                    placeholder="Type your doubt like 'Explain Ohm's Law'"
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default PrepBotChat;