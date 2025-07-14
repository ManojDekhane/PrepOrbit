import { useState } from "react";
import API from "../utils/axios";
import * as XLSX from "xlsx";

function AdminQuestionUpload() {
    const [exam, setExam] = useState("jee");
    const [year, setYear] = useState("");
    const [paperCode, setPaperCode] = useState("paper1");
    const [questions, setQuestions] = useState([
        { questionText: "", options: ["", "", "", ""], correctAnswer: "", subject: "", index: 1, imageUrl: "" }
    ]);

    const handleAddQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                questionText: "",
                options: ["", "", "", ""],
                correctAnswer: "",
                subject: "",
                index: prev.length + 1
            }
        ]);
    };


    const handleChange = (index, field, value) => {
        const updated = [...questions];
        if (["questionText", "correctAnswer", "subject", "index"].includes(field)) {
            updated[index][field] = field === "index" ? Number(value) : value;
        } else {
            updated[index].options[field] = value;
        }
        setQuestions(updated);
    };

    const handleDelete = (index) => {
        const upload = questions.filter((_, i) => i !== index);
        setQuestions(upload);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending payload:", { exam, year, questions });
        try {
            await API.post("/admin/add-questions", { exam, year, paperCode, questions });
            alert("Questions added successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to upload questions.");
        }
    };

    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            const formatted = data.map((row, idx) => ({
                questionText: row.questionText,
                options: [row.option1, row.option2, row.option3, row.option4],
                correctAnswer: row.correctAnswer,
                subject: row.subject || "",
                index: row.index || idx + 1
            }));

            setQuestions(formatted);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Question Uploader</h2>

            <div className="mb-4 space-x-4">
                <select value={exam} onChange={(e) => setExam(e.target.value)}>
                    <option value="jee">JEE</option>
                    <option value="neet">NEET</option>
                    <option value="gate">GATE</option>
                </select>
                <input
                    type="text"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                />
                <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />
                <input
                    type="text"
                    placeholder="Paper Code (e.g. paper1)"
                    value={paperCode}
                    onChange={(e) => setPaperCode(e.target.value)}
                    required
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {questions.map((q, idx) => (
                    <div key={idx} className="border p-3 rounded bg-gray-50">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Question #{idx + 1}</h4>
                            <button
                                type="button"
                                onClick={() => handleDelete(idx)}
                                className="text-red-600 text-sm hover:underline"
                            >
                                Delete
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Question Text"
                            value={q.questionText}
                            onChange={(e) => handleChange(idx, "questionText", e.target.value)}
                            className="w-full mb-2"
                            required
                        />
                        <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append("image", file);

                            try {
                                const res = await API.post("/upload/image", formData, {
                                    headers: { "Content-Type": "multipart/form-data" }
                                });

                                const updated = [...questions];
                                updated[idx].imageUrl = res.data.imageUrl;
                                setQuestions(updated);
                                alert("Image uploded successfully!");
                            } catch (err) {
                                console.error("Image upload failed", err);
                                alert("Failed to upload image.");
                            }
                        }}
                        className="mb-2"
                        />
                        {q.imageUrl && (
                            <img src={q.imageUrl} alt={`diagram-${idx+1}`} className="w-40 mb-2 border" />
                        )}

                        {q.options.map((opt, i) => (
                            <input
                                key={i}
                                type="text"
                                placeholder={`Option ${i + 1}`}
                                value={opt}
                                onChange={(e) => handleChange(idx, i, e.target.value)}
                                className="w-full mb-1"
                                required
                            />
                        ))}
                        <input
                            type="text"
                            placeholder="Correct Answer"
                            value={q.correctAnswer}
                            onChange={(e) => handleChange(idx, "correctAnswer", e.target.value)}
                            className="w-full mb-1"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            value={q.subject}
                            onChange={(e) => handleChange(idx, "subject", e.target.value)}
                            className="w-full mb-1"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Index"
                            value={q.index}
                            onChange={(e) => handleChange(idx, "index", e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                ))}

                <button type="button" onClick={handleAddQuestion} className="bg-gray-200 px-3 py-1 rounded">
                    + Add Another Question
                </button>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Upload Questions
                </button>
            </form>
        </div>
    );
}

export default AdminQuestionUpload;