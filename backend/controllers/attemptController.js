const Attempt = require("../models/Attempt");
const User = require("../models/User");

const saveAttempt = async (req, res) => {
    const userId = req.user.userId;
    const { exam, year, answers, score, totalQuestions, timeTaken } = req.body;

    console.log("Saving attempt for user:", userId);
    console.log("Received body:", req.body);

    try {
        const attempt = new Attempt({
            userId,
            exam,
            year,
            score,
            totalQuestions,
            answers,
            timeTaken,
        });

        await attempt.save();

        const accuracy = score / totalQuestions;
        const attemptWeight = 1 + Math.log(totalQuestions); // log-scaled reward for long papers
        const pointsEarned = Math.round(accuracy * 100 * attemptWeight);

        await User.findByIdAndUpdate(userId, {
            $inc: { [`points.${exam}`]: pointsEarned }
        });

        res.status(201).json({ msg: "Attempt saved", attempt, pointsEarned });
    } catch (err) {
        console.error("Error saving attempt:", err.message);
        res.status(500).json({ msg: "Server error saving attempt" });
    }
}

const getMyAttempts = async (req, res) => {
    try {
        const attempts = await Attempt.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(attempts);
    } catch (err) {
        console.error("Error fetching attempts:", err.message);
        res.status(500).json({ msg: "Failed to fetch attempts" });
    }
}

module.exports = { saveAttempt, getMyAttempts };