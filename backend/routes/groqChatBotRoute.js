const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const LLAMA_GROQ_API_KEY = process.env.LLAMA_GROQ_API_KEY;

router.post("/chatbot", async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ msg: "User message is required" });
    }

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [
                    {
                        role: "system",
                        content: "You are PrepBot, a helpful tutor for JEE, NEET, and GATE students. Answer questions clearly and concisely.",
                    },
                    {
                        role: "user",
                        content: userMessage,
                    }
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

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (err) {
        console.error("Groq AI error:", err.message);
        res.status(500).json({ msg: "Failed to generate reply" });
    }
});

module.exports = router;