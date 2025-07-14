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
    const [markedForReview, setMarkedForReview] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
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

    const toggleMarkedForReview = (questionId) => {
        setMarkedForReview((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
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

    const attemptedCount = Object.keys(selectedAnswers).length;
    const markedCount = Object.values(markedForReview).filter(Boolean).length;
    const unattemptedCount = questions.length - attemptedCount;

    const progressPercent = Math.round((attemptedCount / questions.length) * 100);

    return (
        <div className="flex gap-6 p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">

            <div className="w-60 bg-white p-4 rounded shadow h-fit sticky top-20">
                <h3 className="text-md font-semibold mb-2 text-blue-700">📝 Questions</h3>
                <div className="grid grid-cols-4 gap-2">
                    {questions.map((q, idx) => {
                        const isAnswered = selectedAnswers[q._id];
                        const isMarked = markedForReview[q._id];

                        let bgColor = "bg-gray-200";
                        if (isMarked) bgColor = "bg-purple-400 text-white";
                        else if (isAnswered) bgColor = "bg-green-500 text-white";

                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-8 h-8 rounded text-sm font-semibold ${bgColor}`}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Color legend */}
                <div className="mt-4 space-y-1 text-sm">
                    <div><span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>Answered</div>
                    <div><span className="inline-block w-4 h-4 bg-purple-400 rounded mr-2"></span>Marked</div>
                    <div><span className="inline-block w-4 h-4 bg-gray-200 rounded mr-2"></span>Unattempted</div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setShowSummary(prev => !prev)}
                        className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
                    >
                        {showSummary ? "👁️ Hide Summary" : "🧾 Review Summary"}
                    </button>
                </div>

                {showSummary && (
                    <div className="mt-6 bg-gray-50 border border-gray-300 rounded p-3 text-sm">
                        <h4 className="font-bold mb-2 text-gray-700">📋 Review Summary</h4>
                        <p>✅ Attempted: {attemptedCount}</p>
                        <p>❓ Marked: {markedCount}</p>
                        <p>⬜ Unattempted: {unattemptedCount}</p>
                    </div>
                )}


            </div>


            <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {exam.toUpperCase()} {year} {paperCode && `– ${paperCode.toUpperCase()}`}
                    </h2>
                    <span className="font-mono text-lg bg-yellow-100 text-yellow-800 px-4 py-1 rounded shadow">
                        ⏱️ {formatTime()}
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length} — {progressPercent}% completed</p>

                {questions.length > 0 && (
                    <div key={questions[currentQuestionIndex]._id} className="bg-white border border-gray-200 rounded shadow-sm p-4">
                        <p className="font-semibold text-gray-800 mb-2">
                            {currentQuestionIndex + 1}. {questions[currentQuestionIndex].questionText}
                        </p>

                        {questions[currentQuestionIndex].imageUrl && (
                            <img src={questions[currentQuestionIndex].imageUrl} alt={`Question ${currentQuestionIndex + 1}`} className="max-w-full h-auto my-3 rounded shadow" />
                        )}

                        <div className="space-y-2 ml-2">
                            {questions[currentQuestionIndex].options.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${questions[currentQuestionIndex]._id}`}
                                        value={opt}
                                        checked={selectedAnswers[questions[currentQuestionIndex]._id] === opt}
                                        onChange={() => handleOptionChange(questions[currentQuestionIndex]._id, opt)}
                                        className="mr-3 accent-blue-600"
                                    />
                                    <span className="text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={() => toggleMarkedForReview(questions[currentQuestionIndex]._id)}
                            className="mt-3 text-sm text-purple-600 underline"
                        >
                            {markedForReview[questions[currentQuestionIndex]._id] ? "Unmark Review" : "Mark for Review"}
                        </button>
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                        disabled={currentQuestionIndex === 0}
                    >
                        ⬅️ Previous
                    </button>

                    <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Next ➡️
                    </button>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold text-base px-6 py-3 rounded-xl shadow-md transition duration-200"
                    >
                        🚀 Submit Final Paper
                    </button>
                </div>




            </div>
        </div>

    );
}

export default ExamPage;
