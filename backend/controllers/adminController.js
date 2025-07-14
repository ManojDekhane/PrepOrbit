const User = require("../models/User");
const getQuestionModel = require("../models/getQuestionModel");

const uploadQuestions = async (req, res) => {
    const { exam, year, paperCode, questions } = req.body;

    if (!exam || !year || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ msg: "Invalid input format" });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: "Access denied. Admins only." });
        }

        const Question = getQuestionModel(exam.toLowerCase());

        const formattedQuestions = questions.map((q, idx) => ({
            questionText: q.questionText,
            imageUrl: q.imageUrl,
            options: q.options,
            correctAnswer: q.correctAnswer,
            subject: q.subject || "",
            year,
            paperCode,
            index: q.index || idx + 1
        }));

        const inserted = await Question.insertMany(formattedQuestions);

        res.status(201).json({ msg: "Questions uploaded successfully", inserted });
    } catch (err) {
        console.error("Error uploading questions: ", err);
        return res.status(500).json({ msg: "Server error" });
    }
}

module.exports = { uploadQuestions };