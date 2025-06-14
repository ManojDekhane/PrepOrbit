const getQuestionModel = require("../models/getQuestionModel");

const fetchQuestionsByExamAndYear = async (req, res) => {
    const {exam , year, paperCode} = req.params;

    try {
        const Question = getQuestionModel(exam);
        const questions = await Question.find({year, paperCode}).sort({index: 1});

        if (!questions || questions.length === 0) {
            return res.status(400).json({msg: "No questions found for this exam/year"})
        }

        res.status(200).json(questions);

    } catch (err) {
        console.error("Error fetching questions: ", err.message);
        res.status(500).json({msg: "Server error while fetching questions"})
    }
};

module.exports = {
    fetchQuestionsByExamAndYear
};