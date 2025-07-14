const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const questionRoutes = require("./routes/questionRoutes");
const attemptRoutes = require("./routes/attemptRoute");
const adminRoutes = require("./routes/admin");
const metaRoutes = require("./routes/metaRoutes");
const uploadRoutes = require("./routes/uploadRoute");
const leaderBoardRoutes = require("./routes/leaderboard");
const geminiRoutes = require("./routes/geminiRoute");
const groqLlamaRoute = require("./routes/groqLlamaRoute");
const groqChatBotRoute = require("./routes/groqChatBotRoute");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://main.d14iyorx9ss47f.amplifyapp.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use("/api/auth", authRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/attempts", attemptRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/meta", metaRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/leaderboard", leaderBoardRoutes);

app.use("/api/gemini", geminiRoutes);

app.use("/api/groq", groqLlamaRoute);

app.use("/api/groqChatBot", groqChatBotRoute);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error("MongoDB connection failed: ", err.message);
});