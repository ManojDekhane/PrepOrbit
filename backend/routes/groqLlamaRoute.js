const express = require("express");
const axios = require("axios");
const router = express.Router();

const LLAMA_GROQ_API_KEY = process.env.LLAMA_GROQ_API_KEY;

router.post("/generate-explanation", async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !Array.isArray(options) || !correctAnswer) {
        return res.status(400).json({ msg: "Invalid input. Required: questionText, options (array), correctAnswer." });
    }

    const prompt = `
Explain this question:
Q: ${questionText}
Options: ${options.join(", ")}
Correct Answer: ${correctAnswer}

Include:
1. Step-by-step explanation
2. What concept is tested
3. Common mistakes
4. Smart tip or shortcut
`;

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 300,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${LLAMA_GROQ_API_KEY}`,
                },
            }
        );

        const explanation = response.data.choices?.[0]?.message?.content || "No explanation returned.";
        res.json({ explanation });

    } catch (err) {
        console.error("Groq API error:", err.message);
        res.status(500).json({ msg: "Failed to generate explanation" });
    }
});

module.exports = router;
