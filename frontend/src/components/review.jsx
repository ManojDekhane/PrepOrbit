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
    <section className="bg-slate-50 py-14 px-4 mt-9">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">
          💬 What Students Say
        </h2>

        {/* Review Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 space-y-4 mb-10 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Your Review"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={2}
              className="md:col-span-2 px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium rounded transition"
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
                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-blue-800 font-medium text-sm">{r.name}</p>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Review;
