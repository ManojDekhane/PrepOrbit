import { useLocation, useNavigate } from "react-router-dom";

function ResultSummaryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, totalQuestions, answers, exam, year } = location.state || {};

    if (!location.state) {
        return (
            <div className="p-6 text-center text-red-600 text-lg font-semibold">
                ⚠️ No result data found. Please complete a paper first.
            </div>
        );
    }

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

            <div className="space-y-4">
                {answers.map((ans, index) => (
                    <div
                        key={index}
                        className={`border-l-4 ${
                            ans.selectedAnswer === ans.correctAnswer
                                ? "border-green-500"
                                : "border-red-500"
                        } bg-gray-50 p-4 rounded-md shadow-sm`}
                    >
                        <p className="font-medium text-gray-800 mb-1">
                            Q{index + 1}: {ans.questionText || ""}
                        </p>
                        <p className="text-gray-600">
                            Your Answer:
                            <span
                                className={`ml-2 font-semibold ${
                                    ans.selectedAnswer === ans.correctAnswer
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {ans.selectedAnswer || "No Answer"}
                            </span>
                        </p>
                        <p className="text-gray-600">
                            Correct Answer:{" "}
                            <span className="text-blue-600 font-semibold">
                                {ans.correctAnswer}
                            </span>
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                    onClick={() => navigate(`/${exam}/${year}`)}
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
