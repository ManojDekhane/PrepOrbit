import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../utils/axios";

function FeedbackPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !feedback || rating === 0) {
      return alert("Please fill all fields and select a rating");
    }

    setSubmitting(true);

    try {
      await API.post("/feedback", { name, feedback, rating });
      navigate("/results/" + state.exam + "/" + state.year, { state });
    } catch (err) {
      alert("Failed to send feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full space-y-4 relative">
        <h2 className="text-xl font-bold text-center text-blue-700">We value your feedback!</h2>

        <input
          type="text"
          placeholder="Your Name"
          className="border border-gray-300 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Write your feedback here..."
          className="border border-gray-300 w-full px-3 py-2 rounded-md h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {/* Floating Empty-to-Filled Star Rating */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-3xl cursor-pointer transition-transform hover:scale-125 ${
                rating >= star ? "text-yellow-400" : "text-gray-400"
              }`}
              onClick={() => setRating(star)}
            >
              {rating >= star ? "⭐" : "☆"}
            </span>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md w-full mt-4 transition-transform hover:scale-[1.02]"
        >
          {submitting ? "Sending..." : "Submit Feedback & View Results"}
        </button>
      </div>
    </div>
  );
}

export default FeedbackPage;
