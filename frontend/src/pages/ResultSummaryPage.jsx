import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../utils/axios";

function ResultSummaryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, totalQuestions, answers, exam, year, paperCode } = location.state || {};

    if (!location.state) {
        return (
            <div className="p-6 text-center text-red-600 text-lg font-semibold">
                ⚠️ No result data found. Please complete a paper first.
            </div>
        );
    }

    const [explanations, setExplanations] = useState(Array(answers.length).fill(""));
    const [loadingStates, setLoadingStates] = useState(Array(answers.length).fill(false));

    const generateExplanation = async (index, question) => {
        try {
            const updatedLoading = [...loadingStates];
            updatedLoading[index] = true;
            setLoadingStates(updatedLoading);

            const res = await API.post("/groq/generate-explanation", {
                questionText: question.questionText,
                options: question.options,
                correctAnswer: question.correctAnswer,
            });

            const updatedExplanations = [...explanations];
            updatedExplanations[index] = res.data.explanation;
            setExplanations(updatedExplanations);
        } catch (err) {
            console.error("Failed to generate explanation", err);
            const updatedExplanations = [...explanations];
            updatedExplanations[index] = "Failed to generate explanation.";
            setExplanations(updatedExplanations);
        } finally {
            const updatedLoading = [...loadingStates];
            updatedLoading[index] = false;
            setLoadingStates(updatedLoading);
        }
    }

    const correctCount = answers.filter(a => a.selectedAnswer === a.correctAnswer).length;
    const attemptedCount = answers.filter(a => a.selectedAnswer).length;
    const wrongCount = attemptedCount - correctCount;
    const unattemptedCount = answers.length - attemptedCount;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">
                    {exam.toUpperCase()} {year} - Result Summary
                </h2>
                <p className="text-xl text-gray-700">
                    ✅ You scored <span className="font-bold text-green-700">{score}</span> out of{" "}
                    <span className="font-bold text-gray-800">{totalQuestions}</span>
                </p>
            </div>

            <div className="mt-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm font-medium text-gray-800">
                <div className="bg-green-100 text-green-700 p-3 rounded shadow">✅ Correct: {correctCount}</div>
                <div className="bg-red-100 text-red-700 p-3 rounded shadow">❌ Wrong: {wrongCount}</div>
                <div className="bg-yellow-100 text-yellow-700 p-3 rounded shadow">✏️ Attempted: {attemptedCount}</div>
                <div className="bg-gray-100 text-gray-700 p-3 rounded shadow">⬜ Not Attempted: {unattemptedCount}</div>
            </div>


            <div className="space-y-4">
                {answers.map((ans, index) => (
                    <div
                        key={index}
                        className={`border-l-4 ${ans.selectedAnswer === ans.correctAnswer ? "border-green-500" : "border-red-500"
                            } bg-gray-50 p-4 rounded-md shadow-sm`}
                    >
                        <p className="font-medium text-gray-800 mb-1">
                            Q{index + 1}: {ans.questionText || ""}
                        </p>
                        <p className="text-gray-600">
                            Your Answer:
                            <span
                                className={`ml-2 font-semibold ${ans.selectedAnswer === ans.correctAnswer ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {ans.selectedAnswer || "No Answer"}
                            </span>
                        </p>
                        <p className="text-gray-600">
                            Correct Answer:{" "}
                            <span className="text-blue-600 font-semibold">{ans.correctAnswer}</span>
                        </p>

                        <button
                            onClick={() => generateExplanation(index, ans)}
                            disabled={loadingStates[index]}
                            className="mt-3 text-sm text-blue-700 hover:underline disabled:opacity-50"
                        >
                            {loadingStates[index] ? "Generating..." : "💡 Generate AI Explanation"}
                        </button>

                        {explanations[index] && (
                            <div className="mt-2 text-sm bg-white p-3 rounded border text-gray-700 whitespace-pre-wrap">
                                {explanations[index]}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                    onClick={() => navigate(`/exam/${exam}/${year}/${paperCode}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-5 py-2 rounded shadow"
                >
                    🔁 Retake Exam
                </button>
                <button
                    onClick={() => navigate("/my-attempts")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded shadow"
                >
                    📋 View My Attempts
                </button>
            </div>
        </div>
    );
}

export default ResultSummaryPage;
