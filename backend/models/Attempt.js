const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    exam: {type: String, required: true},
    year: {type: String, required: true},
    score: {type: Number, required: true},
    totalQuestions: {type: Number, required: true},
    answers: [
        {
            questionId: String,
            selectedAnswer: String,
            correctAnswer: String
        }
    ],
    timeTaken: {type: Number, default: 0},
}, {timestamps: true});

module.exports = mongoose.model("Attempt", attemptSchema);