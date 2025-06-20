import { useEffect, useState } from "react";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";

function MyAttemptsPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await API.get("/attempts/my");
        setAttempts(res.data);
      } catch (err) {
        console.error("Failed to load attempts:", err);
        alert("Could not load your attempt history.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAttempts();
  }, [user]);

  if (!user)
    return (
      <div className="text-center py-10 text-lg text-red-600">
        ⚠️ Please log in to view your attempts.
      </div>
    );

  if (loading)
    return (
      <div className="text-center py-10 text-lg text-blue-600">
        ⏳ Loading your attempts...
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">📘 Your Past Attempts</h2>

      {attempts.length === 0 ? (
        <p className="text-gray-600 bg-white p-4 rounded shadow text-center">
          You haven't taken any exams yet. Try one now!
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-slate-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-50 text-blue-700 uppercase text-xs">
              <tr>
                <th className="px-5 py-3">Exam</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Out of</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr
                  key={attempt._id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-slate-100 transition`}
                >
                  <td className="px-5 py-3 font-medium">{attempt.exam.toUpperCase()}</td>
                  <td className="px-5 py-3">{attempt.year}</td>
                  <td className="px-5 py-3 text-green-600 font-semibold">{attempt.score}</td>
                  <td className="px-5 py-3">{attempt.totalQuestions}</td>
                  <td className="px-5 py-3">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyAttemptsPage;
