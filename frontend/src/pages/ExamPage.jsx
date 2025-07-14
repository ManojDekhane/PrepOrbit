import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../utils/axios";

function ExamPage() {
    const { exam, year, paperCode } = useParams();
    const { user, authLoading } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
        const h = Math.floor(timeLeft / 3600);
        const m = Math.floor((timeLeft % 3600) / 60);
        const s = timeLeft % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (authLoading || !user) return;

        const fetchQuestions = async () => {
            try {
                const res = await API.get(`/questions/${exam}/${year}/${paperCode}`);
                setQuestions(res.data);
            } catch (err) {
                console.error("Failed to fetch questions", err);
                alert("Failed to load paper");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [authLoading, user, exam, year, paperCode]);

    const handleOptionChange = (questionId, option) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleSubmit = async () => {
        let correct = 0;
        const answers = [];

        questions.forEach((q) => {
            const selected = selectedAnswers[q._id] || "";
            const isCorrect = selected === q.correctAnswer;
            if (isCorrect) correct++;

            answers.push({
                questionId: q._id,
            questionText: q.questionText,
            options: q.options, 
            selectedAnswer: selected,
            correctAnswer: q.correctAnswer,
            });
        });

        const attemptData = {
            exam,
            year,
            score: correct,
            totalQuestions: questions.length,
            answers,
            timeTaken: 3 * 60 * 60 - timeLeft,
        };

        try {
            await API.post("/attempts/save", attemptData);
            navigate(`/results/${exam}/${year}`, {
                state: {
                    score: correct,
                    totalQuestions: questions.length,
                    answers,
                    exam,
                    year,
                    paperCode
                },
            });
        } catch (err) {
            console.error("Save attempt failed", err);
            alert("Error saving attempt.");
        }
    };

    if (authLoading || loading) return <div className="p-6 text-center text-gray-600">⏳ Loading questions...</div>;
    if (!user) return <div className="p-6 text-center text-red-600 font-medium">⚠️ Please login to attempt papers.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                    {exam.toUpperCase()} {year} {paperCode && `– ${paperCode.toUpperCase()}`}
                </h2>
                <span className="font-mono text-lg bg-yellow-100 text-yellow-800 px-4 py-1 rounded shadow">
                    ⏱️ {formatTime()}
                </span>
            </div>

            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <div key={q._id} className="bg-white border border-gray-200 rounded shadow-sm p-4">
                        <p className="font-semibold text-gray-800 mb-2">
                            {idx + 1}. {q.questionText}
                        </p>

                        {q.imageUrl && (
                            <img src={q.imageUrl} alt={`Question ${idx + 1}`} className="max-w-full h-auto my-3 rounded shadow" />
                        )}

                        <div className="space-y-2 ml-2">
                            {q.options.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${q._id}`}
                                        value={opt}
                                        checked={selectedAnswers[q._id] === opt}
                                        onChange={() => handleOptionChange(q._id, opt)}
                                        className="mr-3 accent-blue-600"
                                    />
                                    <span className="text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
                >
                    🚀 Submit Paper
                </button>
            </div>
        </div>
    );
}

export default ExamPage;
