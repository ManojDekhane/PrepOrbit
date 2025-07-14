const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    year: {type: String, required: true},
    paperCode: {type: String, required: true},
    subject: {type: String, required: true},
    questionText: {type: String, required: true},
    imageUrl: {type: String, required: false},
    options: {type: [String], required: true},
    correctAnswer: {type: String, required: true},
    index: {type: Number, required: true}
}, { timestamps: true });

const modelsCache = {};

function getQuestionModel(exam) {
    const modelName = exam.toLowerCase();

    if (!modelsCache[modelName]) {
        modelsCache[modelName] = mongoose.model(modelName, questionSchema, modelName);
    }

    return modelsCache[modelName];
}

module.exports = getQuestionModel;
