const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:exam", async (req, res) => {
    const { exam } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (!["jee", "neet", "gate"].includes(exam)) {
        return res.status(400).json({ msg: "Invalid exam" });
    }

    try {
        const topUsers = await User.find({ [`points.${exam}`]: { $gt: 0 } })
            .select("name email points")
            .sort({ [`points.${exam}`]: -1 })
            .limit(limit);

        res.json(topUsers);
    } catch (err) {
        console.error("Leaderboard error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;