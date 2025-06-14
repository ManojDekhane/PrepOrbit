import { useLocation, useNavigate } from "react-router-dom";

function ResultSummaryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, totalQuestions, answers, exam, year } = location.state || {};

    if (!location.state) {
        return <div className="p-6 text-red-600">No result data found. Please complete a paper first.</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">{exam.toUpperCase()} {year} - Result Summary</h2>
            <p className="text-lg mb-4 text-gray-700">You scored <strong>{score}</strong> out of <strong>{totalQuestions}</strong></p>

            <div className="space-y-4">
                {answers.map((ans, index) => (
                    <div key={index} className="border p-4 rounded bg-white shadow">
                        <p className="font-medium text-gray-800">Q{index + 1}:</p>
                        <p className="text-gray-600">Your Answer:
                            <span className={ans.selectedAnswer === ans.correctAnswer ? "text-green-600 font-semibold ml-2" : "text-red-600 font-semibold ml-2"}>
                                {ans.selectedAnswer || "No Answer"}
                            </span>
                        </p>
                        <p className="text-gray-600">Correct Answer: <span className="text-blue-600 font-semibold">{ans.correctAnswer}</span></p>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => navigate(`/${exam}/${year}`)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    🔁 Retake
                </button>
                <button
                    onClick={() => navigate("/my-attempts")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    📋 Go to My Attempts
                </button>
            </div>
        </div>
    );
}

export default ResultSummaryPage;