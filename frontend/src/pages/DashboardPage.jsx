import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
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
        }

        if (user) fetchAttempts();

    }, [user]);

    const totalAttempts = attempts.length;
    const avgScore =
        totalAttempts > 0
            ? Math.round(
                attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts
            ) : 0;

    if (!user) return <div>Please log in to access your dashboard.</div>
    if (loading) return <div>Loading your dashboard...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Welcome, {user.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded p-4">
                    <p className="text-gray-500">Total Attempts</p>
                    <p className="text-2xl font-semibold">{totalAttempts}</p>
                </div>
                <div className="bg-white shadow rounded p-4">
                    <p className="text-gray-500">Average Score</p>
                    <p className="text-2xl font-semibold">{avgScore}</p>
                </div>
                <div className="bg-white shadow rounded p-4">
                    <p className="text-gray-500">Email</p>
                    <p className="text-lg text-gray-700">{user.email}</p>
                </div>
            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">Recent Attempts</h3>
            {attempts.length === 0 ? (
                <p>No attempts yet. Start practicing now!</p>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Exam</th>
                                <th className="p-3">Year</th>
                                <th className="p-3">Score</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.slice(0, 5).map((a) => (
                                <tr key={a._id} className="border-t">
                                    <td className="p-3">{a.exam.toUpperCase()}</td>
                                    <td className="p-3">{a.year}</td>
                                    <td className="p-3 text-green-600">{a.score}</td>
                                    <td className="p-3">{a.totalQuestions}</td>
                                    <td className="p-3">{new Date(a.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-4">
                <Link
                    to="/my-attempts"
                    className="text-blue-600 hover:underline font-medium"
                >
                    View All Attempts →
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;