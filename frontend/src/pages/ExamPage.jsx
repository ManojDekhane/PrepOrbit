import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import API from "../utils/axios";

function ExamPage() {
    const { exam, year, paperCode } = useParams();
    const { user, authLoading } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);

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
        if (authLoading) return;
        if (!user) return;

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
        }

        fetchQuestions();
    }, [authLoading, exam, year]);

    const handleOptionChange = (questionId, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: option
        }))
    };

    const handleSubmit = async () => {
        let correct = 0;
        const answers = [];

        questions.forEach(q => {
            const selected = selectedAnswers[q._id] || "";
            const isCorrect = selected === q.correctAnswer;
            if (isCorrect) correct++;

            answers.push({
                questionId: q._id,
                selectedAnswer: selected,
                correctAnswer: q.correctAnswer
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
                },
            });
        } catch (err) {
            console.error("Save attempt failed", err);
            alert("Error saving attempt.");
        }
    };


    if (authLoading || loading) return <div>Loading questions...</div>;
    if (!user) return <div>Please login to attempt papers.</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    {exam.toUpperCase()} {year} {paperCode && `- ${paperCode.toUpperCase()}`}
                </h2>
                <span className="font-mono text-lg bg-yellow-100 px-3 py-1 rounded">
                    ⏱️ {formatTime()}
                </span>
            </div>

            {questions.map((q, idx) => (
                <div key={q._id} className="mb-6 border-b pb-4">
                    <p className="font-medium">
                        {idx + 1}. {q.questionText}
                    </p>
                    <div className="ml-4 mt-2 space-y-1">
                        {q.options.map((opt) => (
                            <label key={opt} className="block">
                                <input
                                    type="radio"
                                    name={`question-${q._id}`}
                                    value={opt}
                                    checked={selectedAnswers[q._id] === opt}
                                    onChange={() => handleOptionChange(q._id, opt)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Submit
            </button>
        </div>
    );
}

export default ExamPage;