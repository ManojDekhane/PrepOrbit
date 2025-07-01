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

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    // origin: "http://localhost:5173",
    origin: "https://main.d14iyorx9ss47f.amplifyapp.com",
    credentials: true
}))

app.use("/api/auth", authRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/attempts", attemptRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/meta", metaRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error("MongoDB connection failed: ", err.message);
});