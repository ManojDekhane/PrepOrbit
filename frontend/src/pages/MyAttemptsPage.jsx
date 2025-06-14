import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";

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

    if (!user) return <div>Please login to view your attempts.</div>;
    if (loading) return <div>Loading your attempts...</div>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Past Attempts</h2>
            {attempts.length === 0 ? (
                <p>No attempts found.</p>
            ) : (
                <table className="w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Exam</th>
                            <th className="p-2 border">Year</th>
                            <th className="p-2 border">Score</th>
                            <th className="p-2 border">Out of</th>
                            <th className="p-2 border">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attempts.map((attempt) => (
                            <tr key={attempt._id}>
                                <td className="p-2 border">{attempt.exam.toUpperCase()}</td>
                                <td className="p-2 border">{attempt.year}</td>
                                <td className="p-2 border text-green-600 font-semibold">{attempt.score}</td>
                                <td className="p-2 border">{attempt.totalQuestions}</td>
                                <td className="p-2 border">{new Date(attempt.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MyAttemptsPage;