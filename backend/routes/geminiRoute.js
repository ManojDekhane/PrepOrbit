const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-explanation", async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !Array.isArray(options) || !correctAnswer) {
        return res.status(400).json({ msg: "Invalid input. Required: questionText, options (array), correctAnswer." });
    }

    const prompt = `
    Explain the following question in detail:
    Question: ${questionText}
    Options: ${options.join(", ")}
    Correct Answer: ${correctAnswer}

    Provide:
    1. Step-by-step explanation
    2. What concept is tested
    3. Common mistakes made by students
    4. One smart tip or shortcut
    `;

    try {
        // const models = await genAI.listModels();
        // console.log("Available Gemini Models:");
        // models.models.forEach(model => {
        //     console.log(`- ${model.name} (Supported Methods: ${model.supportedGenerationMethods?.join(", ")})`);
        // });

        const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ explanation: text });

    } catch (err) {
        console.error("Gemini API error:", err.message);
        res.status(500).json({ msg: "Failed to generate explanation" });
    }
});

module.exports = router;