const getQuestionModel = require("../models/getQuestionModel");

const getAvailableYears = async (req, res) => {
    const { exam } = req.params;

    try {
        const Question = getQuestionModel(exam);
        const years = await Question.distinct("year");
        res.json({ years });
    } catch (err) {
        console.error("Error fetching years:", err);
        res.status(500).json({ msg: "Server error fetching years" });
    }
};

const getPapersForYear = async (req, res) => {
    const { exam, year } = req.params;

    try {
        const Question = getQuestionModel(exam);
        const paperCodes = await Question.distinct("paperCode", { year });
        res.json({ paperCodes });
    } catch (err) {
        console.error("Error fetching papers:", err);
        res.status(500).json({ msg: "Server error fetching paper codes" });
    }
}

module.exports = { getAvailableYears, getPapersForYear };