import { useState, useEffect } from "react";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ name: "", comment: "" });

  useEffect(() => {
    const stored = localStorage.getItem("review");
    if (stored) setReviews(JSON.parse(stored));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return;

    const updated = [...reviews, formData];
    setReviews(updated);
    localStorage.setItem("review", JSON.stringify(updated));
    setFormData({ name: "", comment: "" });
  };

  return (
    <section className="bg-slate-50 py-14 px-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">
          💬 What Students Say
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 space-y-5 mb-10 max-w-xl mx-auto"
        >
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              placeholder="Write your feedback here..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
            >
              Submit Review
            </button>
          </div>
        </form>

        {/* Review Cards */}
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-blue-800 font-semibold text-sm">{r.name}</p>
                </div>
                <p className="text-gray-700 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Review;
