import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await API.get("/attempts/my");
        setAttempts(res.data);
      } catch (err) {
        console.error("Error loading attempts", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAttempts();
  }, [user]);

  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts
        )
      : 0;

  if (!user) return <div className="text-center py-10 text-lg">⚠️ Please log in to access your dashboard.</div>;
  if (loading) return <div className="text-center py-10 text-lg">⏳ Loading your dashboard...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Welcome, {user.name}</h2>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-6 hover:shadow-md transition">
          <p className="text-gray-500">Total Attempts</p>
          <p className="text-3xl font-bold text-blue-700">{totalAttempts}</p>
        </div>
        <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-6 hover:shadow-md transition">
          <p className="text-gray-500">Average Score</p>
          <p className="text-3xl font-bold text-green-600">{avgScore}</p>
        </div>
        <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-6 hover:shadow-md transition">
          <p className="text-gray-500">Email</p>
          <p className="text-lg font-medium text-gray-700">{user.email}</p>
        </div>
      </div>

     
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">📊 Recent Attempts</h3>
      {attempts.length === 0 ? (
        <p className="text-gray-600 text-center py-6 bg-white rounded shadow">No attempts yet. Start practicing now!</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="bg-blue-50 text-blue-700 font-medium">
              <tr>
                <th className="p-4">Exam</th>
                <th className="p-4">Year</th>
                <th className="p-4">Score</th>
                <th className="p-4">Total</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {attempts.slice(0, 5).map((a) => (
                <tr key={a._id} className="border-t hover:bg-slate-50">
                  <td className="p-4">{a.exam.toUpperCase()}</td>
                  <td className="p-4">{a.year}</td>
                  <td className="p-4 text-green-600 font-semibold">{a.score}</td>
                  <td className="p-4">{a.totalQuestions}</td>
                  <td className="p-4">{new Date(a.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    
      <div className="mt-6 text-right">
        <Link
          to="/my-attempts"
          className="inline-block text-blue-600 hover:text-blue-800 font-medium transition"
        >
          View All Attempts →
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
